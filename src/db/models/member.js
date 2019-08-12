export default (sequelize, DataTypes) => {
  const Member = sequelize.define(
    'Member',
    {
      userId: {
        type:  DataTypes.INTEGER,
        allowNull: false
      },
      teamId: {
        type:  DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  Member.associate = models => {
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
