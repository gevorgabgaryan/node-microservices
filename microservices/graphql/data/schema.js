import { buildSchema } from "graphql";

const schema = buildSchema(`
    type Product {
        id: ID
        sku: String,
        name: String,
        price: Float,
        discountPercentage: Float,
    }

    type Query {
        getProduct(id: ID): Product
    }

    input StoreInput {
        store: String
    }

    input ProductInput {
        id: ID
        sku: String,
        name: String,
        price: Float,
        discountPercentage: Float,
    }

    type Mutation {
        createProduct(input: ProductInput): Product
    }
`);

export default schema;
