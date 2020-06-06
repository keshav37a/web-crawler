module.exports = (sequelize, DataTypes)=> {
    let TagHistory = sequelize.define("tag_history", {
        tag_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        tag_link: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true,
    });
    return TagHistory;
};
