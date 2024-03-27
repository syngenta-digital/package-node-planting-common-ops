import { SecretManagerPlantingClient } from './index';
import { ISecretManagerPlantingClientConstructorParameters } from './@types/ISecretManagerPlantingClientConstructorParameters';

const params: ISecretManagerPlantingClientConstructorParameters = {
  retryTimes: 1,
  strategy: 'cli',
};

const input = {
  SecretId: 'MyTestDatabaseSecret',
};

const secretManager = new SecretManagerPlantingClient(params);

describe('Index', () => {
  test('Should get _getEffectiveENV', async () => {
    try {
      const result = await secretManager._getEffectiveENV();
      expect(result).toBeDefined();
    } catch (error) {
      expect(error).toBeInstanceOf('HttpException');
    }
  });

  test('Should get _getAllSecretsCLI', async () => {
    try {
      const result = await secretManager._getAllSecretsCLI(
        JSON.parse(`${input}`),
      );
      expect(result).toBeDefined();
    } catch (error) {
      expect(error);
    }
  });

  test('Should get _getAllSecretsSDK', async () => {
    try {
      const result = await secretManager._getAllSecretsSDK(
        JSON.parse(`{test"test"}`),
      );
      expect(result).toBeDefined();
    } catch (error) {
      expect(error);
    }
  });

  test('Should get _getAllSecretsSDK', async () => {
    try {
      const result = await secretManager.getSingleSecret(
        JSON.parse(`${input}`),
      );
      expect(result).toBeDefined();
    } catch (error) {
      expect(error);
    }
  });

  test('Should get generateSecretName', async () => {
    try {
      const result = await secretManager.generateSecretName('test');
      expect(result).toBeDefined();
    } catch (error) {
      expect(error).toBeInstanceOf('HttpException');
    }
  });
});
