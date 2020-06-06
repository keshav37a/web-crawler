let Author = require('./Author');

module.exports = function (sequelize, DataTypes) {
  const Article = sequelize.define("article", {
    article_title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    article_link: {
      type: DataTypes.STRING,
      allowNull: false
    },
    article_description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },{
    freezeTableName: true, 
});
  return Article;
};