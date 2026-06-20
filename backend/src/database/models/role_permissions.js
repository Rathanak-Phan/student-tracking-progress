import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class role_permissions extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'permissions',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'role_permissions',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "role_id" },
          { name: "permission_id" },
        ]
      },
      {
        name: "permission_id",
        using: "BTREE",
        fields: [
          { name: "permission_id" },
        ]
      },
    ]
  });
  }
}
