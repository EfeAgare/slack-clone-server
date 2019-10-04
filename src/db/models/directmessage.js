export default (sequelize, DataTypes) => {
  const DirectMessage = sequelize.define(
    'DirectMessage',
    {
      text: {
        type: DataTypes.TEXT,
      },
      filename: {
        type: DataTypes.STRING,
       
      },
      filetype: {
        type: DataTypes.STRING
      },
      path: {
        type: DataTypes.STRING
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
