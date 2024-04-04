import { buildSchema } from "graphql";

const schemas = buildSchema(`
    type Query {
        hello: String
    }
`)

export default schemas;
