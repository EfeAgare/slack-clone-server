export default (sequelize, DataTypes) => {
  const WorkSpace = sequelize.define(
    'WorkSpace',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );
  WorkSpace.associate = models => {
    WorkSpace.belongsToMany(models.User, {
      through: 'WorkSpaceMember',
      // foreignkey: 'workSpaceId',
      // sourfeKey: 'userId'
    });

    WorkSpace.hasMany(models.Channel);

    WorkSpace.belongsTo(models.User);
    // associations can be defined here
  };
  return WorkSpace;
};
