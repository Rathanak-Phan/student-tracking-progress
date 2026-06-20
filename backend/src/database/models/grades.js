import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class grades extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    submission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'submissions',
        key: 'id'
      },
      unique: "grades_ibfk_1"
    },
    score: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    graded_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'grades',
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
        name: "submission_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "submission_id" },
        ]
      },
    ]
  });
  }
}
