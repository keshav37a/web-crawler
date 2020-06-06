const Sequelize = require('sequelize');
const environment = require('./environment');

const sequelize = new Sequelize(environment.dbName, environment.dbUser, environment.dbPassword, {
    host: environment.dbHost,
    dialect: environment.dbDialect,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

sequelize.sync();

module.exports = sequelize;