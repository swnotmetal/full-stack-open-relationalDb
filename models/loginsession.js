const {Model, DataTypes } = require('sequelize')
var validator = require('validator');
const { sequelize } = require('../util/db')

class LogIn extends Model{}

LogIn.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
    token: {
        type: DataTypes.STRING,
        allowNull: false,          
    }

}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'login_sessions',
})

module.exports = LogIn