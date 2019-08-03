export default (sequelize, DataTypes) => {
  const Team = sequelize.define(
    'Team',
    {
      name: { type: DataTypes.STRING, unique: true }
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
