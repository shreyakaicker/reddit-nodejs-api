var express = require('express');
var app = express();

app.get('/hello', function (req, res) {
  res.send("<h1>Hello World!</h1>") 
});


app.get('/hello/?name=firstName', function (req, res) {
  
  var name = req.query.name;
  
res.send("<h1>Hello_${req.query.name}_!</h1>")



}  
  )
;


/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});