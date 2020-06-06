module.exports = function (sequelize, DataTypes) {
  const TagHistory = sequelize.define("tag_history", {
    tag_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    tag_link: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
  });
  return TagHistory;
};