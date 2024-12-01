import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db";

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    app.use(express.json());

    // Create graphql server
    const server = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }

            type Mutation {
                createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
            }
        `,
        resolvers: {
            Query: {
                hello: () => "Hello! I am a graphql server",
                say: (_, { name }: { name: string }) =>
                    `Hello ${name}, how are you?`,
            },

            Mutation: {
                createUser: async (
                    _,
                    {
                        firstName,
                        lastName,
                        email,
                        password,
                    }: {
                        firstName: string;
                        lastName: string;
                        email: string;
                        password: string;
                    }
                ) => {
                    await prismaClient.user.create({
                        data: {
                            firstName,
                            lastName,
                            email,
                            password,
                            salt: "randomSalt",
                        },
                    });
                    console.log(firstName, lastName, email, password);
                    return true;
                },
            },
        },
    });

    // Start the gql server
    await server.start();

    app.get("/", (req, res) => {
        res.json({ message: "Server is running" });
    });

    app.use("/graphql", expressMiddleware(server));

    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
}

init();
