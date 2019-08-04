import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer, gql } from 'apollo-server-express';
import dotenv from 'dotenv'

import typeDefs from './graphql/typeDef';
import resolvers from './graphql/resolvers';

dotenv.config()

const app = express();

const PORT = 8000;



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
  context: ({ req, res }) => ({ req, res })
});

server.applyMiddleware({ app });

app.listen(PORT, () =>
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  )
);
