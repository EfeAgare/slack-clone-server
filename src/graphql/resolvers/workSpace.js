import { formatErrors } from '../../utils/formatError';
import { requiresAuth } from '../../utils/permissions';

export default {
  Query: {
    allWorkSpace: requiresAuth.createResolver(
      async (root, args, { models, user }, info) => {
        try {
          return await models.WorkSpace.findAll(
            { where: { UserId: user.id } },
            { raw: true }
          );
        } catch (error) {
          return {
            ok: false,
            errors: formatErrors(error, models)
          };
        }
      }
    ),
    allInvitedWorkSpace: requiresAuth.createResolver(
      async (root, args, { models, user }, info) => {
        try {
          // return await models.sequelize.query("select * from workspace join workspacemembers on id = WorkSpaceId where UserId = ?",{model: models.WorkSpace})
          return await models.WorkSpace.findAll(
            {
              include: [
                {
                  model: models.User,
                  where: { id: user.id }
                }
              ]
            },
            { raw: true }
          );
        } catch (error) {
          return {
            ok: false,
            errors: formatErrors(error, models)
          };
        }
      }
    )
  },

  Mutation: {
    createWorkSpace: requiresAuth.createResolver(
      async (root, args, { models, user }, info) => {
        try {
          const workSpace = await models.sequelize.transaction(async () => {
            const workSpace = await models.WorkSpace.create({
              ...args,
              UserId: user.id
            });

             await models.WorkSpaceMember.create({
              WorkSpaceId: workSpace.id,
              UserId: user.id
            });
            const channel1 = await models.Channel.bulkCreate({
              name: 'general',
              public: true,
              WorkSpaceId: workSpace.id
            });
            const channel2 = await models.Channel.create({
              name: 'random',
              public: true,
              WorkSpaceId: workSpace.id
            });
            await models.ChannelMember.bulkCreate(
              { ChannelId: channel1, UserId: user.id },
              { ChannelId: channel2, UserId: user.id }
            );

            return workSpace;
          });
          return { ok: true, workSpace };
        } catch (error) {
          return {
            ok: false,
            errors: formatErrors(error, models)
          };
        }
      }
    )
  },
  WorkSpace: {
    channels: async ({ id }, args, { models }) => {
      return models.Channel.findAll({ where: { WorkSpaceId: id } });
    }
  }
};
