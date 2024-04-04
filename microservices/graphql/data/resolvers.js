class Product {
    constructor(id, { name, sku, price, discount}) {
        this.id = id;
        this.name = name;
        this.sku = sku;
        this.price = price;
        this.discount = discount;
     }
}

const productDatabase = {};

const resolvers = {
    getProduct: ({ id }) => {
        return new Product(id, productDatabase[id]);
    },
    createProduct: ({ input }) => {
        let id = require('crypto').randomBytes(10).toString('hex');
        productDatabase[id] = input;
        return new Product(id, input);
    }
}

export default resolvers;
