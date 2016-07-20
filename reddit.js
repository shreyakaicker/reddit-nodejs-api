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
            'INSERT INTO users (username,password, createdAt) VALUES (?, ?, ?)', [user.username, hashedPassword, new Date()],
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
        'INSERT INTO posts (userId, title, url, createdAt) VALUES (?, ?, ?, ?)', [post.userId, post.title, post.url, new Date()],
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
              'SELECT id,title,url,userId, createdAt, updatedAt FROM posts WHERE id = ?', [result.insertId],
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
        id, 
        title, 
        url, 
        userId as postUserId,
        createdAt as postCreatedAt, 
        updatedAt as postUpdatedAt,
        users.id as userId,
        username,
        users.createdAt as userCreatedAt,
        users.updatedAt as userUpdatedAt
        FROM posts 
          JOIN users ON users.id=posts.userId
        ORDER BY posts.createdAt DESC
        LIMIT ? OFFSET ?`, [limit, offset], 
        function(err, results) {
          if (err) {
            callback(err);
          }
          else {
            var mappedResults = results.map(function(res){

              return{
                id: res.id,
                title: res.title,
                url: res.url,
                createdAt: res.postCreatedAt,
                updatedAt: res.postUpdatedAt,
                userId: res.postUserId,
                user: {
                  id: res.userId,
                  username: res.username,
                  createdAt: res.userCreatedAt,
                  updatedAt: res.userUpdatedAt
                }
              }
            })
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
        id, 
        title, 
        url, 
        userId as postUserId,
        createdAt as postCreatedAt, 
        updatedAt as postUpdatedAt,
        users.id as userId,
        username,
        users.createdAt as userCreatedAt,
        users.updatedAt as userUpdatedAt
        FROM posts 
          JOIN users ON users.id=posts.userId
        WHERE p.userId  = ?
        ORDER BY posts.createdAt DESC
        LIMIT ? OFFSET ?`[userId, limit, offset], 
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
    getSinglePost: function(postId, callback) {
      // In case we are called without an options parameter, shift all the parameters manually
      if (!callback) {
      }
      
      conn.query(`
        SELECT p.id, p.title, p.url, p.userId, p.createdAt, p.updatedAt
        FROM posts as p WHERE p.id = ?`,
        [postId], 
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
    }
    ///
  }
}





