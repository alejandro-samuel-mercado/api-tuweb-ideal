const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const { Pool } = require("pg");
const passport = require("passport");
const cookieParser = require("cookie-parser");

dotenv.config();
require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contentRoutes = require("./routes/contentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const emailRoutes = require("./routes/emailRoutes");

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 3001;
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "x-app-type",
    ],
  })
);

app.options(/.*/, cors({ credentials: true }));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, 
});

const sessionConfig = {
  store: new pgSession({
    pool,
    tableName: "user_sessions",
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || "secretcode",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    domain: process.env.NODE_ENV === "production" ? ".tuweb-ideal.unixxtech.online" : undefined,
    maxAge: 24 * 60 * 60 * 1000,
  },
};

const clientSession = session({ ...sessionConfig, name: "client.sid" });
const adminSession = session({ ...sessionConfig, name: "admin.sid" });

app.use((req, res, next) => {
  const appType = req.headers["x-app-type"];
  const origin = req.headers.origin || "";
  const adminUrl = (process.env.ADMIN_URL || "").replace(/\/$/, "");

  const isAdmin =
    appType === "admin" ||
    origin.includes("localhost:4200") ||
    origin.includes("127.0.0.1:4200") ||
    (adminUrl && origin.includes(adminUrl));
  
  console.log("Middleware Debug:", { origin, adminUrl, isAdmin, appType });

  if (isAdmin) return adminSession(req, res, next);
  return clientSession(req, res, next);
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/email", emailRoutes);

app.get("/", (req, res) => {
  res.send("TuWebIdeal Backend Running");
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
