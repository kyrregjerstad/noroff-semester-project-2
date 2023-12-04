export type Sort =
  | 'endsAt'
  | 'created'
  | 'price'
  | 'name'
  | 'email'
  | 'avatar'
  | 'credits';

export type Order = 'asc' | 'desc';

export type QueryParams = {
  sort?: Sort;
  order?: Order;
  _active?: boolean;
  _bids?: boolean;
  _seller?: boolean;
  _listings?: boolean;
  limit?: number;
  offset?: number;
};

export type SearchParams = {
  sort?: Sort;
  order?: Order;
  active?: string;
};

type ID = string;
type NAME = string;

export type BaseEndpoints =
  | '/auth/register'
  | '/auth/login'
  | '/profiles'
  | '/profiles/'
  | '/listings'
  | '/listings/';

export type GetEndpoints =
  | `/listings`
  | `/profiles`
  | `/listings/${ID}`
  | `/profiles/${NAME}`
  | `/profiles/${NAME}/listings`
  | `/profiles/${NAME}/bids`;

export type PostEndpoints =
  | `/auth/register`
  | `/auth/login`
  | `/listings`
  | `/listings/${ID}/bids`;

export type EndpointMethodMap = {
  '/auth/register': 'POST';
  '/auth/login': 'POST';
  '/listings': 'POST' | 'GET';
};

export type PutEndpoints = `/listings/${ID}` | `/profiles/${NAME}/media`;

export type DeleteEndpoints = `/listings/${ID}`;