export default (sequelize, DataTypes) => {
  const Team = sequelize.define(
    'Team',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ownerId: {
        type: DataTypes.INTEGER
      }
    },
    {}
  );
  Team.associate = models => {
    Team.belongsToMany(models.User, {
      through: 'Members',
      foreignkey: 'teamId'
    });

    // Team.hasMany(models.Channel, { foreignkey: 'workSpaceId', as: 'workSpace' });

    Team.belongsTo(models.User, {
      foreignkey: 'ownerId',
      as: 'owner'
    });
    // associations can be defined here
  };
  return Team;
};
