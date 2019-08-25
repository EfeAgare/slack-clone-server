import { formatErrors } from '../../utils/formatError';
import { requiresAuth } from '../../utils/permissions';

export default {
  Query: {
    allTeams: 
      async (root, args, { models, user }, info) => {
        try {
          console.log(models.Team.findAll(
            { where: { ownerId: 1 } },
            { raw: true }
          ))
          const team = await models.Team.findAll(
            { where: { ownerId: 1 } },
            { raw: true }
          );
        
          return { ok: true, team };
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
          // console.log(user)
          const team = await models.Team.create({ ...args, owner: user.id });
          // console.log(team)
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
    channels: ({ id }, args, { models }) =>
      models.Channel.findAll({ teamId: id })
  }
};
