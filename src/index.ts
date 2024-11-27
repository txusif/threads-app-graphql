import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    app.use(express.json());

    // Create graphql server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }
        `, // Schema
        resolvers: {
            Query: {
                hello: () => "Hello! I am a graphql server",
                say: (_, { name }: { name: string }) =>
                    `Hello ${name}, how are you?`,
            },
        },
    });

    // Start the gql server
    await gqlServer.start();

    app.get("/", (req, res) => {
        res.json({ message: "Server is running" });
    });

    app.use("/graphql", expressMiddleware(gqlServer));

    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
}

init();
