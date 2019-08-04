export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ChannelMembers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {         // Users hasMany Channels n:n
          model: 'Users',
          key: 'id'
        }
      },
      channelId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {         // Channels hasMany Users n:n
          model: 'Channels',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: queryInterface => queryInterface.dropTable('ChannelMembers')
};
