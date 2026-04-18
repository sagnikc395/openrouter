export namespace ModelsModel {
  export interface ModelInfo {
    id: string;
    name: string;
    slug: string;
    company: {
      id: string;
      name: string;
      website: string;
    };
  }

  export interface GetModelsResponse {
    models: ModelInfo[];
  }

  export interface ProviderInfo {
    id: string;
    name: string;
    website: string;
  }

  export interface GetProvidersResponse {
    providers: ProviderInfo[];
  }

  export interface GetModelProvidersResponse {
    providers: {
      id: string;
      providerId: string;
      providerName: string;
      providerWebsite: string;
      inputTokenCost: number;
      outputTokenCost: number;
    }[];
  }
}
