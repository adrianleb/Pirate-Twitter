//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , twitterSender = require('twitter')
    , everyauth = require ('everyauth')
    , util = require('util')
    , port = (process.env.PORT || 1337);





var twit = new twitterSender({
    consumer_key: 'AssbM1aeSVQ0f0hyOAARMA',
    consumer_secret: 'LZI7tQaOjQhgzPrQuvGOTwXbfJSAvdxfLm9GMVP5NnE',
    access_token_key: 'pie',
    access_token_secret: 'cake'
  });


everyauth.twitter
  .consumerKey('AssbM1aeSVQ0f0hyOAARMA')
  .consumerSecret('LZI7tQaOjQhgzPrQuvGOTwXbfJSAvdxfLm9GMVP5NnE')
  .findOrCreateUser( function (session, accessToken, accessTokenSecret, twitterUserMetadata) {
 var promise =  this.Promise().fulfill(twitterUserMetadata);


 return promise;






  })
  .redirectPath('/');




 





//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('view_engine', 'jade');
    server.set('views', __dirname + '/views');
    server.set('view options', { layout: false });
    server.use(express.bodyParser());
    server.use(express.methodOverride());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "thephpowns"}));
    server.use(everyauth.middleware());
    server.use(connect.static(__dirname + '/static'));
    server.use(server.router);
});

everyauth.helpExpress(server);

//setup the errors
server.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.jade', { locals: { 
                  title : '404 - Not Found'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX' 
                },status: 404 });
    } else {
        res.render('500.jade', { locals: { 
                  title : 'The Server Encountered an Error'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX'
                 ,error: err 
                },status: 500 });
    }
});
server.listen( port );




//$pie





///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////



server.get('/', function(req,res){

  var user, liveTweet;
 // asks if user is logged
  if (req.session.auth) {

 
  user = req.session.auth.twitter.user.name;

//console.log(req.session.auth.twitter.user);
  // console.log('and now is+ ' + util.inspect(twit.options.access_token_key));
 //  console.log('and now is secret' + util.inspect(twit.options.access_token_secret));
twit.options.access_token_key = req.session.auth.twitter.accessToken;
    twit.options.access_token_secret = req.session.auth.twitter.accessTokenSecret;


// STREAM TWITTER

  } 

//console.log(user + ' once again to make sure');
  res.render('index.jade', {
    locals : { 
             
             User  : user
             ,title : 'Becomedia'
             ,description: 'One day, when i grow up, ill be a complete description!'
             ,author: 'thePENTHOUSEPROJECT'
             ,analyticssiteid: 'UA-26801801-1' 
            }
  });

   



});

//GRABBING THE POST FROM ROOT



server.post('/', function(req,res){
 if (req.session.auth) {
  var tweetbody = req.body['thetextbox'];

    twit.options.access_token_key = req.session.auth.twitter.accessToken;
    twit.options.access_token_secret = req.session.auth.twitter.accessTokenSecret;

      twit
          .verifyCredentials(function (err, data) {
    
          })
          .updateStatus(tweetbody,
            function (err, data) {
              console.log('sent something over')
             
            });

twit.options.access_token_key = 'pie';
    twit.options.access_token_secret = 'cake';
}

 

  res.redirect('/done');



 
});


server.get('/done', function(req,res){
  res.render('done.jade', {
    locals : { 
              title : 'About us'
             ,description: 'Your Page Description'
             ,author: 'Your Name'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});


server.get('/about', function(req,res){
  res.render('about.jade', {
    locals : { 
              title : 'About us'
             ,description: 'Your Page Description'
             ,author: 'Your Name'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});


//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


//console.log('Listening on http://becomedia.thephp:' + port );
