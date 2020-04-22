const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const flash = require('connect-flash');

//error controller
const errorController = require('./controllers/error');

const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);

const app = express();
//store stores the mongodb sessions
//create an instance
const store = new mongoDBStore({
  uri: 'mongodb://localhost:27017/shop',
  collection: 'mySessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

//admin controller
const adminRoutes = require('./routes/admin');
//shop controller
const shopRoutes = require('./routes/shop');

const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));

//session middleware
// Save the session back to the store, replacing the contents on the store with the contents in memory
//This method is automatically called at the end of the HTTP response if the session data has been altered
// Because of this, typically this method does not need to be called.
app.use(
  session({
    secret: 'my secret',
    resave: false, 
    saveUninitialized: false,
    store: store
    })
  );

//for any non-get request(post request) data is changed so this middleware will look for 
//csrf token in your views with name='_csrf'
app.use(csrf());
app.use(flash());

app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
    .then(xuser => {
      req.user = new User(
        xuser._id,
        xuser.username,
        xuser.email,
        xuser.password,
        xuser.cart
      )
      next();
    })
    .catch(err => console.log('***test1 fail :',err));
});

//it will render these local variables in all views
app.use((req,res,next) =>{
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  if(!req.session.user){
    return next();
  }
  console.log('ssssssssssssssssssssssss',req.session.user);
    let x = req.session.user.email;
    console.log(x);
    if(x=='arihant263@gmail.com'){
      res.locals.isAdmin=true;
    }
    else{
      res.locals.isAdmin=false;
    }
  next();
});

//admin controller middleware matches the address of the webpage
app.use('/admin', adminRoutes);
//shop controller middleware
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);


//callback function passed to the function
mongoConnect(() => {
  app.listen(3000);
});
