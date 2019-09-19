export default (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Message',
    {
      text: {
        type:  DataTypes.TEXT,
        allowNull: false
      }
    },
    {}
  );
  Message.associate = models => {
    Message.belongsTo(models.User);

    Message.belongsTo(models.Channel);
    // associations can be defined here
  };
  return Message;
};
