// Target the module containing the `ProcessEnv` interface
// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
declare namespace NodeJS {
  // Merge the existing `ProcessEnv` definition with ours
  // https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
  export interface ProcessEnv {
    NEXT_PUBLIC_ABLY_API_KEY: string
    NEXT_PUBLIC_ABLY_CHANNEL_NAME: string

    COSMOS_ENDPOINT: string
    COSMOS_KEY: string
  }
}
