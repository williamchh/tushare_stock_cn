const express = require("express");
const connectDB = require("./config/db");

const app = express();

// connect database
connectDB();

app.use(express.json({ extended: false }));

app.use("/ts/tushare", require("./routes/tushare"));
app.use("/ts/daily", require("./routes/tushareDaily"));
app.use("/ts/mql4", require("./routes/mql4"));
app.use("/ts/singleHst", require("./routes/singleHstData"));

app.use("/test", require("./routes/test"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server start on port ${PORT}`));
