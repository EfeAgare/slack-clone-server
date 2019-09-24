import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import http from 'http';
import jwt from 'jsonwebtoken';
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

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  context: async ({ req, res, connection }) => {
    if (connection) {
      return {
        ...connection.context
        // pubsub
      };
    } else {
      const token = req.headers['x-token'] || '';
      const refreshToken = req.headers['x-refresh-token'] || '';
      const user = await getUser(token, refreshToken, secret, models, res);
      return { req, res, models, secret, user };
    }
  },
  subscriptions: {
    onConnect: async ({ token, refreshToken }, webSocket) => {
      console.log('Connected.');

      if (token && refreshToken) {
        
        let user = '';
        try {
          const payload = jwt.verify(token, secret);
          user = payload.user;
        } catch (err) {
          const newTokens = await getUser(
            token,
            refreshToken,
            secret,
            models
          );
          user = newTokens.user;
        }
        if (!user) {
          throw new Error('Invalid auth tokens');
        }

        // const member = await models.Member.findOne({
        //   where: { teamId: 1, userId: user.id }
        // });

        // if (!member) {
        //   throw new Error('Missing auth tokens!');
        // }

        return true;
      }

      throw new Error('Missing auth tokens!');
    },
    onDisconnect: async () => {
      console.log('Disconnected.');
    }
  }
});

apolloServer.applyMiddleware({ app });

const httpServer = http.createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);

models.sequelize.sync({}).then(() => {
  // when using subscription
  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`
    );
  });

  // // when not using subscription
  // app.listen(PORT, () =>
  //   console.log(
  //     `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  //   )
  // );
});
