import bcrypt from 'bcryptjs';

export default {
  Query: {
    getUser: (root, args, context, info) => {
      return context.models.User.findByPk(args.id);
    },

    allUsers: (root, args, context, info) => {
      return context.models.User.findAll({});
    }
  },

  Mutation: {
    register: async (root, args, context, info) => {
      const hashPassword = await bcrypt.hashSync(args.password, 10);
      const user = await context.models.User.create({...args, password: hashPassword});
      return user;
    }
  }
};
