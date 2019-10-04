export default (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Message',
    {
      text: {
        type: DataTypes.TEXT
      },
      filename: {
        type: DataTypes.STRING
      },
      filetype: {
        type: DataTypes.STRING
      },
      path: {
        type: DataTypes.STRING
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
