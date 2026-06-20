import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class messages extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    media_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    media_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    reply_to_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'messages',
        key: 'id'
      }
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    deleted_by_sender: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    deleted_by_receiver: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    is_deleted_for_everyone: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'messages',
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
        name: "sender_id",
        using: "BTREE",
        fields: [
          { name: "sender_id" },
        ]
      },
      {
        name: "receiver_id",
        using: "BTREE",
        fields: [
          { name: "receiver_id" },
        ]
      },
      {
        name: "fk_reply_to_id",
        using: "BTREE",
        fields: [
          { name: "reply_to_id" },
        ]
      },
    ]
  });
  }
}
