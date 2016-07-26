var express = require('express');
var app = express();

var mysql = require("mysql");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'shreyakaicker', // CHANGE THIS :)
  password : '',
  database: 'reddit'
});

// load our API and pass it the connection
var reddit = require('./new_reddit.js');
var redditAPI = reddit(connection);

var express = require('express')
var bodyParser = require('body-parser')

var app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/hello', function (req, res) {
 res.send(`<h1>Hello World!</h1>`);
});



app.get('/hello/firstName', function (req, res) {
 res.send(`<h1>Hello ${req.query.name}!</h1>`);
});

app.get('/calculator/:operation', function(req, res) {
 
 var oper = req.params.operation;
 var num1= parseInt(req.query.num1);
 var num2= parseInt(req.query.num2);
 
 var solution;
 
 if( oper === 'add'  ){
 solution = num1 + num2;
 }
 

 else if( oper === 'sub'  ){
 solution = num1 - num2;
 }
 
 else if( oper === 'mult'  ){  
solution = num1 * num2;
 }
 
 else if( oper === 'div'  ){
 solution = num1 / num2;
 }
 
 
 else {
 res.status(400).send('Enter operation');
 }
 
 res.send({ 
  Operator : oper,
  firstOperand : num1,
  secondOperand: num2,
  Solution: solution
  
 });
 
 
 
  

 
 
});


app.get('/posts', function(req, res) {
    redditAPI.getPostsFive(function (err, result) {
      
      if (err) { 
        res.status(500).send(err);
      }
      
      else {
      console.log(result);
      // res.send(result)
      
      res.send(` 
        <div id="contents">
  <h1>List of contents</h1>
  <ul class="contents-list">
    <li class="content-item">
      <h2 class="content-item__title">
        <a href=${result[0].url}>${result[0].title}</a>
      </h2>
      <p>Created by ${result[0].username} </p>
    </li>
    <li class="content-item">
      <h2 class="content-item__title">
        <a href=${result[1].url}>${result[1].title}</a>
      </h2>
      <p>Created by ${result[1].username} </p>
    </li>
    <li class="content-item">
      <h2 class="content-item__title">
        <a href=${result[2].url}>${result[2].title}</a>
      </h2>
      <p>Created by ${result[2].username} </p>
    </li>
    <li class="content-item">
      <h2 class="content-item__title">
        <a href=${result[3].url}>${result[3].title}</a>
      </h2>
      <p>Created by ${result[3].username} </p>
    </li>
     <li class="content-item">
      <h2 class="content-item__title">
        <a href=${result[4].url}>${result[4].title}</a>
      </h2>
      <p>Created by ${result[4].username} </p>
    </li>
    
  </ul>
</div>`);
    }
    
    }
    );
  });
  
app.get(`/createContent`, function (req, res) {

res.send(`
<form action="/createContent" method="POST"> 
  <div>
    <input type="text" name="url" placeholder="Enter a URL to content">
  </div>
  <div>
    <input type="text" name="title" placeholder="Enter the title of your content">
  </div>
  <button type="submit">Create!</button>
</form>
`);


});


app.post('/createContent', function (req, res ) {

redditAPI.createPost( {
 title: req.body.title,
 url : req.body.url,
 userId: 1
}, function(err, post){
  res.send(post)
});
 
});












/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :slightly_smiling_face: */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
 var host = server.address().address;
 var port = server.address().port;

 console.log('Example app listening at http://%s:%s', host, port);
});