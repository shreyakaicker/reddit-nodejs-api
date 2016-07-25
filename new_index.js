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
var reddit = require('./new_reddit.js');
var redditAPI = reddit(connection);

//It's request time!

// redditAPI.createUser({username: 'Dylan', password: 'charlie'}, console.log);
// redditAPI.createUser({username: 'Shreya', password: 'anything'}, console.log);
// redditAPI.createUser({username: 'Simon', password: 'hair'}, console.log);
// redditAPI.createUser({username: 'Julian', password: 'gpa'}, console.log);


// redditAPI.createPost({
//   title: 'Hello Reddit!',
//   url: 'https://www.reddit.com',
//   userId: '1',
//   subredditId: null
//   }, 
//   function(err, post) {
//   if (err) {
//     console.log(err);  
//   }
//   else {
//     console.log(post);
//   }  
// });

// redditAPI.createPost({
//   title: 'Howdy do!',
//   url: 'https://www.google.com',
//   userId: '2',
//   subredditId: null
//   }, 
//   function(err, post) {
//   if (err) {
//     console.log(err);  
//   }
//   else {
//     console.log(post);
//   }  
// });

// redditAPI.createPost({
//   title: 'Time to waste some time on Facebook!',
//   url: 'https://www.facebook.com',
//   userId: '3',
//   subredditId: null
//   }, 
//   function(err, post) {
//   if (err) {
//     console.log(err);  
//   }
//   else {
//     console.log(post);
//   }  
// });

// redditAPI.createPost({
//   title: 'I\'d like to graduate from McGill!',
//   url: 'https://www.mcgill.ca',
//   userId: '4',
//   subredditId: null
//   }, 
//   function(err, post) {
//   if (err) {
//     console.log(err);  
//   }
//   else {
//     console.log(post);
//   }  
// });

// redditAPI.createSubreddit({name: 'McGill graduation party', description: 'McGill Campus'}, function(err, res){
//     console.log(res);
// });

// redditAPI.createSubreddit({name: 'Emma\'s birthday party', description: 'Rio Tinto Planetarium'}, function(err, res){
//     console.log(res);
// });

// redditAPI.createSubreddit({name: 'The big presentation', description: 'August 26th at WeWork'}, function(err, res){
//     console.log(res);
// });

// redditAPI.createSubreddit({name: 'Back to school bash', description: 'Concordia University'}, function(err, res){
//     console.log(res);
// });

// redditAPI.createComment({
//   text: 'Today is a beautiful day!',
//   userId: '1',
//   postId: '1'
//   }, 
//   function(err, post) {
//     console.log(post);
//   }
// );

// redditAPI.createComment({
//   text: 'Yesterday was a beautiful day!',
//   userId: '2',
//   postId: '1'
//   }, 
//   function(err, post) {
//     console.log(post);
//   }
// );

// redditAPI.createComment({
//   text: 'What a great day to be alive!',
//   userId: '3',
//   postId: '2'
//   }, 
//   function(err, post) {
//     console.log(post);
//   }
// );

// redditAPI.createComment({
//   text: 'Man oh man, I shouldn\'t have gone out last night!',
//   userId: '4',
//   postId: '3'
//   }, 
//   function(err, post) {
//     console.log(post);
//   }
// );

// redditAPI.createComment({
//   text: 'I know that I should have studied more yesterday that\'s for sure!',
//   userId: '1',
//   postId: '1'
//   }, 
//   function(err, result) {
//     redditAPI.createComment({
//       text: "I know, right?",
//       userId: '4',
//       postId: '1',
//       parentId: result.id
//     },
//     function(err, result){
//       redditAPI.createComment({
//         text: "Oh my god, last night was crazy!",
//         userId: '3',
//         postId: '1',
//         parentId: result.id
//       }, function(err, result){
//         console.log(result);
//       });
//     });
//   }
// );


// redditAPI.getAllPosts(function(err,res){
//   console.log(res);
// });

// redditAPI.getAllPostsFromUser(3, function(err, res){
//   console.log(res);
// });

// redditAPI.getSinglePost(4, function(err, res){
//   console.log(res);
// });

// redditAPI.getAllSubreddits(function (err, res) {
//   if (err) {
//     console.log(err);
//   }
//   else { 
//     console.log(res)
//   }
// });

redditAPI.getCommentsForPost(1, function(err,comments){
  var finalComments = [];
  var commentsIndex = {};
    if(err){
      console.log(err);
    }
 
  comments.forEach(function(commentGroup){
    var comment1;
    if (commentsIndex[commentGroup.c1_id]){
      comment1 = commentsIndex[commentGroup.c1_id];
    }
    else {
      comment1 = {
        id: commentGroup.c1_id,
        text: commentGroup.c1_text,
        parentId: commentGroup.c1_parentId,
        replies: []
      };
      commentsIndex[commentGroup.c1_id] = comment1;

      finalComments.push(comment1);
    }

    if (commentGroup.c2_id === null){
      return;
    }

    var comment2;
    if (commentsIndex[commentGroup.c2_id]){
      comment2 = commentsIndex[commentGroup.c2_id];
    }
    else {
      comment2 = {
        id: commentGroup.c2_id,
        text: commentGroup.c2_text,
        parentId: commentGroup.c2_parentId,
        replies: []
      }

      commentsIndex[commentGroup.c2_id] = comment2;

      comment1.replies.push(comment2);
    }

    if (commentGroup.c3_id !== null){
      comment2.replies.push({
        id: commentGroup.c3_id,
        text: commentGroup.c3_text,
        parentId: commentGroup.c3_parentId
      });
    }
  });
  console.log(JSON.stringify(finalComments, null, 4));
});