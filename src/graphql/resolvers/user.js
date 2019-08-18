import { tryLogin } from '../../utils/auth';
import { formatErrors } from '../../utils/formatError';

export default {
  Query: {
    getUser: (root, args, { req, res, models }, info) => {
      return models.User.findByPk(args.id);
    },

    allUsers: (root, args, { req, res, models }, info) => {
      return models.User.findAll({});
    }
  },

  Mutation: {
    register: async (root, args, { req, res, models }, info) => {
      try {
        const user = await models.User.create(args);
        return { ok: true, user };
      } catch (error) {
        return {
          ok: false,
          errors: formatErrors(error, models)
        };
      }
    },
    login: async (
      root,
      { email, password },
      { req, res, models, secret },
      info
    ) => {
      return await tryLogin(email, password, models, secret)
      ;
    }
  }
};
