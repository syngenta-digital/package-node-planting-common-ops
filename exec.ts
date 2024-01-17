import { SecretManagerPlantingClient } from './src/modules/secret-manager-client';

(async () => {
  const client = new SecretManagerPlantingClient({ region: 'eu-central-1', retryTimes: 0 });

  const response = await client.getAllSecrets({parseJson: true});

  console.dir(await client.loadAllSecrstsInEnvironment());

})();