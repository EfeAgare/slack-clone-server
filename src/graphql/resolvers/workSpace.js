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
          const response = await models.sequelize.transaction(async () => {
            const workSpace = await models.WorkSpace.create({ ...args, userId: user.id });
            await models.Channel.create({ name: 'general', public: true, teamId: team.id });
            await models.Channel.create({ name: 'random', public: true, teamId: team.id });
            return workSpace;
          });    
          return { ok: true, response };
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
