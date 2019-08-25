import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import cors from 'cors';

import typeDefs from './graphql/typeDef';
import resolvers from './graphql/resolvers';

import models from './db/models';

import { getUser } from './utils/auth';

dotenv.config();

const app = express();

const PORT = 8000;

const secret = process.env.SECRET;

app.use(cors('*'));
/// body can only be string or arrays
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

// app.use(getUser);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  context: async ({ req, res }) => {
    
    const token = req.headers['x-token'] || '';
    const refreshToken = req.headers['x-refresh-token'] || '';
    const user = await getUser(token, refreshToken, secret, models, res);
    return { req, res, models, secret, user };
  }
});

server.applyMiddleware({ app });

app.listen(PORT, () =>
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  )
);
