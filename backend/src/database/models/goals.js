import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class goals extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'classes',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    target_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    assignment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'assignments',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "general"
    },
    target_value: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 100
    },
    current_value: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('pending','in_progress','completed'),
      allowNull: true,
      defaultValue: "pending"
    }
  }, {
    sequelize,
    tableName: 'goals',
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
        name: "student_id",
        using: "BTREE",
        fields: [
          { name: "student_id" },
        ]
      },
      {
        name: "class_id",
        using: "BTREE",
        fields: [
          { name: "class_id" },
        ]
      },
      {
        name: "assignment_id",
        using: "BTREE",
        fields: [
          { name: "assignment_id" },
        ]
      },
    ]
  });
  }
}
