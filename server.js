// testing server for API
const express = require("express");
const app = express();
const port = 8080;

app.use(express.text());
app.use((req, res, next)=>{
  console.log((new Date()).toISOString(), req.method, JSON.stringify(req.body));
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})

app.post('/select-item', async (req, res) => {
  await new Promise(resolve=>setTimeout(resolve,1000));
  res.send(JSON.stringify({status:1}));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});