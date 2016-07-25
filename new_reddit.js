var bcrypt = require('bcrypt');
var HASH_ROUNDS = 10;

module.exports = function RedditAPI(conn) {
  return {
    createUser: function(user, callback) {

      // first we have to hash the password...
      bcrypt.hash(user.password, HASH_ROUNDS, function(err, hashedPassword) {
        if (err) {
          callback(err);
        }
        else {
          conn.query(
            'INSERT INTO users (username, password, createdAt, updatedAt) VALUES (?, ?, ?, ?)', [user.username, hashedPassword, new Date(), new Date()],
            function(err, result) {
              if (err) {
                /*
                There can be many reasons why a MySQL query could fail. While many of
                them are unknown, there's a particular error about unique usernames
                which we can be more explicit about!
                */
                if (err.code === 'ER_DUP_ENTRY') {
                  callback(new Error('A user with this username already exists'));
                }
                else {
                  callback(err);
                }
              }
              else {
                /*
                Here we are INSERTing data, so the only useful thing we get back
                is the ID of the newly inserted row. Let's use it to find the user
                and return it
                */
                conn.query(
                  'SELECT id, username, createdAt, updatedAt FROM users WHERE id = ?', [result.insertId],
                  function(err, result) {
                    if (err) {
                      callback(err);
                    }
                    else {
                      /*
                      Finally! Here's what we did so far:
                      1. Hash the user's password
                      2. Insert the user in the DB
                      3a. If the insert fails, report the error to the caller
                      3b. If the insert succeeds, re-fetch the user from the DB
                      4. If the re-fetch succeeds, return the object to the caller
                      */
                      callback(null, result[0]);
                    }
                  }
                );
              }
            }
          );
        }
      });
    },
    createPost: function(post, callback) {
      conn.query(
        'INSERT INTO posts (userId, title, url, subredditId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)', [post.userId, post.title, post.url, post.subredditId, new Date(), new Date()],
        function(err, result) {
          if (err) {
            callback(err);
          }
          else {

            /*
            Post inserted successfully. Let's use the result.insertId to retrieve
            the post and send it to the caller!
            */
            conn.query(
              'SELECT id, title, url, userId, subredditId, createdAt, updatedAt FROM posts WHERE id = ?', [result.insertId],
              function(err, result) {
                if (err) {
                  callback(err);
                }
                else {
                  callback(null, result[0]);
                }
              }
            );
          }
        }
      );
    },
    createSubreddit: function(sub, callback) {
      conn.query(
        'INSERT INTO subreddits (name, description) VALUES (?, ?)', [sub.name, sub.description],
          function(err, result) {
            if (err) {
              callback(err);
            }
            else {
              conn.query(
                'SELECT name, description FROM subreddits WHERE id = ?', [result.insertId],
                function(err, result) {
                  if (err) {
                    callback(err);
                  }
                  else {
                    callback(null, result[0]);
                  }
              }
            );
          }
        }
      );
    },
    createComment: function(comment, callback)  {
      if (!comment.userId || !comment.postId) {
        callback(null, new Error('userId and postId required'));
        return;
      }
      if(!comment.parentId){
        comment.parentId = null;
      }
      var date = new Date();

      // console.log(comment);
      // callback(null, true);

      // function handleResults(result){
        
      //   console.log(result);
      //   callback(null, true);
      // }

      console.log(comment);
      conn.query(
        `INSERT INTO comments 
          (id, text, createdAt, updatedAt,
          userId, postId, parentId) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`, 
          [comment.id, comment.text, date, date, comment.userId, comment.postId, comment.parentId],
          // function(err,result){
            function(err,rows){
            if (err) {
              callback(err);
            }
            else {
              // console.log(err,rows);
              conn.query(
                `SELECT id, text, createdAt, updatedAt, userId, postId, parentId 
                    FROM comments WHERE id = ?`, [rows.insertId],
                function(err,result){
                  if (err) {
                    callback(err);
                  }
                  else {
                    // handleResults(result);
                    callback(null, result[0]);
                  }
                }
              );
            }
          }
        );
      },
      getAllPosts: function(options, callback) {
        // In case we are called without an options parameter, shift all the parameters manually
        if (!callback) {
          callback = options;
          options = {};
        }
        var limit = options.numPerPage || 25; // if options.numPerPage is "falsy" then use 25
        var offset = (options.page || 0) * limit;

        conn.query(`
          SELECT 
          posts.id as postsId, 
          posts.title as postsTitle, 
          posts.url as postsUrl,
          posts.createdAt as postCreatedAt, 
          posts.updatedAt as postUpdatedAt,
          posts.subredditId as postSubredditId,
          users.id as userId,
          users.username as usersUsername,
          users.createdAt as userCreatedAt,
          users.updatedAt as userUpdatedAt,
          
          s.id as sId,
          s.name as sName,
          s.createdAt as sCreatedAt,
          s.updatedAt as sUpdatedAt
          
          FROM posts 
            LEFT JOIN users ON users.id=posts.userId
            LEFT JOIN subreddits s ON posts.subredditId = s.id
          ORDER BY posts.createdAt DESC
          LIMIT ? OFFSET ?`, [limit, offset],
          function(err, results) {
            if (err) {
              callback(err);
            }
            else {
              var mappedResults = results.map(function(res) {

                return {
                  id: res.postsId,
                  title: res.postsTitle,
                  url: res.postsUrl,
                  createdAt: res.postCreatedAt,
                  updatedAt: res.postUpdatedAt,
                  user: {
                    id: res.userId,
                    username: res.usersUsername,
                    createdAt: res.userCreatedAt,
                    updatedAt: res.userUpdatedAt
                  },
                  subreddit:{
                    id: res.sId,
                    name: res.sName,
                    createdAt: res.sCreatedAt,
                    updatedAt: res.sUpdatedAt
                  }
                };
              });
              callback(null, mappedResults);
            }
          }
        );
      },
      getAllPostsFromUser: function(userId, options, callback) {
        // In case we are called without an options parameter, shift all the parameters manually
        if (!callback) {
          callback = options;
          options = {};
        }
        var limit = options.numPerPage || 25; // if options.numPerPage is "falsy" then use 25
        var offset = (options.page || 0) * limit;

        conn.query(`
          SELECT 
          posts.id as postsId,
          posts.userId as postsUserId, 
          posts.title as postsTitle, 
          posts.url as postsUrl,
          posts.createdAt as postCreatedAt, 
          posts.updatedAt as postUpdatedAt,
          users.id as userId,
          users.username as usersUsername,
          users.createdAt as userCreatedAt,
          users.updatedAt as userUpdatedAt
        
          FROM posts 
            LEFT JOIN users ON users.id=posts.userId
          
          WHERE posts.userId = ?
          ORDER BY posts.createdAt DESC
          LIMIT ? OFFSET ?`, [userId, limit, offset],
          function(err, results) {
            if (err) {
              callback(err);
            }
            else {
              var mappedResults = results.map(function(res) {

                return {
                  id: res.postsId,
                  title: res.postsTitle,
                  url: res.postsUrl,
                  createdAt: res.postCreatedAt,
                  updatedAt: res.postUpdatedAt,
                  userId: res.postUserId,
                  user: {
                    id: res.userId,
                    username: res.usersUsername,
                    createdAt: res.userCreatedAt,
                    updatedAt: res.userUpdatedAt
                  }
                }
              })
              callback(null, mappedResults);
            };
          }
        );
      },
      getSinglePost: function(postId, callback) {
        // In case we are called without an options parameter, shift all the parameters manually
        if (!callback) {}

        conn.query(`
          SELECT p.id, p.title, p.url, p.userId, p.createdAt, p.updatedAt
          FROM posts as p WHERE p.id = ?`, [postId],
          function(err, results) {
            if (err) {
              callback(err);
            }
            else {
              callback(null, results[0]);
            }
          }
        );
      },
      getAllSubreddits: function(callback){
        var query = `SELECT id, name, description, createdAt, updatedAt FROM subreddits ORDER BY  createdAt DESC`;
        conn.query(query, function(err, subs){
          callback(err, subs);
        }
        );
      },
      getCommentsForPost: function(postId, callback) {
        // // In case we are called without an options parameter, shift all the parameters manually
        //   if (!callback) {
        //     callback = options;
        //     options = {};
        //   }
        //   var limit = options.numPerPage || 25; // if options.numPerPage is "falsy" then use 25
        //   var offset = (options.page || 0) * limit;

        conn.query(`
          SELECT
          c1.id as c1_id, c1.text as c1_text, c1.parentId as c1_parentId,
          c2.id as c2_Id, c2.text as c2_text, c2.parentId as c2_parentId,
          c3.id as c3_id, c3.text as c3_text, c3.parentId as c3_parentId
                              
          FROM comments as c1 
            LEFT JOIN comments c2 ON c1.id = c2.parentId
            LEFT JOIN comments c3 ON c2.id = c3.parentId
          
          WHERE c1.postId  = ? AND c1.parentId IS NULL`, [postId],

          function(err, results) {
            if (err) {
              callback(err);
            }
            else {
              callback(null, results);
            }
          }
        );
      },
  }
}
