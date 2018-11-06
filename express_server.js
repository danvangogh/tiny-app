
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session')
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['value'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))



// HARDCODED DATABASES

// ORIGINAL URL DATABASE
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

// ORIGINAL USER DATABASE
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
  },
  "454545": {
    id: "454545",
    email: "45@45.com",
    password: "45",
  }
}

////////////////////////////


// HOME / LANDING PAGE REDIRECT TO LOGIN
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// ADD NEW URL
app.get("/urls/new", (req, res) => {
  let user_id = req.session["user_id"];
  let user_object = users[req.session["user_id"]];
  templateVars = {
    user_object: user_object };
    if (user_id) {
    res.render("urls_new", templateVars);
    } else {
    res.redirect("/");
    }
});


// REGISTRATION PAGE
app.get("/register", (req, res) => {
  let user_id = req.session["user_id"];
  let user_object = users[user_id];
  templateVars = { user_object: user_object };
  // let templateVars = { username: req.session["username"] , password: req.session["password"] };
  res.render("register", templateVars);
});

// LOGIN PAGE
app.get("/login", (req, res) => {
  let user_id = req.session["user_id"];
  let user_object = users[user_id];
  templateVars = { user_object: user_object };
  // let templateVars = { username: req.session["email"] , password: req.session["password"] };
  res.render("login", templateVars);
});






app.get("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let longURL = urlDatabase[req.params.id].longURL;
  let user_id = req.session["user_id"];
  let user_object = users[user_id];
  let templateVars = { shortURL, longURL, urlDatabase, user_object: user_object };
  res.render("urls_show", templateVars);
});










function urlsForUser(id) {
  let newUserObj = {};
  for (let shortURL in urlDatabase) {
    if ( urlDatabase[shortURL].userID === id) {
      newUserObj[shortURL] = urlDatabase[shortURL];
      }
  }
      return newUserObj;
}




// URL INDEX PAGE

app.get("/urls", (req, res) => {

  let user_id = req.session["user_id"];
  let user_object = users[user_id];
  let templateVars = {
    user_object: user_object,
    urls: urlsForUser(user_id),
  }

  // return urlsForUser(user_id);
  res.render("urls_index", templateVars);
});










app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.post("/urls", (req, res) => {
  let newCode = generateRandomString(6);
  let newLongURL = req.body.longURL;
  let user_id = req.session["user_id"];

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
  if (req.session["user_id"]) {

  let userSession = req.session["user_id"];
  // let userDB = users[userSession].userID;
  // console.log("shortURL = ", users[userSession].id)
  // console.log("db = " + user)

  if ( users[userSession].id === req.session["user_id"] ) {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  }
  else res.send("this is not yours to delete.")
}
  else res.send("this is not yours to delete.")
});








// UPDATE
app.post("/urls/:id/update", (req, res) => {

  let newURL = req.body.longURL;
  let shortURL = req.params.id;
  let userSession = req.session["user_id"];
  let userDB = urlDatabase[shortURL].userID;

  if ( userDB === userSession ) {
    urlDatabase[shortURL].longURL = newURL;
    res.redirect("/urls/" + shortURL);
    }
    else res.send("this is not yours to change.")
  });




function validateUser(email, password){
  const hashedPassword = bcrypt.hashSync(password, 10);

  for (var key in users) {
    var databasePassword = users[key].password;

    if (users[key].email === email && bcrypt.compareSync(password, databasePassword) ) {
      return users[key];
    }
  }
}

// LOGIN PAGE
app.post("/login", (req, res) => {

  const email = req.body.email;
  const password = req.body.password
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (email && password) {

    var user = validateUser(email, password);

    if (user) {

      req.session.user_id = user.id;

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
console.log("req.session = ", req.session)
  req.session = null;
  // console.log("req.session.user_id = ", req.session.user_id)
  res.redirect("/urls/");
});


// REGISTRATION FORM
app.post("/register", (req, res) => {
  if (req.body.email && req.body.password && isEmailTaken(req.body.email) === false) {

    let newUserId = generateRandomString(6);

    req.session.user_id = newUserId;

  const password = req.body.password
  const hashedPassword = bcrypt.hashSync(password, 10);

    let newUserObj = {
      id: newUserId,
      email: req.body.email,
      password: hashedPassword
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
