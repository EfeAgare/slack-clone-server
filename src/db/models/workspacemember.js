export default (sequelize, DataTypes) => {
  const WorkSpaceMember = sequelize.define(
    'WorkSpaceMember',
    {
    },
    {}
  );
  WorkSpaceMember.associate = models => {
    // associations can be defined here

    WorkSpaceMember.belongsTo(models.WorkSpace);

    WorkSpaceMember.belongsTo(models.User);
  };
  return WorkSpaceMember;
};
