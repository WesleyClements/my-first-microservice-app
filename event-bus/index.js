const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.post('/events', async (req, res) => {
  const event = req.body;
  try {
    await Promise.all([
      axios.post('http://localhost:4000/events', event),
      axios.post('http://localhost:4001/events', event),
      axios.post('http://localhost:4002/events', event),
      axios.post('http://localhost:4003/events', event),
    ]);
    res.send({ status: 'OK' });
  } catch (error) {
    console.error(error);
    res.end();
  }
});

app.listen(4005, () => {
  console.log('Listening on 4005');
});
