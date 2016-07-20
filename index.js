// load the mysql library
var mysql = require('mysql');

// create a connection to our Cloud9 server
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'shreyakaicker', // CHANGE THIS :)
  password : '',
  database: 'reddit'
});

// load our API and pass it the connection
var reddit = require('./reddit.js');
var redditAPI = reddit(connection);

//It's request time!

// redditAPI.createUser({
//   username: 'codriniscrazy',
//   password: '1234'
// }, function(err, user) {
//   if (err) {
//     console.log(err);
//   }
//   else {
//     redditAPI.createPost({
//       title: 'hi reddit!',
//       url: 'https://www.reddit.com',
//       userId: user.id
//     }, function(err, post) {
//       if (err) {
//         console.log(err);
//       }
//       else {
//         console.log(post);
//       }
//     });
//   }
// });
// redditAPI.getAllPosts(function(err,res){
//   console.log(res);
// });

// redditAPI.getAllPostsFromUser('3', function(err, res){
// //  console.log(err);
//   console.log(res);
// });

// redditAPI.getSinglePost('1', function(err, res){
//   console.log(err);
//   console.log(res);
// })

redditAPI.createSubreddit({name: 'CodrinsKillings', description: 'UK'}, function(err, res){
    console.log(err);
    console.log(res);
})