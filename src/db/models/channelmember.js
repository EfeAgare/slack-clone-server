export default (sequelize, DataTypes) => {
  const ChannelMember = sequelize.define(
    'ChannelMember',
    {
      userId: {
        type:  DataTypes.INTEGER,
        allowNull: false
      },
      channelId: {
        type:  DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  ChannelMember.associate = models => {
    ChannelMember.belongsTo(models.User, { foreignKey: 'userId' });
    ChannelMember.belongsTo(models.Channel, { foreignKey: 'channelId' });
    // associations can be defined here
  };
  return ChannelMember;
};
