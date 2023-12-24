const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const connectToDatabase = require("./utils/connection.util");
// Import all routers
const userRouter = require("./routes/user.routes");
// Documents verificatoin

// dotEnv Configuration
dotenv.config();

// JSON Configuration
app.use(express.json());

// Cors Configuration
app.use(cors());

// Mongoose Connection
connectToDatabase();

// API's routes
app.use("/ropstam-car/api/v1/user", userRouter);

// Listening to a server
app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
