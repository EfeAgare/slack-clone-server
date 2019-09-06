export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Channels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      workSpaceId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {         // WorkSpaces hasMany channels
          model: 'WorkSpaces',
          key: 'id'
        }
      },
      public: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
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
  down: queryInterface => queryInterface.dropTable('Channels')
  
};