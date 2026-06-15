export const appEnvironments = ['local', 'dev', 'hml', 'prod'] as const;

export type AppEnvironment = (typeof appEnvironments)[number];
