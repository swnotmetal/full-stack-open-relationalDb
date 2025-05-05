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
    disabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
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
    timestamps: true,
    modelName: 'user',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = User


