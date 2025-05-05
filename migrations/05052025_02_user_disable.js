const { DataTypes } = require('sequelize')

module.exports = {
    up: async({ context: queryInterFace }) => { 
        await queryInterFace.addColumn('users', 'disabled', {
            type: DataTypes.BOOLEAN,
            defaultValue:false
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn('users', 'disabled')
      },
}

//user disable/enable from database level only in this practice.