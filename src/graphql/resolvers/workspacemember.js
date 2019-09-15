import { formatErrors } from '../../utils/formatError';
import { requiresAuth } from '../../utils/permissions';

export default {
  Query: {
    allWorkSpaceMembers: requiresAuth.createResolver(async (root, args, { models, user }, info) => {
      try {

        return  models.WorkSpaceMember.findAll(
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
    createWorkSpaceMembers: requiresAuth.createResolver(
      async (root, {email, workSpaceId}, { models, user }, info) => {
        try {

          const workSpacePromise = models.WorkSpace.findOne({where: {id: workSpaceId} });
          const workSpaceOwner = models.User.findOne({where: {email: email} });
    
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
