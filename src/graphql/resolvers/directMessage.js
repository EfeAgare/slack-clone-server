import { formatErrors } from '../../utils/formatError';
import { requiresAuth, directMessageSubscription } from '../../utils/permissions';
import { withFilter } from 'graphql-subscriptions';
import Sequelize from 'sequelize';
import pubsub from '../pubsub/pubsub';

const Op = Sequelize.Op;



const NEW_DIRECT_MESSAGE = 'NEW_DIRECT_MESSAGE';

export default {
  Subscription: {
    displayDirectMessage: {
      subscribe: directMessageSubscription.createResolver(
        withFilter(
          (parent, args, { user, models }) =>
            pubsub.asyncIterator(NEW_DIRECT_MESSAGE),
          (payload, args, { user }) => {
            return  payload.workSpaceId === args.workSpaceId && ((payload.senderId === user.id && payload.receiverId === args.receiverId) ||
              (payload.senderId === args.receiverId && payload.receiverId === user.id))
          }
        )
      )
    }
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
              // distinct: true,
              where: {
                WorkSpaceId: workSpaceId,
                [Op.or]: [
                  {
                    [Op.and]: [{ receiverId: user.id }, { UserId: otherUserId }]
                  },
                  {
                    [Op.and]: [{ receiverId: otherUserId }, { UserId: user.id }]
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
          const message = await models.DirectMessage.create({
            text: args.text,
            UserId: user.id,
            receiverId: args.receiverId,
            WorkSpaceId: args.workSpaceId
          });

            pubsub.publish(NEW_DIRECT_MESSAGE, {
              receiverId: args.receiverId,
              workSpaceId: args.workSpaceId,
              senderId: user.id,
              displayDirectMessage: {
                ...message.dataValues,
                sender: {
                  username: user.username,
                }
              }
            });
          


          return true;
        } catch (error) {
          return {
            ok: false,
            errors: formatErrors(error, models)
          };
        }
      }
    )
  }
};
