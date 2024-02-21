import { BatchGetSecretValueCommand, GetSecretValueCommand, GetSecretValueCommandInput, GetSecretValueCommandOutput, ListSecretsCommand, ListSecretsCommandInput, ListSecretsCommandOutput, SecretValueEntry, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { IGetAllSecretsInput, ISecretManagerPlantingClient } from './@types/ISecretManagerPlantingClient';
import { ISecretManagerPlantingClientConstructorParameters } from './@types/ISecretManagerPlantingClientConstructorParameters';
import { asyncify, doWhilst } from 'async';


/**
 * @author Vansham Aggarwal <vansham.aggarwal@syngenta.com>
 * @description Implements a custom wrapper over the AWS Secrets Manager Common Ops
 * This is not really Cropwise Planting Specific and can be used by anyone. Although,
 * we are only including the functions which are required by the Cropwise Planting Backend.
 */
export class SecretManagerPlantingClient implements ISecretManagerPlantingClient {

	private readonly _secretManagerClient: SecretsManagerClient;
	private _secretStore: Record<string, any> = {};

	constructor(private readonly _params: ISecretManagerPlantingClientConstructorParameters) {
		this._secretManagerClient = new SecretsManagerClient({ region: this._params.region });
	}


	public async getSingleSecret(params: GetSecretValueCommandInput): Promise<GetSecretValueCommandOutput> {
		const cmd = new GetSecretValueCommand(params);
		const results = await this._secretManagerClient.send(cmd);
		return results;
	}

	public async getAllSecrets({ parseJson }: IGetAllSecretsInput): Promise<Record<string, any>> {
		const actualSecrets: SecretValueEntry[] = [];
		let nextToken: string = undefined!;
		await doWhilst(
			asyncify(async () => {
				const { NextToken, SecretList } = await this._secretManagerClient.send(new ListSecretsCommand({ NextToken: nextToken }));
				nextToken = NextToken!;
				if (SecretList?.length) {
					const secrets = SecretList?.map(s => s!.Name);
					const fetchActualSecretsCmd = new BatchGetSecretValueCommand({ SecretIdList: secrets as any });
					const { SecretValues } = await this._secretManagerClient.send(fetchActualSecretsCmd);
					actualSecrets.push(...SecretValues!);
				}
			}),
			async () => nextToken
		);

		this._secretStore = actualSecrets?.reduce((acc, next) => {
			try {
				return { ...acc, [next!.Name!]: parseJson ? JSON.parse(next.SecretString!) : next.SecretString! };
			}
			catch (error) {
				console.error(`Error while parsing the secret value of the key "${next!.Name}". Please check if the values are stored in proper JSON format `);
				return acc;
			}
		}, {});

		return this._secretStore;

	}

	public getSecretLocal(secretName: string, parseJson: boolean) {
		return parseJson ? JSON.parse(this._secretStore[secretName]) : this._secretStore[secretName];
	}

	public getAllSecretsLocal() {
		return this._secretStore;
	}

	public async loadAllSecrstsInEnvironment() {
		await this.getAllSecrets({ parseJson: false });
		for (const [key, value] of Object.entries(this._secretStore)) {
			const finalValue = value instanceof String ? value : JSON.stringify(value) as string;
			process.env = { ...process.env, [key]: finalValue.toString() };
		}
	}

	public static generateSecretName(name: string) {
		const env = process.env.NODE_ENV ?? process.env.ENV;
		const effectiveEnv = env === 'production' ? 'prod' : env === 'staging' ? 'uat' : env;
		return `planting/${effectiveEnv}/${name}`;
	}

}

