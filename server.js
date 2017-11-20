"use strict"

require("dotenv").config();

const express = require("express"),
      http = require("http"),
      path = require("path"),
      fs = require("fs"),      
      bodyParser = require("body-parser"),
      router = require ("./router"),    
      // SECURITY
      helmet = require("helmet"),
      helmet_csp = require("helmet-csp"),
      // LOGGING
      morgan = require('morgan'),
      accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'}), // writable stream - for MORGAN logging
      // DB
      mongoose = require("mongoose"),      
      dbUrl = "mongodb://" + process.env.DBUSER + ":" + process.env.DBPASS + process.env.DBLINK,
      // PORT & ROUTER
      port = process.env.PORT || 3000,
      app = express();




// App Setup
app.use(morgan('combined', {stream: accessLogStream}));
app.use(bodyParser.json({type: "*/*"}));



// SECURITY middleware (Helmet, Helmet-csp)
app.use(helmet({dnsPrefetchControl: {allow: true}}));
/* for example
app.use(function(req, res, next) {
      res.set({
      "Access-Control-Allow-Origin" : "*",
      "Access-Control-Allow-Headers" : "Origin, X-Requested-With, content-type, Accept"
      });
      app.disable('x-powered-by');
      next();
});*/



app.use(helmet_csp({
directives: {
      scriptSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com/'],
      styleSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com/'],
      imgSrc: ['img.com', 'data:'],
      sandbox: ['allow-forms', 'allow-scripts'],
      reportUri: '/report-violation' // set up a POST route for notifying / logging data to server
},
//reportOnly: does not block request (for debugging purposes)
reportOnly: function (req, res) {
            if (req.query.cspmode === 'debug') {
                  return true
            } else {
                  return false
            }
      }
}));



// DB Setup
mongoose.connect(dbUrl);



// Routing
router(app);



//Server Setup
const server = http.createServer(app);
server.listen(port, () => console.log("Listening on port: " + port));