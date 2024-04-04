import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import config from '../config';
import schemas from '../schemas';
import resolvers from '../resolvers';

const port = config.port

const server = new ApolloServer({
    typeDefs : schemas,
    resolvers : resolvers,
    introspection : true
  });


class API {
  static async init() {
    startStandaloneServer(server, { listen: { port} });
    console.log(`Server is listening on port ${port}`);
  }
}

export default API;
