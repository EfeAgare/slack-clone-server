export default (sequelize, DataTypes) => {
  const Member = sequelize.define(
    'Member',
    {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      teamId: {
        type: Sequelize.INTEGER,
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
