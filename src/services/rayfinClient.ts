import { RayfinClient } from '@microsoft/rayfin-client';

import type { TodoAppSchema } from '../../rayfin/data/schema';
import type { AppFunctionsSchema } from '../../rayfin/functions/src/types';

export interface RayfinClientConfig {
  baseUrl: string;
  publishableKey: string;
}

let client: RayfinClient<TodoAppSchema, AppFunctionsSchema> | null = null;

export function initRayfinClient(
  config: RayfinClientConfig
): RayfinClient<TodoAppSchema, AppFunctionsSchema> {
  if (client) {
    throw new Error('Rayfin client is already initialized.');
  }
  client = new RayfinClient<TodoAppSchema, AppFunctionsSchema>({
    baseUrl: config.baseUrl,
    publishableKey: config.publishableKey,
    useProxy: false,
    authStorage: true,
  });
  return client;
}

export function getRayfinClient(): RayfinClient<TodoAppSchema, AppFunctionsSchema> {
  if (!client) {
    throw new Error(
      'Rayfin client not initialized. Call bootstrapAuth() first.'
    );
  }
  return client;
}

export const rayfinClient = {
  init: initRayfinClient,
  get: getRayfinClient,
};
