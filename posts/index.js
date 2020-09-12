const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');

const posts = {};

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/posts', (req, res) => {
  res.send(posts);
});
app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };

  await axios.post('http://event-bus-srv:4005/events', { type: 'PostCreated', data: posts[id] });

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  const { type } = req.body;
  console.log('Recieved Event', type);
  res.end();
});

app.listen(4000, async () => {
  console.log('Listening on 4000');

  try {
    const { data: events } = await axios.get('http://event-bus-srv:4005/events');
    events.forEach(({ type, data }) => {
      switch (type) {
        case 'PostCreated': {
          const { id, title } = data;
          posts[id] = { id, title };
          break;
        }
      }
    });
  } catch {}
});
