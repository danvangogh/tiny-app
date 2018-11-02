
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

// original DB
const urlDatabase = {
  "b2xVn2": {
    shortURL: "b2xVn2",
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID",
  },
  "9sm5xK": {
    shortURL: "b2xVn2",
    longURL: "http://www.google.com",
    userID: "userRandomID",
  }
}


const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "asdf",
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "asdf",
  }
}


////////////////////////////

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


app.get("/urls/new", (req, res) => {
  let user_id = req.cookies["user_id"];
  let user_object = users[user_id];
  templateVars = {
    user_object: user_object,
   };
  if (user_object) {
  res.render("urls_new", templateVars);
} else {
  res.redirect("/login");
}
});


// REGISTRATION PAGE
app.get("/register", (req, res) => {
  let user_id = req.cookies["user_id"];
  let user_object = users[user_id];
  templateVars = { user_object: user_object };
  // let templateVars = { username: req.cookies["username"] , password: req.cookies["password"] };
  res.render("register", templateVars);
});

// LOGIN PAGE
app.get("/login", (req, res) => {
  let user_id = req.cookies["user_id"];
  let user_object = users[user_id];
  templateVars = { user_object: user_object };
  // let templateVars = { username: req.cookies["email"] , password: req.cookies["password"] };
  res.render("login", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let longURL = urlDatabase[req.params.id].longURL;
  let user_id = req.cookies["user_id"];
  let user_object = users[user_id];
  let templateVars = { shortURL, longURL, urlDatabase, user_object: user_object };
  res.render("urls_show", templateVars);
});


app.get("/urls", (req, res) => {
  let user_id = req.cookies["user_id"];
  let user_object = users[user_id];
  let templateVars = {
    urls: urlDatabase,
    user_object: user_object,
  };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.post("/urls", (req, res) => {
  let newCode = generateRandomString(6);
  let newLongURL = req.body.longURL;
  let user_id = req.cookies["user_id"];

  urlDatabase[newCode] = {
    shortURL: newCode,
    longURL: newLongURL,
    userID: user_id
  };

  console.log(newLongURL);
  // console.log("shortURL = " + shortURL)
  // console.log("shortURL[longURL] = " + shortURL[longURL])

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
    console.log(urlDatabase);
  urlDatabase[shortURL].longURL = newURL;
  console.log("after updating ",urlDatabase[shortURL].longURL);
  res.redirect("/urls/" + shortURL);
  });




function validateUser(email, password){
  for(var key in users){
    if(users[key].email === email && users[key].password === password){
      return users[key];
    }
  }
}
// ENTER USERNAME
app.post("/login", (req, res) => {

  let password = req.body.password;
  let email = req.body.email;

  if (req.body.email && req.body.password) {
    //validate the credentials of the user
    var user = validateUser(email, password);
    if(user){
      // console.log("everything worked");
      res.cookie('user_id', user.id);
      res.redirect("/urls");

    } else {
      res.status(403).send('Username or password was incorrect');
    }
  } else {
      return res.status(403).send("That there's a 403, bud.")
  }
});




// LOGOUT
app.post("/LOGOUT", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls/");
});


// REGISTRATION FORM
app.post("/register", (req, res) => {
  if (req.body.email && req.body.password && isEmailTaken(req.body.email) === false) {
    // res.cookie("email", req.body.email);
    // res.cookie("password", req.body.password);
    let newUserId = generateRandomString(6);

    res.cookie("user_id", newUserId);

    let newUserObj = {
      id: newUserId,
      email: req.body.email,
      password: req.body.password
    };

    users[newUserId] = newUserObj;

    console.log("users = " + JSON.stringify(users));
    console.log("new user obj = " + JSON.stringify(newUserObj));
  } else {
    res.status(400).send("That's a 400, friend.");
  }
  res.redirect("/urls")

});

// CHECK IF EMAIL EXISTS
function isEmailTaken(email) {
  for(const userId in users) {
    var user = users[userId];
    if (user.email === email) {
      return true;
    }
  }
  return false;
}


// Legacy Code

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});



// todo:    Error: Can't set headers after they are sent.
