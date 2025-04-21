const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Blog extends Model {}
Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    author : {
        type: DataTypes.STRING,
        allowNull: true
    },
    url : {
        type: DataTypes.STRING,
        allowNull: false
    },
    title : {
        type: DataTypes.STRING,
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: {
                args: 1991,
                msg: "The year must be earliest at 1991"
            },
            max: {
               args: new Date().getFullYear(),
               msg: "Year cannot be greater than the current one"
            }
        }
    },
    likes : {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
},{
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'blog',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
}
)

module.exports = Blog