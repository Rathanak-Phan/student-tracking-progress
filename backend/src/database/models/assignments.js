import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class assignments extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'classes',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    available_from: {
      type: DataTypes.DATE,
      allowNull: true
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    max_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 100
    },
    submission_type: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: 'file'
    }
  }, {
    sequelize,
    tableName: 'assignments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "idx_assignments_class",
        using: "BTREE",
        fields: [
          { name: "class_id" },
        ]
      },
    ]
  });
  }
}
