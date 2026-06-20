import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class enrollments extends Model {
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
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    enrolled_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    status: {
      type: DataTypes.ENUM('active','dropped'),
      allowNull: true,
      defaultValue: "active"
    }
  }, {
    sequelize,
    tableName: 'enrollments',
    timestamps: false,
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
        name: "class_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "class_id" },
          { name: "student_id" },
        ]
      },
      {
        name: "idx_enrollments_student",
        using: "BTREE",
        fields: [
          { name: "student_id" },
        ]
      },
    ]
  });
  }
}
