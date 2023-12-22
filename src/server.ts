import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { readFileSync } from 'node:fs';
import {
  MenuCategory,
  Order,
  Resolvers,
  Restaurant,
} from './graphql/__generated__/resolvers';
import { PoolClient } from 'pg';
import { Pool } from 'pg';
import { ApolloContext } from './context';
import { addListener } from 'process';

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'postgres',
  database: 'koffe',
  port: 5432,
});

const app = express();

const httpServer = http.createServer(app);

interface GetRestaurantQueryRow {
  restaurant_id: number;
  restaurant_name: string;
  restaurant_email: string;
  menu_id: number;
  active: boolean;
  category_id: number;
  category_name: string;
  icon: number;
  menuitem_id: number;
  menuitem_name: string;
  menuitem_price: number;
}

interface getAllRestaurantsQueryRow {
  restaurant_id: number;
  name: string;
  email: string;
}

interface getAllOrdersQueryRow {
  orderid: number;
  order_date: string;
  total_price: number;
  customer_name: string;
  pending: boolean;
}

const typeDefs = readFileSync('./schema/schema.graphql', 'utf-8');
const resolvers: Resolvers = {
  Query: {
    restaurant: async (_, { id }, { pg_client }) => {
      console.log({ id });
      let result = await pg_client.query<GetRestaurantQueryRow>(
        `SELECT * FROM get_restaurant(${!id ? 'NULL' : id});`
      );

      const categories: MenuCategory[] = [];
      const catMap = new Map<string, number>();

      result.rows.forEach((row) => {
        if (!catMap.has(row.category_name)) {
          catMap.set(row.category_name, categories.length);
          categories.push({
            id: row.category_id,
            icon: row.icon,
            item_count: 0,
            name: row.category_name,
            menu_items: [],
          });
        }
      });

      result.rows.forEach((row) => {
        const cat = categories[catMap.get(row.category_name)!];
        cat.item_count += 1;
        cat.menu_items.push({
          id: row.menuitem_id,
          name: row.menuitem_name,
          price: row.menuitem_price,
          description: 'jhhell',
        });
      });

      return {
        id: result.rows[0].restaurant_id,
        name: result.rows[0].restaurant_name,
        email: result.rows[0].restaurant_email,
        menus: [
          {
            id: result.rows[0].menu_id,
            active: true,
            categories: categories,
          },
        ],
      };
    },
    restaurants: async (_, __, { pg_client }) => {
      const restaurants: Restaurant[] = [];

      const result = await pg_client.query<getAllRestaurantsQueryRow>(
        'SELECT restaurant_id, name, email FROM restaurant'
      );

      result.rows.forEach((row) => {
        restaurants.push({
          email: row.email,
          id: row.restaurant_id,
          menus: [],
          name: row.name,
        });
      });

      return restaurants;
    },

    orders: async (_, __, { pg_client }) => {
      const orders: Order[] = [];

      const result = await pg_client.query<getAllOrdersQueryRow>(
        'SELECT * FROM get_all_orders'
      );

      result.rows.forEach((row) => {
        orders.push({
          customer_name: row.customer_name,
          order_date: row.order_date,
          order_id: row.orderid,
          status: row.pending ? 'Pending' : 'Finished',
          total_price: row.total_price,
        });
      });

      return orders;
    },
  },

  Mutation: {
    place_order: async (
      _,
      { customer_id, price, restaurant_id, items },
      { pg_client }
    ) => {
      const result = pg_client.query(
        `call place_order(${restaurant_id}, ${customer_id}, 
        ${price}, ARRAY[${items
          .map((item) => `ROW(${item[0]},${item[1]})`)
          .join(',')}]::t_order_menuitem[])`
      );
      return {
        order_date: 'hello',
        order_id: 2,
        total_price: 23,
        customer_name: 'James',
        status: 'pending',
      };
    },
    cancel_order: async (_, { id }, { pg_client }) => {
      const old = await pg_client.query<getAllOrdersQueryRow>(`
        SELECT
        orders.order_id AS orderId,
        order_date,
        total_price,
        customer.first_name AS customer_name,
        finish_date IS NULL AS pending 
        FROM orders JOIN customer ON orders.customer_id = customer.customer_id
        JOIN employee_order_status EOS ON EOS.order_id = orders.order_id WHERE orders.order_id = ${id};
      `);
      const result = await pg_client.query(
        `DELETE FROM orders WHERE order_id = ${id}`
      );

      console.log('delete order: ', { id });

      return {
        customer_name: old.rows[0].customer_name,
        order_date: old.rows[0].order_date,
        order_id: old.rows[0].orderid,
        status: old.rows[0].pending ? 'Pending' : 'Finished',
        total_price: old.rows[0].total_price,
      };
    },
    finish_order: async (_, { id }, { pg_client }) => {
      console.log('updating: ', id);
      const result = await pg_client.query(
        `UPDATE employee_order_status SET finish_date = NOW() WHERE order_id=${id}`
      );
      const old = await pg_client.query<getAllOrdersQueryRow>(`
        SELECT
        orders.order_id AS orderId,
        order_date,
        total_price,
        customer.first_name AS customer_name,
        finish_date IS NULL AS pending 
        FROM orders JOIN customer ON orders.customer_id = customer.customer_id
        JOIN employee_order_status EOS ON EOS.order_id = orders.order_id WHERE orders.order_id = ${id};
      `);
      return {
        customer_name: old.rows[0].customer_name,
        order_date: old.rows[0].order_date,
        order_id: old.rows[0].orderid,
        status: old.rows[0].pending ? 'Pending' : 'Finished',
        total_price: old.rows[0].total_price,
      };
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
  const pg_client: PoolClient = await pool.connect();

  const server = new ApolloServer<ApolloContext>({
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
      context: async () => {
        return {
          token: 'this is my token!!!',
          pg_client,
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
