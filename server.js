const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

const session = require("express-session");
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
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-app-type"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

const sessionConfig = {
  secret: process.env.SESSION_SECRET || "secretcode",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  },
};

const clientSession = session({
  ...sessionConfig,
  name: "client.sid",
});

const adminSession = session({
  ...sessionConfig,
  name: "admin.sid",
});

app.use((req, res, next) => {
  const appType = req.headers["x-app-type"];
  const origin = req.headers.origin || req.headers.referer || "";

  const isAdmin =
    appType === "admin" ||
    origin.includes("localhost:4200") ||
    origin.includes("127.0.0.1:4200");

  if (isAdmin) {
    return adminSession(req, res, next);
  }
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
