const Sequelize = require('sequelize');
let sequelize = require('../config/sequelize');
let db = {};

let Article = sequelize.import('./Article');
let Author = sequelize.import('./Author');
let TagHistory = sequelize.import('./TagHistory');

TagHistory.hasMany(Article, {
  onDelete: "CASCADE",
  foreignKey: {name:'tagId', allowNull: false}
});

Author.hasMany(Article, {
  onDelete: "CASCADE",
  foreignKey: {name:'authorId', allowNull: false}
});

Article.belongsTo(Author, {
  onDelete: 'CASCADE',
  foreignKey: {name:'authorId', allowNull: false}
});

Article.belongsTo(TagHistory, {
  onDelete: 'CASCADE',
  foreignKey: {name:'tagId', allowNull: false}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;