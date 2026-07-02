import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

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

//Health Check Endpoint
app.get("/api/health", (req, res) => {
    res.status(200)
    .json({ status: "ok", message: "Backend is running smoothly!", 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development"
    });
});

app.listen(PORT, () => {
    console.log(`Backend Server is running on port ${PORT}`);
});

export default app;
