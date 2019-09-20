import { formatErrors } from '../../utils/formatError';
import { requiresAuth } from '../../utils/permissions';

export default {
  Query: {
    channelMessages: requiresAuth.createResolver(
      async (root, args, { models }, info) => {
        try {
          return await models.Message.findAll(
            { where: { ChannelId: args.channelId } },
            { raw: true }
          );
        } catch (error) {
          return {
            ok: false,
            errors: formatErrors(error, models)
          };
        }
      })
  },
  
  Mutation: {
    createMessage: requiresAuth.createResolver(
      async (root, args, { models, user }, info) => {
        try {
         
            
            await models.Message.create({
              text: args.text,
              UserId: user.id,
              ChannelId: args.channelId
            });
          
            
          
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
  }
};
