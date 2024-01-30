const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const upload = require('./utils/multerConfig');

const dotenv = require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
app.use(cors());

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false, limit: '2mb' }));
  app.use(express.json({ limit: '2mb' }));

  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        res.status(400).json({ error: err });
      } else {
        // Access the uploaded file through req.file
        if (req.file) {
          console.log('File received:', req.file);
          const filePath = `uploads/${req.file.originalname}`;
          req.file.path = filePath; // Update the file path for reference
  
          // TODO: Save file path to database

          res.status(200).json({ message: 'File uploaded successfully' });
        } else {
          res.status(400).json({ error: 'No file provided' });
        }
      }
    });
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the async function to start the server
  startApolloServer();
