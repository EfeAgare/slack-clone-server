import { formatErrors } from '../../utils/formatError';


export default {
  Query: {},

  Mutation: {
    createTeam: async (root, args, { models, user }, info) => {
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
  }
};
