/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('menu', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    parent_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    path: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    url: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    router_name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    sort: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    type: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '1'
    },
    btn_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    is_used: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '1'
    },
    is_deleted: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '1'
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'menu'
  });
};
