
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const cookieParser = require('cookie-parser')

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// urlObj =

// Hardcoded Databases

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}


////////////////////////////

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls/new", (req, res) => {
  templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

// Registration Page
app.get("/register", (req, res) => {
  let templateVars = { username: req.cookies["username"] , password: req.cookies["password"] };
  res.render("register", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let fullURL = urlDatabase[shortURL];
  let templateVars = { shortURL, fullURL, username: req.cookies["username"], };
  res.render("urls_show", templateVars);
});


app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});



app.post("/urls", (req, res) => {
  let newCode = generateRandomString(6);
  let newLongURL = req.body.longURL;
  urlDatabase[newCode] = newLongURL;
  console.log(urlDatabase);

  res.redirect("/urls/" + newCode);
  //console.log(newCode, fullURL);
    // Respond with 'Ok' (we will replace this)
});





// GENERATES RANDOM STRING
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

// DELETE
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
  });


// UPDATE
app.post("/urls/:id/update", (req, res) => {
  let newURL = req.body.longURL;
  let shortURL = req.params.id;
  // console.log("shortURL = " + shortURL);
  urlDatabase[shortURL] = newURL;
  // console.log("after updating ",urlDatabase);
  res.redirect("/urls/" + newURL);
  });

// ENTER USERNAME
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls/");
});

// LOGOUT
app.post("/LOGOUT", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls/");
});


// REGISTRATION FORM
app.post("/register", (req, res) => {
  res.cookie("email", req.body.email);
  res.cookie("password", req.body.password);

  let newUserId = generateRandomString(6);

  let newUserObj = {
  id: newUserId,
  email: req.body.email,
  password: req.body.password
  };

  users[newUserId] = newUserObj;

  console.log("users = " + JSON.stringify(users));
  console.log("new user obj = " + JSON.stringify(newUserObj));
  res.redirect("/urls/")
})




// Legacy Code

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
