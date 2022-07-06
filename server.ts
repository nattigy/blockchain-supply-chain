import StartApolloServer from "./src/graphql/apolloServer";
import {PORT} from "./src/config/constants";
import chalk from "chalk";
import httpServer, {app} from "./src/app";

import * as dotenv from "dotenv";

dotenv.config()

async function startServer() {
    let graphqlPath = await StartApolloServer(app)
    // @ts-ignore
    await new Promise(resolve => httpServer.listen({port: PORT}, resolve)).catch((err) => console.log('x Server crashed'));
    console.log(`${chalk.green('✓')} GraphQL running on http://localhost:${PORT + graphqlPath}`);

    process.on('unhandledRejection', err => {
        // @ts-ignore
        // console.log(err?.name!, err.message);
        // Shutting Down Server
        console.log('UNHANDLED REJECTION! 💥 Shutting down...', "from index.js")
        httpServer.close(() => {
            process.exit(1); // 0 - success | 1 - Uncaught Exception
        });
    });

    process.on('SIGTERM', () => {
        console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
        httpServer.close(() => {
            console.log('💥 Process terminated!');
        });
    });
}

startServer()

