export default (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Message',
    {
      text: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
      channel: DataTypes.INTEGER
    },
    {}
  );
  Message.associate = (models)=> {
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
