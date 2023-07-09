const express=require('express');
const mongoose=require('mongoose');
const session=require('express-session');
require('dotenv').config()
const PORT=4100;
const connectDB = require('./db/config');
const routes = require('./routes/routes')


connectDB();


/*initialisation de mon server */
const app=express();


//mildllewares
app.use('/static', express.static('public'));
app.use(express.static('uploads')); //lire les images qui se trouvent uploads
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(session({
    secret: 'Ma clé secrete',
    resave: false,
    saveUninitialized: true
  }))

app.use((req,res,next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})

// View engine setup
app.set('view engine', 'ejs');

//route prefix
app.use('/',routes)


//listen on port

app.listen(PORT,()=>{
    console.log(`server started at http://localhost/:${PORT}`);
    
})