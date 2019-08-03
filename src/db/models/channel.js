export default (sequelize, DataTypes) => {
  const Channel = sequelize.define('Channel', {
    name: DataTypes.STRING,
    teamId: DataTypes.INTEGER,
    public: DataTypes.BOOLEAN
  }, {});
  Channel.associate = (models) => {
    // associations can be defined here

    Channel.belongsTo(models.Team, {
      foreignkey: 'teamId'
    });

  };
  return Channel;
};