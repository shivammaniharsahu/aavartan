const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;


// if (process.env.NODE_ENV === 'production'){
//     app.use(express.static(path.join(__dirname, '/build')));

//     app.get('*', (req, res)=>{
//         res.sendFile(path.join(__dirname + '/build/index.html'));
//     });
// }


// console.log that your server is up and running
app.listen(port, () => console.log('port',port));

