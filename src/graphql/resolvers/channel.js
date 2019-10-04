import { requiresAuth } from '../../utils/permissions';
import { formatErrors } from '../../utils/formatError';

export default {
  Mutation: {
    createChannel: requiresAuth.createResolver(
      async (parent, args, { models }) => {
        try {
          const channel = await models.Channel.create({
            WorkSpaceId: args.workSpaceId,
            ...args
          });
          return { ok: true, channel };
        } catch (err) {
          console.log(err);
          return { ok: false, errors: formatErrors(err) };
        }
      }
    )
  }
};
