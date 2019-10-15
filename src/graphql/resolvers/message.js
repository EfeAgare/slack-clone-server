import { formatErrors } from '../../utils/formatError';
import { requiresAuth, requiresWorkSpaceAccess } from '../../utils/permissions';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { withFilter } from 'graphql-subscriptions';
import { GraphQLDateTime } from 'graphql-iso-date';
import pubsub from '../pubsub/pubsub';
import cloudinary from '../cloudinary';
import Op from '../../utils/Op'

const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

export default {
  Subscription: {
    newChannelMessage: {
      subscribe: requiresWorkSpaceAccess.createResolver(
        withFilter(
          (parent, args, {user, models}) => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
          (payload, args) => {
            console.log('here');
            return payload.channelId === args.channelId;
          }
        )
      )
    }
  },
  Message: {
    user: async ({user, UserId}, args, {models}) => {
      if (user) {
        return user;
      }
      return await models.User.findOne({
          where: {
            id: UserId
          }
        });
    }
  },
  Query: {
    channelMessages: requiresAuth.createResolver(
      async (root, args, {models}, info) => {
        try {

          const options = {
            order: [['createdAt', 'DESC']],
            where: {
              ChannelId: args.channelId
            },
            limit: 35
          };


          if (args.cursor) {
            options.where.createdAt = {
              [Op.lt]: args.cursor,
            }
          }
          return await models.Message.findAll(
              options ,
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
    createMessage: requiresAuth.createResolver(
      async (root, args, {models, user}, info) => {

        try {
          let message;

          if (args.file !== undefined) {
            const {createReadStream, filename, mimetype} = await args.file;
            console.log('cloudinary');

            const result = await new Promise((resolve, reject) => {
              createReadStream().pipe(
                cloudinary.v2.uploader.upload_stream((error, result) => {
                  if (result) {
                    resolve(result);
                  } else {
                    console.log(error);
                    reject(error);
                  }
                })
              );
            });
            message = await models.Message.create({
              UserId: user.id,
              filename: filename,
              filetype: mimetype,
              path: result.secure_url,
              ChannelId: args.channelId
            });
          } else {
            message = await models.Message.create({
              text: args.text,
              UserId: user.id,
              ChannelId: args.channelId
            });
          }

          const asyncFunc = async () => {
            const currentUser = await models.User.findOne({
              where: {
                id: user.id
              }
            });

            pubsub.publish(NEW_CHANNEL_MESSAGE, {
              channelId: args.channelId,
              newChannelMessage: {
                ...message.dataValues,
                user: currentUser.dataValues
              }
            });
          };

          asyncFunc();

          return {
            ok: true
          };
        } catch (error) {
          return {
            ok: false,
            errors: formatErrors(error, models)
          };
        }
      }
    )
  },
  // WorkSpace: {
  //   channels: async ({ id }, args, { models }) => {
  //     return models.Channel.findAll({ where: { WorkSpaceId: id } });
  //   }
  // },
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
