import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import router from "./routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
// helmet helps secure your Express apps by setting various HTTP headers.
// It's a collection of smaller middleware functions that 
// set security-related HTTP response headers.
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type"],
}));
app.use(express.json());


// Routes
app.use('/api', router);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`
    }
  })
})

// Global error handler — must be last
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Backend Server is running on port ${PORT}`);
});

export default app;
