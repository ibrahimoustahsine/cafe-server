import type { CodegenConfig } from '@graphql-codegen/cli';
import path from 'path';

const config: CodegenConfig = {
  schema: './schema/schema.graphql',
  generates: {
    './src/graphql/__generated__/resolvers.ts': {
      config: {
        useIndexSignature: true,
        contextType: path.join(__dirname + '/src/context#ApolloContext'),
      },
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
};

export default config;
