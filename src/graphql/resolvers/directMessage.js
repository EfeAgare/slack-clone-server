import { formatErrors } from '../../utils/formatError';
import { requiresAuth, directMessageSubscription } from '../../utils/permissions';
import { withFilter } from 'graphql-subscriptions';
import Op from '../../utils/Op'
import pubsub from '../pubsub/pubsub';
import cloudinary from '../cloudinary';



const NEW_DIRECT_MESSAGE = 'NEW_DIRECT_MESSAGE';

export default {
  Subscription: {
    displayDirectMessage: {
      subscribe: directMessageSubscription.createResolver(
        withFilter(
          (parent, args, {user, models}) => pubsub.asyncIterator(NEW_DIRECT_MESSAGE),
          (payload, args, {user}) => {
            return (
              payload.workSpaceId === args.workSpaceId &&
              ((payload.senderId === user.id &&
              payload.receiverId === args.receiverId) ||
              (payload.senderId === args.receiverId &&
              payload.receiverId === user.id))
            );
          }
        )
      )
    }
  },
  DirectMessage: {
    sender: async ({sender, UserId}, args, {models}) => {
      if (sender) {
        return sender;
      }
      return await models.User.findOne({
          where: {
            id: UserId
          }
        });
    }
  },
  Query: {
    directMessages: requiresAuth.createResolver(
      async (root, {cursor, workSpaceId, otherUserId}, {models, user}, info) => {
        try {

          const options = {
            // distinct: true,
            order: [['createdAt', 'DESC']],
            limit: 35,
            where: {
              WorkSpaceId: workSpaceId,
              [Op.or]: [
                {
                  [Op.and]: [{
                    receiverId: user.id
                  }, {
                    UserId: otherUserId
                  }]
                },
                {
                  [Op.and]: [{
                    receiverId: otherUserId
                  }, {
                    UserId: user.id
                  }]
                }
              ]
            }
          };

          if (cursor) {
            options.where.createdAt = {
              [Op.lt]: cursor,
            };
          }
          return await models.DirectMessage.findAll(
              options,
              {
                raw: true
              }
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
      async (root, args, {models, user}, info) => {
        try {
          let message;


          if (args.file !== undefined) {
            const {createReadStream, filename, mimetype} = await args.file;
            const result = await new Promise((resolve, reject) => {
              createReadStream().pipe(
                cloudinary.v2.uploader.upload_stream((error, result) => {
                  if (error) {
                    reject(error);
                  }

                  resolve(result);
                })
              );
            });
            message = await models.DirectMessage.create({
              UserId: user.id,
              receiverId: args.receiverId,
              filename: filename,
              filetype: mimetype,
              path: result.secure_url,
              WorkSpaceId: args.workSpaceId
            });
          } else {
            message = await models.DirectMessage.create({
              text: args.text,
              UserId: user.id,
              receiverId: args.receiverId,
              WorkSpaceId: args.workSpaceId
            });
          }

          pubsub.publish(NEW_DIRECT_MESSAGE, {
            receiverId: args.receiverId,
            workSpaceId: args.workSpaceId,
            senderId: user.id,
            displayDirectMessage: {
              ...message.dataValues,
              sender: {
                username: user.username
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
