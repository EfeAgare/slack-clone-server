import _ from 'lodash';

const formatErrors = (e, models) => {
  console.log(models.Sequelize.ValidationError);
  // console.log(e)
  if (e instanceof models.Sequelize.ValidationError) {
    return e.errors.map(x => _.pick(x, ['path', 'message']));
  }
  return [{ path: 'name', message: 'something went wrong' }];
};

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
    }
  }
};
