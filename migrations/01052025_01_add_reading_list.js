const { DataTypes } = require('sequelize')


module.exports = {
    up: async({ context: queryInterFace }) => {
        await queryInterFace.createTable('reading_list', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            read: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            blog_id : {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'blogs', key: 'id'}
            },
            user_id : {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id'}
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        })
    },

    down: async({ context: queryInterFace}) => {
        await queryInterFace.dropTable('reading_list')
    }
}