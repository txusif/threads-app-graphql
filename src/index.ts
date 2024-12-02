import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createApolloGraphqlServer from "./graphql";
import UserService from "./services/user";

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    app.use(express.json());

    app.get("/", (req, res) => {
        res.json({ message: "Server is running" });
    });

    // const gqlServer = await createApolloGraphqlServer();

    app.use(
        "/graphql",
        // @ts-ignore
        expressMiddleware(await createApolloGraphqlServer(), {
            context: async ({ req }) => {
                const token = req.headers["token"];
                try {
                    const user = await UserService.decodeJWTToken(
                        token as string
                    );
                    return { user };
                } catch (error) {
                    return { user: null };
                }
            },
        })
    );

    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
}

init();
