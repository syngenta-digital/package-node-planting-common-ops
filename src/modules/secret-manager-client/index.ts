import { BatchGetSecretValueCommand, GetSecretValueCommand, GetSecretValueCommandInput, GetSecretValueCommandOutput, ListSecretsCommand, ListSecretsCommandInput, ListSecretsCommandOutput, SecretValueEntry, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { IGetAllSecretsInput, ISecretManagerPlantingClient } from './@types/ISecretManagerPlantingClient';
import { ISecretManagerPlantingClientConstructorParameters } from './@types/ISecretManagerPlantingClientConstructorParameters';
import { asyncify, doWhilst } from 'async';
import {  spawnSync } from 'child_process';


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


	private _getEffectiveENV() {
		const env = process.env.NODE_ENV ?? process.env.ENV;
		return env === 'production' ? 'prod' : env === 'staging' ? 'uat' : env;
	}

	private async _getAllSecretsCLI({ parseJson }: IGetAllSecretsInput) {
		let cmd = 'aws secretsmanager list-secrets --region eu-central-1';
		if (this._getEffectiveENV()) {
			cmd += ` --profile ${this._getEffectiveENV()?.toLowerCase()}`;
		}

		const actualSecrets: SecretValueEntry[] = [];
		let nextToken: string = undefined!;
		await doWhilst(
			asyncify(async () => {
				const { NextToken, SecretList } = JSON.parse(spawnSync(cmd, { encoding: 'utf8' }) as unknown as string);
				nextToken = NextToken!;
				if (SecretList?.length) {
					SecretList
						?.map((s: any) => s!.Name)
						?.forEach((s: string) => {
							const fetchActualSecretsCmd = `aws secretsmanager get-secret-value --secret-id ${s} --region eu-central-1 ${this._getEffectiveENV() ? ` --profile ${this._getEffectiveENV()?.toLowerCase}` : ''}`;
							const res = JSON.parse(spawnSync(fetchActualSecretsCmd, { encoding: 'utf8', shell: false }) as unknown as string);
							actualSecrets.push(res);
						});

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

	private async _getAllSecretsSDK({ parseJson }: IGetAllSecretsInput): Promise<Record<string, any>> {
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

	public async getAllSecrets({ parseJson }: IGetAllSecretsInput): Promise<Record<string, any>> {
		const strategy = this._params.strategy;

		if (strategy === 'cli') {
			return this._getAllSecretsCLI({ parseJson });
		}
		else
			return await this._getAllSecretsSDK({ parseJson });
	}


	public async getSingleSecret(params: GetSecretValueCommandInput): Promise<GetSecretValueCommandOutput | any> {

		if (this._params.strategy === 'cli') {
			return this._getSingleSecretCLI(params);
		}
		else
			return this._getSingleSecretSDK(params);
	}

	private async _getSingleSecretSDK(params: GetSecretValueCommandInput): Promise<GetSecretValueCommandOutput> {
		const cmd = new GetSecretValueCommand(params);
		const results = await this._secretManagerClient.send(cmd);
		return results;
	}

	private async _getSingleSecretCLI(params: GetSecretValueCommandInput): Promise<any> {
		let cmd = `aws secretsmanager get-secret-value --secret-id ${params.SecretId} --region eu-central-1 `;
		if (this._getEffectiveENV()) {
			cmd += ` --profile ${this._getEffectiveENV()?.toLowerCase()}`;
		}
		const res = JSON.parse(spawnSync(cmd, { encoding: 'utf8' }) as unknown as string);
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

	static generateSecretName(name: string) {
		const env = process.env.NODE_ENV ?? process.env.ENV;
		const effectiveEnv = env === 'production' ? 'prod' : env === 'staging' ? 'uat' : env;
		return `planting/${effectiveEnv}/${name}`;
	}
  
}
