module.exports = (sequelize, DataTypes)=> {
  let Author = sequelize.define("author", {
    author_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author_link: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },{
    freezeTableName: true, 
});
  return Author;
};