/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    pass_word: {
      type: DataTypes.CHAR(128),
      allowNull: false,
      defaultValue: ''
    },
    user_type: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: '0'
    },
    user_email: {
      type: DataTypes.CHAR(128),
      allowNull: false,
      defaultValue: ''
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    login_ip: {
      type: DataTypes.CHAR(50),
      allowNull: false,
      defaultValue: ''
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    is_used: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '1'
    },
    is_delete: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '1'
    },
    user_extend: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'user'
  });
};
