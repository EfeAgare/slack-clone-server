export default (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Message',
    {
      text: {
        type:  DataTypes.TEXT,
        allowNull: false
      },
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
  Message.associate = models => {
    Message.belongsTo(models.User, {
      foreignkey: 'userId'
    });

    Message.belongsTo(models.Channel, {
      foreignkey: 'channelId'
    });
    // associations can be defined here
  };
  return Message;
};
