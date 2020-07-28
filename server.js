const express = require("express");
const connectDB = require("./config/db");

const app = express();

// connect database
connectDB();

app.use(express.json({ extended: false }));

app.use("/ts/tushare", require("./routes/tushare"));

app.use("/test", require("./routes/test"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server start on port ${PORT}`));
