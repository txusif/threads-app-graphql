import { ApolloServer } from "@apollo/server";
import { User } from "./user";

async function createApolloGraphqlServer() {
    const gqlServer = new ApolloServer({
        typeDefs: `
            ${User.typeDefs}
            
            type Query {
                ${User.queries}
                getContext: String
            }

            type Mutation {
                ${User.mutations}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
                getContext: async (_: any, parameters: any, context: any) => {
                    console.log("Context");
                    console.log(context);
                    return "OKAY";
                },
            },
            Mutation: {
                ...User.resolvers.mutations,
            },
        },
    });

    await gqlServer.start();

    return gqlServer;
}

export default createApolloGraphqlServer;
