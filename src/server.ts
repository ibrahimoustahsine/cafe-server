import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { readFileSync } from 'node:fs';
import { Resolvers, Restaurant } from './graphql/__generated__/resolvers';

interface apolloContext {
  token: string;
}

const app = express();

const httpServer = http.createServer(app);

const data = {
  restaurants: [
    {
      id: 25,
      name: "L'empreinte",
      email: 'lempreint@gmail.com',
    },
    {
      id: 28,
      name: 'Forest',
      email: 'forest@gmail.com',
    },
  ],
  menus: [
    {
      id: 25,
      active: true,
      categories: [
        {
          id: 20,
          name: 'Soups',
          icon: 12,
          item_count: 12,
          menu_items: [
            {
              id: 10,
              name: 'beef soup',
              price: 12.3,
              description: 'this is the product description',
            },
          ],
        },
      ],
    },
    {
      id: 24,
      active: false,
      categories: [
        {
          id: 20,
          name: 'Soups',
          icon: 12,
          item_count: 12,
          menu_items: [
            {
              id: 10,
              name: 'beef soup',
              price: 12.3,
              description: 'this is the product description',
            },
          ],
        },
      ],
    },
  ],
};

const typeDefs = readFileSync('./schema/schema.graphql', 'utf-8');
const resolvers: Resolvers = {
  Query: {
    restaurant: (_, { id }) => {
      console.log({ id });
      return {
        ...data.restaurants[0],
        menus: data.menus,
      };
    },
    restaurants: () => {
      const restaurants: Restaurant[] = [];
      data.restaurants.forEach((r) => {
        restaurants.push({
          ...r,
          menus: [],
        });
      });
      return restaurants;
    },
  },

  Restaurant: {
    menus: (parent, { onlyActive }) => {
      if (onlyActive)
        parent.menus = parent.menus.filter((menu) => menu?.active == true);
      return parent.menus;
    },
  },
};

async function main() {
  const server = new ApolloServer<apolloContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        return {
          token: 'this is my token!!!',
        };
      },
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/`);
}

main();
