export default (sequelize, DataTypes) => {
  const DirectMessage = sequelize.define(
    'DirectMessage',
    {
      text: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id'
        }
      }
    },
    {}
  );
  DirectMessage.associate = models => {
    // associations can be defined here

    DirectMessage.belongsTo(models.WorkSpace);

    DirectMessage.belongsTo(models.User);

    // DirectMessage.belongsTo(models.User, {
    //   foreignkey: { name: 'senderId', field: 'senderId' }
    // });
  };
  return DirectMessage;
};
