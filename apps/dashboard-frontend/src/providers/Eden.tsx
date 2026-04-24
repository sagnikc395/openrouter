import { createContext, useContext } from "react";

type ApiResult<T> =
  | { data: T; error: null }
  | { data: null; error: { status: number; value: unknown } };

type AuthPayload = {
  email: string;
  password: string;
};

type ApiKeyPayload = {
  name: string;
};

type ApiKeyTogglePayload = {
  id: string;
  disabled: boolean;
};

const getApiBaseUrl = () => {
  if (typeof window === "undefined") {
    return "http://localhost:3000";
  }

  return `${window.location.protocol}//${window.location.hostname}:3000`;
};

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as T) : null;

  if (!response.ok) {
    return {
      data: null,
      error: {
        status: response.status,
        value: payload,
      },
    };
  }

  return {
    data: payload as T,
    error: null,
  };
}

const client = {
  auth: {
    "sign-in": {
      post: (body: AuthPayload) =>
        request<{ message: string }>("/auth/sign-in", {
          method: "POST",
          body: JSON.stringify(body),
        }),
    },
    "sign-up": {
      post: (body: AuthPayload) =>
        request<{ id: string }>("/auth/sign-up", {
          method: "POST",
          body: JSON.stringify(body),
        }),
    },
    profile: {
      get: () => request<{ credits: number }>("/auth/profile"),
    },
    "sign-out": {
      post: () =>
        request<{ message: string }>("/auth/sign-out", {
          method: "POST",
        }),
    },
  },
  "api-keys": Object.assign(
    (params: { id: string }) => ({
      delete: () =>
        request<{ message: string }>(`/api-keys/${params.id}`, {
          method: "DELETE",
        }),
    }),
    {
      get: () =>
        request<{
          apiKeys: Array<{
            id: string;
            apiKey: string;
            name: string;
            creditsConsumed: number;
            lastUsed: string | null;
            disabled: boolean;
          }>;
        }>("/api-keys"),
      post: (body: ApiKeyPayload) =>
        request<{ id: string; apiKey: string }>("/api-keys", {
          method: "POST",
          body: JSON.stringify(body),
        }),
      put: (body: ApiKeyTogglePayload) =>
        request<{ message: string }>("/api-keys", {
          method: "PUT",
          body: JSON.stringify(body),
        }),
    },
  ),
  models: {
    get: () =>
      request<{
        models: Array<{
          id: string;
          name: string;
          slug: string;
          company: {
            id: string;
            name: string;
            website: string;
          };
        }>;
      }>("/models"),
  },
  payments: {
    onramp: {
      post: () =>
        request<{ message: string; credits: number }>("/payments/onramp", {
          method: "POST",
        }),
    },
  },
};

const ElysiaClientContext = createContext(client);

export const ElysiaClientContextProvider = ElysiaClientContext.Provider;
export const useElysiaClient = () => useContext(ElysiaClientContext);
