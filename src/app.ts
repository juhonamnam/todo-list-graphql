import { ApolloServer, gql } from "apollo-server";
import { sequelize, Todo } from "./model";

sequelize.sync({ force: true });

const typeDefs = gql`
  type Query {
    todoList: [Todo]
  }
  type Mutation {
    createTodoItem(createdBy: String, content: String): Todo
    modifyTodoItem(id: Int, createdBy: String, content: String): Update
    deleteTodoItem(id: Int): Update
  }
  type Todo {
    id: Int
    createdBy: String
    content: String
    createdAt: String
    updatedAt: String
  }
  type Update {
    updatedRows: Int
  }
`;

const resolvers = {
  Query: {
    async todoList(parent: any, args: any, context: any, info: any) {
      console.log(info);
      const result = await Todo.findAll();
      return result;
    },
  },
  Mutation: {
    async createTodoItem(parent: any, args: any, context: any, info: any) {
      const result = await Todo.create(args);
      return result;
    },
    async modifyTodoItem(parent: any, args: any, context: any, info: any) {
      const result = await Todo.update(args, {
        where: { id: args.id },
      });
      return { updatedRows: result[0] };
    },
    async deleteTodoItem(parent: any, args: any, context: any, info: any) {
      const result = await Todo.destroy({ where: { id: args.id } });
      return { updatedRows: result };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log("Server running on", url);
});
