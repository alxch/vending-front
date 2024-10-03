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
const getData = (data) => {
  if(attempts > 0){
    attempts--;
    return {status:'processing'};
  }
  else {
    attempts = max_attempts;
    return data;
  }
}

app.post('/select-item', async (req, res) => {
  const data = getData({
    status: 'done'
  });
  res.send(JSON.stringify(data));
});

app.get('/payment-links', async (req, res) => {
  const data = getData({
    status: 'done', 
    payme: 'https://payme.uz/home/main',
    click: 'https://click.uz/ru',
    uzum: 'https://uzumbank.uz/en'
  });
  res.send(JSON.stringify(data));
});

app.get('/payment-status', async (req, res) => {
  const data = getData({
    status: 'done',
    mathod: 'payme'
  });
  res.send(JSON.stringify(data));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});