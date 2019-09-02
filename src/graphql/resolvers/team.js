import { formatErrors } from '../../utils/formatError';
import { requiresAuth } from '../../utils/permissions';

export default {
  Query: {
    allTeams: async (root, args, { models, user }, info) => {
      try {

        const team = await models.Team.findAll(
          { where: { ownerId: 1 } },
          { raw: true }, 
        )
      
        // console.log(team)
        return  models.Team.findAll(
          { where: { ownerId: 1 } },
          { raw: true }
        )
      } catch (error) {
        return {
          ok: false,
          errors: formatErrors(error, models)
        };
      }
    }
  },

  Mutation: {
    createTeam: requiresAuth.createResolver(
      async (root, args, { models, user }, info) => {
        try {
          const team = await models.Team.create({ ...args, ownerId: user.id });
          // const channel = await models.Channel.create({ name: "General", workSpaceId: team.id });
          // console.log(channel)
          return { ok: true, team };
        } catch (error) {
          return {
            ok: false,
            errors: formatErrors(error, models)
          };
        }
      }
    )
  },
  Team: {
    channels: async ({ id }, args, { models }) =>{
      return models.Channel.findAll( {where:
       {workSpaceId: id }})
      // models.Channel.findAll({ teamId: id })
    }
  }
};
