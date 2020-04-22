// built in node library used to generate unique random values
const crypto = require('crypto');

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTranport = require('nodemailer-sendgrid-transport');

//render matches the we address we can pass values
//redirect means to control to specific page new request is started

const transporter = nodemailer.createTransport(sendGridTranport({
    auth:{
        api_key:'Your Key(SendGrid)'
    }
}));


exports.getLogin = (req, res, next) => {
    let err_message = req.flash('error_m');
    if(err_message.length>0){
        err_message = err_message[0];
    }
    else{
        err_message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
        errorMessage: err_message
      });

};


exports.postLogin = (req, res, next) => {
    // session object is automatically created by req when session is created
    //we can set any variable in the session
    const email = req.body.email;
    const password = req.body.password;

    User.findEmail(email)
    .then(user => {
        if(!user){
            req.flash('error_m','Invalid email or Password');//create key value pair in req and then use the key during render
            return res.redirect('/login');
        }
        bcrypt
        .compare(password,user.password)
        .then(doMatch =>{
            if(doMatch){
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                console.log(err);
                res.redirect('/');
                });
            }
            req.flash('error_m','Invalid email or Password');
            res.redirect('/login');
        })
        .catch(err =>{
            console.log(err);
            res.redirect('/login');
        });
    })
    .catch(err =>{
        console.log(err);
    });
    
};


exports.getSignUp = (req, res, next) => {
    let err_message = req.flash('error_m');
    if(err_message.length>0){
        err_message = err_message[0];
    }
    else{
        err_message = null;
    }

    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'SignUp',
        isAuthenticated: false,
        errorMessage: err_message
      });

};

exports.postSignUp = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    User.findEmail(email)
    .then(userDoc =>{
        if(userDoc){
            req.flash('error_m','Email exists already! pick a different one.');
            return res.redirect('/signup');
        }
        return bcrypt
        .hash(password,12)
        .then(hpass =>{
            const user = new User(null,username,email,hpass,{items: []});
            return user.save();
        })
        .then(result =>{
            res.redirect('/login');
            return transporter.sendMail({
                to:email,
                from:'tnahira263@gmail.com',
                subject:'Rama Agency!',
                html:'<h1>Welcome to Rama Agency<br>You have successfully signed up!</h1>'      
            });
        })
        .catch(err =>{
            console.log(err);
        });
        
    })
    .catch(err => {
        console.log(err);
    })
};



exports.postLogout = (req,res,next) => {
    // on click of logout button session will be destroyed 
    //destroy will also execute inner function
    req.session.destroy(err =>{
        console.log('Logout : ',err);
        res.redirect('/');
    });
}

exports.getReset = (req,res,next) =>{
    let err_message = req.flash('error_m');
    if(err_message.length>0){
        err_message = err_message[0];
    }
    else{
        err_message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: err_message
      });
}

exports.postReset = (req,res,next) =>{
    crypto.randomBytes(32, (err,buffer)=>{
        if(err){
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
    });
};
