export default (sequelize, DataTypes) => {
  const WorkSpaceMember = sequelize.define(
    'WorkSpaceMember',
    {
      userId: {
        type:  DataTypes.INTEGER,
        allowNull: false
      },
      workSpaceId: {
        type:  DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  WorkSpaceMember.associate = models => {
    // associations can be defined here

    // WorkSpaceMember.belongsTo(models.WorkSpace, {
    //   foreignkey: 'workSpaceId'
    // });

    // WorkSpaceMember.belongsTo(models.User, {
    //   foreignkey: 'userId'
    // });
  };
  return WorkSpaceMember;
};
