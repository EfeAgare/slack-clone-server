import { formatErrors } from '../../utils/formatError';
import { requiresAuth } from '../../utils/permissions';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { withFilter, PubSub } from 'graphql-subscriptions';
import { GraphQLDateTime } from 'graphql-iso-date';

const pubsub = new PubSub();

const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

export default {
  Subscription: {
    newChannelMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
        (payload, args) => {
          return payload.channelId === args.channelId;
        }
      )
    }
  },
  Message: {
    user: async ({ user, UserId }, args, { models }) => {
      if (user) {
        return user;
      }
      return await models.User.findOne({ where: { id: UserId } });
    }
  },
  Query: {
    channelMessages: requiresAuth.createResolver(
      async (root, args, { models }, info) => {
        try {
          return await models.Message.findAll(
            {
              order: [['createdAt', 'ASC']],
              where: { ChannelId: args.channelId }
            },
            { raw: true }
          );
        } catch (error) {
          return {
            ok: false,
            errors: formatErrors(error, models)
          };
        }
      }
    )
  },

  Mutation: {
    createMessage: requiresAuth.createResolver(
      async (root, args, { models, user }, info) => {
        try {
          const message = await models.Message.create({
            text: args.text,
            UserId: user.id,
            ChannelId: args.channelId
          });

          const asyncFunc = async () => {
            const currentUser = await models.User.findOne({
              where: {
                id: user.id,
              },
            });
  
            pubsub.publish(NEW_CHANNEL_MESSAGE, {
              channelId: args.channelId,
              newChannelMessage: {
                ...message.dataValues,
                user: currentUser.dataValues,
              },
            });
          };
  
          asyncFunc();

          return { ok: true };
        } catch (error) {
          return {
            ok: false,
            errors: formatErrors(error, models)
          };
        }
      }
    )
  },
  WorkSpace: {
    channels: async ({ id }, args, { models }) => {
      return models.Channel.findAll({ where: { WorkSpaceId: id } });
    }
  },
  DateTime: new GraphQLScalarType({
    type: GraphQLDateTime,
    name: 'DateTime',
    description: 'DateTime custom scalar type',

    parseValue(value) {
      return new Date(Date.UTC(value)); // value from the client
    },
    // serialize(value) {
    //   return value.getTime(); // value sent to the client
    // },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(Date.UTC(ast.value)); // ast value is always in string format
      }
      return null;
    }
  })
};
