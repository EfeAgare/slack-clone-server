export default (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Message',
    {
      text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      channelId: {
        type: Sequelize.INTEGER,
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
