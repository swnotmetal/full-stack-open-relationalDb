const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface}) => {
        await queryInterface.createTable('blogs', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            author: {
                type: DataTypes.STRING,
                allowNull: true
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false

            },
            year: {
                type: DataTypes.INTEGER,
                validate: {
                    min: 1991,
                    max: new Date().getFullYear()
                }
            },
            likes : {
                type: DataTypes.INTEGER,
                defaultValue: 0
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
        await queryInterface.createTable('users', {
            id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true
            },
            username: {
              type: DataTypes.STRING,
              unique: true,
              allowNull: false,
            },
            name: {
              type: DataTypes.STRING,
              allowNull: false
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
          try {
            await queryInterface.addColumn('blogs', 'user_id', {
              type: DataTypes.INTEGER,
              references: { model: 'users', key: 'id' }
            })
          } catch (error) {
            // Column already exists, continue
            console.log('Note: user_id column may already exist')
          }
        },
        down: async ({ context: queryInterface }) => {
          await queryInterface.removeColumn('blogs', 'user_id') 
          await queryInterface.dropTable('blogs')
          await queryInterface.dropTable('users')
    }
}