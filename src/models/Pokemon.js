const sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

//! it defines the pokemon model

module.exports = (sequelize) => {
  sequelize.define('pokemon', 
  {
    /* id: {
      type: DataTypes.STRING(3),
      primaryKey: true,
    }, */

    id: {
      type: DataTypes.UUID, // numero random unico
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },

    name: {
      type: DataTypes.STRING,
      validate: {
        is: {
          args: /^[a-zA-Z\s]*$/,
          msg: 'Must have only letters and spaces!'
        }
      },
      allowNull: false,
    },

    life: {
      type: DataTypes.INTEGER,
    },

    attack: {
      type: DataTypes.INTEGER
    },

    defense: {
      type: DataTypes.INTEGER
    },

    speed: {
      type: DataTypes.INTEGER
    },

    height: {
      type: DataTypes.INTEGER
    }, 

    weight: {
      type: DataTypes.INTEGER
    },

    created: {
      type: DataTypes.BOOLEAN,
      allowNull: false, 
      defaultValue: true
    }
  }, 
  {timestamps: false}
  )
}



