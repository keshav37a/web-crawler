module.exports = function (sequelize, DataTypes) {
  const Author = sequelize.define("author", {
    author_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author_link: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
  });
  return Author;
};