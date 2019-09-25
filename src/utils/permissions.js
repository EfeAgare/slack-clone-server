const createResolver = resolver => {
  const baseResolver = resolver;
  baseResolver.createResolver = childResolver => {
    const newResolver = async (parent, args, context, info) => {
      await resolver(parent, args, context, info);
      return childResolver(parent, args, context, info);
    };
    return createResolver(newResolver);
  };
  return baseResolver;
};

export const requiresAuth = createResolver((parent, args, { user }) => {
  if (!user || !user.id) {
    throw new Error('Not authenticated');
  }
});

// export const requiresAdmin = requiresAuth.createResolver(
//   (parent, args, { user }) => {
//     if (!user.isAdmin) {
//       throw new Error('Requires admin access');
//     }
//   }
// );


export const requiresWorkSpaceAccess = createResolver(async (parent, { channelId }, { user, models }) => {
  if (!user || !user.id) {
    throw new Error('Not authenticated');
  }
 
  // check if part of the channels in the team
  const channel = await models.Channel.findOne({ where: { id: channelId } });
  const channelMember = await models.ChannelMember.findOne({
    where: { ChannelId: channel.id, UserId: user.id },
  });
  if (!channelMember) {
    throw new Error("You have to be a member of this Channel to subcribe to it's messages");
  }
});