import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import contentRoutes from './routes/content.routes';
import themeRoutes from './routes/theme.routes';
import categoryRoutes from './routes/category.routes';
import userRoutes from './routes/user.routes';
import connectDB from './config/database';
import authRoutes from './routes/auth.routes';
import dotenv from 'dotenv';
import cors from 'cors';
import contentExplorerRoutes from './routes/contentExplorer.routes';

const app = express();

dotenv.config();
// Use CORS middleware
app.use(cors());
// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Content Creator API',
      version: '1.0.0',
      description: 'API for managing content, themes, categories, and users',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/contents', contentRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/explorer', contentExplorerRoutes);

app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  console.log(`No route found for ${req.method} ${req.url}`);
  res.status(404).send('Not found');
});

export default app;
