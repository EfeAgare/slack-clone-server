export default (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    userId: DataTypes.INTEGER,
    teamId: DataTypes.INTEGER
  }, {});
  Member.associate = (models) => {
    // associations can be defined here

    Member.belongsTo(models.Team, {
      foreignkey: 'teamId'
    });

    Member.belongsTo(models.User, {
      foreignkey: 'userId'
    });
  };
  return Member;
};