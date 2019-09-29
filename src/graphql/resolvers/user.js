import { tryLogin } from '../../utils/auth';
import { formatErrors } from '../../utils/formatError';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default {
  Query: {
    getUser: (root, { userId }, { req, res, models }, info) => {
      return models.User.findOne({ where: { id: userId } });
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
          const workSpace = await models.WorkSpace.findOne({
            where: { id: workSpaceId }
          });
          if (workSpace.id) {
            await models.sequelize.transaction(async () => {
              user = await models.User.create(args);
              await models.WorkSpaceMember.create({
                UserId: user.id,
                WorkSpaceId: workSpace.id
              });
              const channel1 = await models.Channel.findOne(
                {
                  where: {
                    name: 'general'
                  }
                },

                { raw: true }
              );
              const channel2 = await models.Channel.findOne(
                {
                  where: {
                    name: 'random'
                  }
                },
                { raw: true }
              );
              await models.ChannelMember.bulkCreate([
                { ChannelId: channel1.id, UserId: user.id },
                { ChannelId: channel2.id, UserId: user.id }
              ]);
            });
          } else {
            return {
              ok: false,
              errors: [{ path: 'unknown', message: 'Token has expired' }]
            };
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
