import {
  Sequelize,
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "todo.db",
});

export class Todo extends Model<
  InferAttributes<Todo>,
  InferCreationAttributes<Todo>
> {
  declare id: number;
  declare createdBy: CreationOptional<string>;
  declare content: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Todo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    createdBy: {
      type: DataTypes.STRING(100),
      defaultValue: "unknown",
    },
    content: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "todo" }
);
