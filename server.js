const express = require('express')
const app = express()
const port = 3000
const path = require('path');

app.use(express.static('public'))
// // Render Html File
// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname, 'templates/index.html'));
// });


app.listen(port, () => {
  // Code.....
  console.log('Runing server at port: '+port);
})