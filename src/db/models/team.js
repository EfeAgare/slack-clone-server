export default (sequelize, DataTypes) => {
  const Team = sequelize.define(
    'Team',
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      owner: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  Team.associate = models => {
    Team.belongsToMany(models.User, {
      through: 'member',
      foreignkey: 'teamId '
    });

    Team.belongsTo(models.User, {
      foreignkey: 'owner'
    });
    // associations can be defined here
  };
  return Team;
};
