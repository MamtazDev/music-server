const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const connectDB = require("./db/mongoose");
const cors = require("cors");
const passport = require("passport");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const timelineRoutes = require("./routes/timelineRoutes");
const myPageRoutes = require("./routes/myPageRoutes");

require("./models");
require("./passport-config");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
const port = process.env.PORT || 5000;

const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mymusictimeline API",
      version: "1.0.0",
      description: "API Documentation",
    },
    servers: [
      {
        url: `http://localhost:${port}/api`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
console.log(`Swagger docs available at http://localhost:${port}/api-docs`);

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`[DEBUG] Incoming request: ${req.method} ${req.url}`);
  next();
});

// Database connection
connectDB()
  .then(() => {
    console.log(
      `[DEBUG] Connected to the database successfully. URI: ${process.env.MONGODB_URI.slice(
        0,
        20
      )}...`
    );
  })
  .catch((error) => {
    console.error("[ERROR] Error connecting to the database:", error);
  });

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      url: process.env.MONGODB_URI,
      collection: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Session and user logging
app.use((req, res, next) => {
  console.log("[DEBUG] Session:", req.session);
  console.log("[DEBUG] User:", req.user);
  next();
});

// Route setup
console.log("[DEBUG] Before using routes");
app.use("/api/auth", authRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/mypage", myPageRoutes);
console.log("[DEBUG] After using routes");

// Production setup
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error("[ERROR] Global error handler:", err.stack);
  res.status(500).send("Something went wrong!");
});

// Server initialization
console.log(
  `[INFO] Server is running on port ${port} in ${process.env.NODE_ENV} mode.`
);
app.listen(port, () => {
  console.log(`[INFO] Server is running on port ${port}`);
});
