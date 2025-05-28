require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");
const urlParser = require("url");

let urls = [];

app.use(bodyParser.urlencoded({extended: false}));
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function(req, res) {
  const inputUrl = req.body.url
  const hostname = urlParser.parse(inputUrl).hostname;

  dns.lookup(hostname, (err) => {
    if(err) return res.json({error: "Invalid Url"});

    const short = urls.length + 1;
    urls.push({original_url: inputUrl, short_url: short});
    res.json({original_url: inputUrl, short_url: short});
  })
  
})

app.get("/api/shorturl/:shorturl", function(req,res) {
  const short = parseInt(req.params.shorturl);
  const entry = urls.find(url => url.short_url === short);

  if(entry) {
    res.redirect(entry.original_url);
  }else{
    res.json({error: "No short URL found for the given input"})
  }
})


app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
