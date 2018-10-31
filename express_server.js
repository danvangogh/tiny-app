
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


// urlObj =

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let fullURL = urlDatabase[shortURL];
  let templateVars = { shortURL, fullURL };
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/urls", (req, res) => {
  let newCode = generateRandomString(6);
  let newLongURL = req.body.longURL;
  urlDatabase[newCode] = newLongURL;
  console.log(urlDatabase);

  res.redirect('/urls/' + newCode);
  //console.log(newCode, fullURL);
    // Respond with 'Ok' (we will replace this)
});

function generateRandomString(end) {
  return Math.random().toString(36).substr(2).slice(0, end);
}

app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  // console.log(urlDatabase[shortURL]);
  let longURL = urlDatabase[shortURL];
  // console.log(urlDatabase[shortURL])

  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];

  res.redirect('/urls');
  });

app.post("/urls/:id/update", (req, res) => {
  console.log("testing");
  let newURL = req.body.longURL;
  let shortURL = req.params.id;
  //console.log("newURL = " + newURL[shortURL]);
  //console.log("shortURL = " + shortURL);
  //console.log("urlDatabase[newURL] = " + urlDatabase[newURL]);
  //console.log("urlDatabase[shortURL] = " + urlDatabase[shortURL]);
  urlDatabase[shortURL] = newURL;
  // console.log("after updating ",urlDatabase);
  // delete urlDatabase[req.params.id];

  res.redirect("/urls/" + newURL);
  });

