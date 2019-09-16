import { tryLogin } from '../../utils/auth';
import { formatErrors } from '../../utils/formatError';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

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
        let user;
        
        
        if (args.token) {
          const { workSpaceId } = jwt.verify(args.token, process.env.SECRET);
          const workSpace = await models.WorkSpace.findOne(
            { where: { id: workSpaceId } },

          );
          if (workSpace.id) {
            user = await models.User.create(args);
            await models.WorkSpaceMember.create({
              userId: user.id,
              workSpaceId: workSpace.id
            })

          } else{
            return {
              ok: false,
              errors: [{ path: 'unknown', message: 'Token has expired' }],
            }
          }
        } else {
          user = await models.User.create(args);
        }

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


