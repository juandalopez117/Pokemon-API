const sequelize = require('sequelize')
const DataTypes = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('Type', {
        type: {
            type: DataTypes.STRING, 
            allowNull: true,

        }
    }, {
        timestamps: false
    })
}