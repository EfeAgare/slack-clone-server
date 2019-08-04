import models from '../../db/models';

const { User } = models;

export default {
  Query: {
    getUser: (root, args, context, info) => {
      return User.findByPk(args.id);
    },

    allUsers: (root, args, context, info) => {
      return User.findAll({});
    }
  },

  Mutation: {
    createUser: async (root, args, context, info) => {
      const user = await User.create(args);
      return user;
    }
  }
};
