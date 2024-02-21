import { GetSecretValueCommandInput, GetSecretValueCommandOutput } from '@aws-sdk/client-secrets-manager';

export interface ISecretManagerPlantingClient {

  /**
   * 
   * @param params GetSecretValueCommandInput
   * @description Gets a single secret from the AWS Secrets Manager
   */
  getSingleSecret(params: GetSecretValueCommandInput): Promise<GetSecretValueCommandOutput>;

  /**
   * 
   * @param params IGetAllSecretsInput
   * @description Gets all the secrets from the secret store from AWS Secrets Manager
   */
  getAllSecrets(params?: IGetAllSecretsInput): Promise<Record<string, any>>;

  /**
   * 
   * @param secretName Name of the Secret
   * @param parseJson If you want to parse the value from String to JSON
   * @description Once Secrets are fetched they are stored in a local object to avoid refetching to the cloud
   * This function will fetch the secret from the local store
   */
  getSecretLocal(secretName: string, parseJson: boolean): any;

  /**
   * @description Fetches the entire local secret store
   */
  getAllSecretsLocal(): Record<string, any>;

  /**
   * @description Loads the secrets from the local store to the process's environment
   */
  loadAllSecrstsInEnvironment(): Promise<void>;

  /**
   * @description Generates the secretname name for
   * the required secrets within the planting ecosystem
   * @param name if the secretname is `planting/dev/authentication` then
   * name should be `authentication`. The function will return
   * `planting/dev/authenticatio`
   */
  generateSecretName?(name: string): string;
  
}

export interface IGetAllSecretsInput {
  parseJson: boolean;
}
