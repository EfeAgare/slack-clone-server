import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv'

import typeDefs from './graphql/typeDef';
import resolvers from './graphql/resolvers';

import models from './db/models';


dotenv.config()

const app = express();

const PORT = 8000;

const secret = process.env.SECRET



/// body can only be string or arrays
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  context: ({ req, res }) => ({ req, res, models, secret })
});

server.applyMiddleware({ app });

app.listen(PORT, () =>
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  )
);
