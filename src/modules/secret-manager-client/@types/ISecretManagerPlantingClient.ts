import { BatchGetSecretValueCommandInput, BatchGetSecretValueCommandOutput, SecretsManagerClientConfig } from '@aws-sdk/client-secrets-manager';

export interface ISecretManagerPlantingClient  {

  batchGetSecrets(params: BatchGetSecretValueCommandInput): Promise<BatchGetSecretValueCommandOutput>;
}