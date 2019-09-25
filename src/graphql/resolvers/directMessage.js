import { formatErrors } from '../../utils/formatError';
import { requiresAuth } from '../../utils/permissions';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { withFilter, PubSub } from 'graphql-subscriptions';
import { GraphQLDateTime } from 'graphql-iso-date';
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

const pubsub = new PubSub();

const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

export default {
  Subscription: {
    // newChannelMessage: {
    //   subscribe: requiresWorkSpaceAccess.createResolver(
    //     withFilter(
    //       (parent, args, { user, models }) =>
    //         pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
    //       (payload, args) => {
    //         console.log('here');
    //         return payload.channelId === args.channelId;
    //       }
    //     )
    //   )
    // }
  },
  DirectMessage: {
    sender: async ({ sender, UserId }, args, { models }) => {
      if (sender) {
        return sender;
      }
      return await models.User.findOne({ where: { id: UserId } });
    }
  },
  Query: {
    directMessages: requiresAuth.createResolver(
      async (root, { workSpaceId, otherUserId }, { models, user }, info) => {
        try {
      
          return await models.DirectMessage.findAll(
            {
              order: [['createdAt', 'ASC']],
              distinct: true,
              where: {
                WorkSpaceId: workSpaceId,
                [Op.or]: [
                  {
                    [Op.and]: [{ receiverId: otherUserId }, { UserId: user.id }]
                  },
                  {
                    [Op.and]: [{ receiverId: user.id }, { UserId: otherUserId }]
                  }
                ]
              }
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
    createDirectMessage: requiresAuth.createResolver(
      async (root, args, { models, user }, info) => {
        try {
          // console.log(args)
          await models.DirectMessage.create({
            text: args.text,
            UserId: user.id,
            receiverId: args.receiverId,
            WorkSpaceId: args.workSpaceId
          });

          // console.log(message)

          // const asyncFunc = async () => {
          //   const currentUser = await models.User.findOne({
          //     where: {
          //       id: user.id
          //     }
          //   });

          //   pubsub.publish(NEW_CHANNEL_MESSAGE, {
          //     channelId: args.channelId,
          //     newChannelMessage: {
          //       ...message.dataValues,
          //       user: currentUser.dataValues
          //     }
          //   });
          // };

          // asyncFunc();

          return true;
        } catch (error) {
          return {
            ok: false,
            errors: formatErrors(error, models)
          };
        }
      }
    )
  },

};
