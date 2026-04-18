export namespace ApiKeyModel {
  export interface CreateApiKeySchema {
    name: string;
  }

  export interface CreateApiKeyResponse {
    id: string;
    apiKey: string;
  }

  export interface UpdateApiKeySchema {
    id: string;
    disabled: boolean;
  }

  export interface UpdateApiKeyResponse {
    message: "Updated api key successfully";
  }

  export interface DisableApiKeyResponseFailed {
    message: "Updating api key unsuccessful";
  }

  export interface ApiKeyInfo {
    id: string;
    apiKey: string;
    name: string;
    creditsConsumed: number;
    lastUsed: Date | null;
    disabled: boolean;
  }

  export interface GetApiKeysResponse {
    apiKeys: ApiKeyInfo[];
  }

  export interface DeleteApiKeyResponse {
    message: "Api key deleted successfully";
  }

  export interface DeleteApiKeyResponseFailed {
    message: "Api key deletetion failed";
  }
}
