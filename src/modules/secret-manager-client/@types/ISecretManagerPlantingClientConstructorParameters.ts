import { SecretsManagerClientConfig } from '@aws-sdk/client-secrets-manager';

export interface ISecretManagerPlantingClientConstructorParameters extends SecretsManagerClientConfig {
  retryTimes: number;
}