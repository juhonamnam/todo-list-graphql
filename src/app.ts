import { ApolloServer, gql } from "apollo-server";
import { sequelize } from "./model";
import { Post } from "./model/post";
import { User } from "./model/user";
import DataLoader from "dataloader";

sequelize.sync({ force: false });

const typeDefs = gql`
  type Query {
    users: [User]
    posts: [Post]
  }
  type Mutation {
    createUser(name: String): User
    createPost(userId: Int, content: String): Post
  }
  type Post {
    id: Int
    userId: Int
    content: String
    createdAt: String
    updatedAt: String
    user: User
  }
  type User {
    id: Int
    name: String
    createdAt: String
    updatedAt: String
    posts: [Post]
  }
  type Update {
    updatedRows: Int
  }
`;

const context = () => ({
  postLoader: new DataLoader<number, Post[]>(async (userIds) => {
    const posts = await Post.findAll({
      where: {
        userId: userIds,
      },
    });

    return userIds.map((userId) =>
      posts.filter((post) => post.userId === userId),
    );
  }),
});

const resolvers = {
  Query: {
    async users(parent: any, args: any, context: any, info: any) {
      const result = await User.findAll();
      return result;
    },
    async posts(parent: any, args: any, context: any, info: any) {
      const result = await Post.findAll();
      return result;
    },
  },
  Post: {
    async user(parent: any, args: any, context: any, info: any) {
      const result = await User.findByPk(parent.userId);
      return result;
    },
  },
  User: {
    async posts(parent: any, args: any, context: any, info: any) {
      const result = await context.postLoader.load(parent.id);
      return result;
    },
  },
  Mutation: {
    async createUser(parent: any, args: any, context: any, info: any) {
      const result = await User.create(args);
      return result;
    },
    async createPost(parent: any, args: any, context: any, info: any) {
      const result = await Post.create(args);
      return result;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers, context });

server.listen().then(({ url }) => {
  console.log("Server running on", url);
});
