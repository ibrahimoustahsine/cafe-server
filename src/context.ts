import { PoolClient } from 'pg';

export interface ApolloContext {
  token: string;
  pg_client: PoolClient;
}
