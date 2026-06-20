import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class teacher_requests extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    degree: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    major: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    university: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    graduation_year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    experience_years: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    previous_workplace: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    subjects: {
      type: DataTypes.JSON,
      allowNull: false
    },
    documents: {
      type: DataTypes.JSON,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending','approved','rejected'),
      allowNull: true,
      defaultValue: "pending"
    },
    admin_note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reviewed_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'teacher_requests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
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
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "reviewed_by",
        using: "BTREE",
        fields: [
          { name: "reviewed_by" },
        ]
      },
    ]
  });
  }
}
