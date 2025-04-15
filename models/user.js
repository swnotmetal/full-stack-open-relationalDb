const {Model, DataTypes } = require('sequelize')
var validator = require('validator');
const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type:DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    name: {
        type:DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize,
    validate: {
        isEmailValid() {
            if (!validator.isEmail(this.username)) {
                throw new Error('Username must be a valid email');
            }
        }
    },
    underscored: true,
    timestamps: false,
    modelName: 'user'
})

module.exports = User


