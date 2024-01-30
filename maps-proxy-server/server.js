const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT;
const BASE_API_URL = process.env.BASE_API_URL;

app.use(express.json());
app.use(cors());

app.post("/", async (req, res) => {
    console.log("we hit our post route")
    try {
        const { location, distance, query } = req.body;
        req.body.key = API_KEY;
        const queryString = `${BASE_API_URL}?location=${encodeURIComponent(location)}&radius=${distance}&keyword=${encodeURIComponent(query)}&key=${API_KEY}`;
        console.log("query string!#@!@!", queryString)
        const mapsData = await axios.get(queryString);
        res.status(200).json(mapsData.data)
    } catch(err) {
        console.log(console.error(err))
        res.status(400).send(err)
    }

});

app.listen(PORT || 3003, () => {
  console.log(`app is live on port: ${PORT}`);
});