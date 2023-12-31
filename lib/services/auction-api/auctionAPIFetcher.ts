/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ZodSchema } from 'zod';
import { API_BASE_URL } from '../../constants';
import {
  DeleteEndpoints,
  GetEndpoints,
  PostEndpoints,
  PutEndpoints,
  QueryParams,
} from './types';
import { createZodFetcher } from '../zodFetcher';

const fetchWithZod = createZodFetcher();

type BaseParams<TData> = {
  endpoint: GetEndpoints | PostEndpoints | PutEndpoints | DeleteEndpoints;
  schema: ZodSchema<TData, any, any>;
  jwt?: string;
};

type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';

type RequestParams<
  TData,
  TMethod extends Methods = 'GET',
> = BaseParams<TData> & {
  method?: TMethod;
  body?: TMethod extends 'POST' | 'PUT' ? any : never;
  queryParams?: TMethod extends 'GET' ? Partial<QueryParams> : never;
};

async function auctionAPIFetcher<TData, TMethod extends Methods = 'GET'>(
  params: RequestParams<TData, TMethod>,
): Promise<TData> {
  const { endpoint, schema, jwt, queryParams, body } = params;
  const method = params.method || 'GET';

  const url = new URL(API_BASE_URL + endpoint);

  if (queryParams) {
    appendQueryParams(url, queryParams);
  }

  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  if (jwt) {
    headers.append('Authorization', `Bearer ${jwt}`);
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET' && method !== 'DELETE') {
    options.body = JSON.stringify(body);
  }

  try {
    if (method === 'DELETE') {
      const res = await fetch(url.toString(), options);
      if (!res.ok) {
        try {
          const data = await res.json();
          return Promise.reject(data);
        } catch (error) {
          throw new Error(res.statusText);
        }
      }
    }
    const res = await fetchWithZod(schema, url.toString(), options);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default auctionAPIFetcher;

export const appendQueryParams = (
  url: URL,
  queryParams: Record<string, any>,
) => {
  Object.entries(queryParams).forEach(([key, value]) => {
    if (!value) return;
    url.searchParams.append(key, value.toString());
  });
};
