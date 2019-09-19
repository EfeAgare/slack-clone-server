export default (sequelize, DataTypes) => {
  const ChannelMember = sequelize.define(
    'ChannelMember',
    {
      
    },
    {}
  );
  ChannelMember.associate = models => {
    ChannelMember.belongsTo(models.User);
    ChannelMember.belongsTo(models.Channel);
    // associations can be defined here
  };
  return ChannelMember;
};
