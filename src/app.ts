import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { sendResponse } from './utils/response';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import fs from 'fs';

const app = express();

// Security and Performance Middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Swagger Documentation
const swaggerPath = path.join(__dirname, '../swagger.yaml');
if (fs.existsSync(swaggerPath)) {
  const swaggerDocument = YAML.load(swaggerPath);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Routes
app.use('/api', routes);

// Root Endpoint
app.get('/', (req, res) => {
  sendResponse(res, 200, true, 'Sports Meetup API is running!');
});

// 404 & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
