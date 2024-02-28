#!/usr/bin/env node

/**
 * @author Vansham Aggarwal <vansham.aggarwal@syngenta.com>
 * @description We are storing the combined env configuration in this package
 * The purpose of this script is to copy the environment files to the root of
 * the project in which they are needed.
 *
 * This promotes security and the lesser chance of side effects.
 * Every project gets it own copy of the env files yet the source of truth
 * remains single. Execute this script using "npx pco" command.
 * This step should ideally be performed in the CICD
 */

import { resolve } from 'path';
import { stat, cp } from 'fs/promises';
import { each, asyncify } from 'async';

/**
 * Main script starts here
 */
(async () => {
  // 'staging' and 'production' are provider for backward
  // compatibility for AZURE DEPLOYMENTS. Must be removed
  // in future
  const envs = ['dev', 'qa', 'staging', 'uat', 'prod', 'production'];
  await each(
    envs,
    asyncify(async (env: string) => {
      const srcPath = resolve(
        `node_modules/@syngenta-digital/planting-common-ops/src/modules/env/.env.${env}`,
      );
      if (!(await doesFileExists(srcPath))) {
        return false;
      }
      await cp(srcPath, resolve(`.env.${env}`));
      return true;
    }),
  );
})();

/**
 * CHECKS WHETHER A FILE EXISTS AT A
 * PARTICULAR LOCATION OR NOT
 */
async function doesFileExists(path: string) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    console.warn(`== FILE "${path}" DOES NOT EXIST ==`);
    return false;
  }
}
