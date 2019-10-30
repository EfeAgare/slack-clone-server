import { formatErrors } from '../../utils/formatError';
import { requiresAuth } from '../../utils/permissions';

export default {
  Query: {
    allWorkSpace: requiresAuth.createResolver(
      async (root, args, { models, user }, info) => {
        try {
          return await models.sequelize.query(
            `select * from "WorkSpaces" as "w" join "WorkSpaceMembers" as "m" on ("w"."id" = "m"."WorkSpaceId")
            where "m"."UserId" = ?`,
            {
              replacements: [user.id],
              model: models.WorkSpace,
              raw: true
            }
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
            const channel1 = await models.Channel.create({
              name: 'general',
              public: true,
              WorkSpaceId: workSpace.id
            });
            const channel2 = await models.Channel.create({
              name: 'random',
              public: true,
              WorkSpaceId: workSpace.id
            });

            await models.ChannelMember.bulkCreate([
              { ChannelId: channel1.id, UserId: user.id },
              { ChannelId: channel2.id, UserId: user.id }
            ]);

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
    channels: async ({ id }, args, { models, user }) => {
      
      return await models.sequelize.query(
        `select c.* from "Channels" as c join "ChannelMembers" as m on m."ChannelId"=c.id join "Users" as u on m."UserId" = u.id where c."WorkSpaceId"=:workSpaceId and m."UserId"=:userId`,
        {
          replacements: { workSpaceId: id, userId: user.id },
          model: models.Channel
        },
        {
          raw: true
        }
      );
    },
    directMessageMembers: async ({ id }, args, { models, user }) => {
      return await models.sequelize.query(
        `select distinct on ("u"."id") "u"."id", "u"."username" from "Users" as "u" join "DirectMessages" as "dm" on ("u"."id" = "dm"."receiverId") or ("u"."id" = "dm"."UserId")
        where (:currentUserId = "dm"."receiverId" or :currentUserId = "dm"."UserId") and "dm"."WorkSpaceId" = :workSpaceId`,
        {
          replacements: { currentUserId: user.id, workSpaceId: id },
          model: models.User,
          raw: true
        }
      );
    }
  }
};
