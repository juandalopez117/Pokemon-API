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

    Name: {
      type: DataTypes.STRING,
      validate: {
        is: {
          args: /^[a-zA-Z\s]*$/,
          msg: 'Must have only letters and spaces!'
        }
      },
      allowNull: false,
    },

    Health_Points: {
      type: DataTypes.INTEGER,
    },

    Attack: {
      type: DataTypes.INTEGER
    },

    Defense: {
      type: DataTypes.INTEGER
    },

    Speed: {
      type: DataTypes.INTEGER
    },

    Height: {
      type: DataTypes.INTEGER
    }, 

    Weight: {
      type: DataTypes.INTEGER
    },

/*     type: {
      type: DataTypes.STRING
    }, */

    Created: {
      type: DataTypes.BOOLEAN,
      allowNull: false, 
      defaultValue: true
    }
  }, 
  {timestamps: false}
  )
}



