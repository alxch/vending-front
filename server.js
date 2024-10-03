// testing server for API
const express = require("express");
const app = express();
const port = 8080;

app.use(express.text());
app.use((req, res, next)=>{
  console.log((new Date()).toISOString(), '\n', req.method, typeof req.body == 'string' && JSON.parse(req.body), req.params);
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})

const max_attempts = 2;
let attempts = max_attempts;
const send = (data, res) => {
  if(attempts > 0){
    attempts--;
    data = {status:'processing'};
  }
  else {
    attempts = max_attempts;
  }
  res.send(JSON.stringify(data));
}

app.post('/cancel', async (req, res) => {
  attempts = max_attempts;
});

app.post('/select-item', async (req, res) => {
  send({
    status: 'done'
  },res);
});

app.get('/payment-links', async (req, res) => {
  send({
    status: 'done', 
    payme: 'https://payme.uz/home/main',
    click: 'https://click.uz/ru',
    uzum: 'https://uzumbank.uz/en'
  },res);
});

app.get('/payment-status', async (req, res) => {
  send({
    status: 'done',
    method: 'payme'
  },res);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
