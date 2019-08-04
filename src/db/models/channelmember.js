'use strict';
export default (sequelize, DataTypes) => {
  const ChannelMember = sequelize.define(
    'ChannelMember',
    {
      userId: DataTypes.INTEGER,
      channelId: DataTypes.INTEGER
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
