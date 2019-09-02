import { tryLogin } from '../../utils/auth';
import { formatErrors } from '../../utils/formatError';

export default {
  Query: {
    getUser: (root, args, { req, res, models }, info) => {
      return models.User.findByPk(args.id);
    },

    allUsers: async (root, args, { req, res, models }, info) => {

      return models.User.findAll({});
      
    }
  },

  Mutation: {
    register: async (root, args, { req, res, models, secret }, info) => {
      try {
        const user = await models.User.create(args);
        const { token, refreshToken } = await tryLogin(
          args.email,
          args.password,
          models,
          secret
        );
        return { ok: true, user, token, refreshToken };
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
      return await tryLogin(email, password, models, secret);
    }
  }
};
