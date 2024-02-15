// server.js
// Main server file

const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");
const path = require("path");
const { authMiddleware } = require("./utils/auth");

const dotenv = require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

// Set the port for the server
const PORT = process.env.PORT || 3001;

// Create a new instance of an Express server
const app = express();

// Create a new instance of an Apollo server with the GraphQL schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Enable CORS
app.use(cors());

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();

  // Set up middleware for the Apollo server
  app.use(express.urlencoded({ extended: false, limit: "2mb" }));
  app.use(express.json({ limit: "2mb" }));

  // Set up GraphQL middleware for the Apollo server
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  // Connect to the database and start the server
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the async function to start the server
startApolloServer();
