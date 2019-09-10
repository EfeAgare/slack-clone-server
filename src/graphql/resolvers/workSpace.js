import { formatErrors } from '../../utils/formatError';
import { requiresAuth } from '../../utils/permissions';

export default {
  Query: {
    allWorkSpace: requiresAuth.createResolver(async (root, args, { models, user }, info) => {
      try {

        return  models.WorkSpace.findAll(
          { where: { userId: user.id } },
          { raw: true }
        )
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
    createWorkSpace: requiresAuth.createResolver(
      async (root, args, { models, user }, info) => {
        try {
          const workSpace = await models.WorkSpace.create({ ...args, userId: user.id });
    
          return { ok: true, workSpace };
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
    channels: async ({ id }, args, { models }) =>{
      return models.Channel.findAll( {where:
       {workSpaceId: id }})
     
    }
  }
};
