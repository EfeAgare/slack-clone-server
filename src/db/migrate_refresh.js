import models from './models';

models.sequelize.sync({force: true}).then(() => {
  console.log(`database drop and refresh`)
});