import express from 'express';
import config from './config';
import { graphqlHTTP } from 'express-graphql';
import schema from './data/schema';
import resolvers from './data/resolvers';

const app = express();

app.get('/', (req, res) => {
    res.json({message: "GraphQL"})
})


app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
}));

app.listen(config.port, ()=>{
   console.log(`app start on port ${config.port}`)
})
