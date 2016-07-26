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
//   username: 'potato' + Math.random(),
//   password: '12aassaxsxsx34'
// }, function(err, user) {
//   if (err) {
//     console.log(err);
//     console.log('creteUser err');
//   }
//   else {
//     console.log('createusersuccess')
//     redditAPI.createPost({
//       title: 'hi reddit!',
//       url: 'https://www.reddit.com',
//       userId: user.id,
//       subredditId: null
//     }, function(err, post) {
//       if (err) {
//         console.log(err);
//         console.log('createposterror');
      
//       }
//       else {
//         console.log('createpostsuccess')
//         redditAPI.createComment({name: 'codrin' , text: 'i like apples and oranges and you', userId: user.id, postId: post.id, parentId: null }, function(err, res) {
//   if (err) {
//     console.log(err);
//     console.log('createcommenterror')
//   }
//   else {
//     console.log(res);
//     console.log('createcommentsuccess')
//   }
// });
        
//         //console.log(post);
//       }
//     });
//   }
// });


// redditAPI.getAllPosts(function(err,res){
// //   console.log(res);
// // });

// // redditAPI.getAllPostsFromUser('3', function(err, res){
// // //  console.log(err);
// //   console.log(res);
// // });

// // redditAPI.getSinglePost('1', function(err, res){
// //   console.log(err);
// //   console.log(res);
// // })

// // redditAPI.createSubreddit({name: 'CodrinsKillings', description: 'UK'}, function(err, res){
// //     console.log(err);
// //     console.log(res);
// // })

// redditAPI.getAllSubreddits(function (err, res) {
//   if (err) {
    
//   console.log(err);
//   }
//   else { 
//     console.log(res)
//   }
// } 
// )



redditAPI.createOrUpdateVote({postId: 1, userId: 1, vote: 1}, function(err, res) {
  
  if (err) {
  console.log(err.stack);
  }
  else { 
    console.log(res);
  }
});

