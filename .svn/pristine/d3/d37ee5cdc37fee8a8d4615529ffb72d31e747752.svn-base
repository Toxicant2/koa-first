/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('attachment', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    file_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    file_type: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    file_size: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    file_path: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    file_note: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    business_type: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    business_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    sort: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    is_deleted: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'attachment'
  });
};
