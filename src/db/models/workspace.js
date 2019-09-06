export default (sequelize, DataTypes) => {
  const WorkSpace = sequelize.define(
    'WorkSpace',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER
      }
    },
    {}
  );
  WorkSpace.associate = models => {
    // WorkSpace.belongsToMany(models.User, {
    //   through: 'WorkSpaceMembers',
    //   foreignkey: 'userId'
    // });

    // WorkSpace.hasMany(models.Channel, { foreignkey: 'workSpaceId'});

    // WorkSpace.belongsTo(models.User, {
    //   foreignkey: 'userId'
    // });
    // associations can be defined here
  };
  return WorkSpace;
};
