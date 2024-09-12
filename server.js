// testing server for API
const express = require("express");
// const cors = require('cors');
const app = express();
const port = 8080;

app.use(express.json());
// app.use(cors());
app.use((req, res, next)=>{
  console.log('Request:', req.method, JSON.stringify(req.body));
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  next();
})

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

app.post('/', async (req, res) => {
  await new Promise(resolve=>setTimeout(resolve,1000));
  res.send(req.body); // echo
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});