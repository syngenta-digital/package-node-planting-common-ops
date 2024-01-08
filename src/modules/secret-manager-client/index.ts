import { BatchGetSecretValueCommand, BatchGetSecretValueCommandInput, BatchGetSecretValueCommandOutput, GetSecretValueCommand, GetSecretValueCommandInput, GetSecretValueCommandOutput, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { ISecretManagerPlantingClient } from './@types/ISecretManagerPlantingClient';
import { ISecretManagerPlantingClientConstructorParameters } from './@types/ISecretManagerPlantingClientConstructorParameters';


/**
 * 
 */
export class SecretManagerPlantingClient implements ISecretManagerPlantingClient {

  private readonly _secretManagerClient: SecretsManagerClient;

  constructor(private readonly _params: ISecretManagerPlantingClientConstructorParameters) {
    this._secretManagerClient = new SecretsManagerClient({ region: this._params.region });
  }

  public async batchGetSecrets(params?: BatchGetSecretValueCommandInput): Promise<BatchGetSecretValueCommandOutput> {
    const cmd = new BatchGetSecretValueCommand(params ?? {});
    const results = await this._secretManagerClient.send(cmd);
    return results;
  }


  public async getSecret(params: GetSecretValueCommandInput): Promise<GetSecretValueCommandOutput> {
    const cmd = new GetSecretValueCommand(params);
    const results = await this._secretManagerClient.send(cmd);
    return results;
  }


  public async loadSecretsInEnvironment() {
    const {NextToken, SecretValues} = await this.batchGetSecrets();


  }

}