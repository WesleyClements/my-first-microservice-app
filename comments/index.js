const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');

const commentByPostId = {};

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentByPostId[req.params.id] || []);
});
app.post('/posts/:id/comments', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentByPostId[req.params.id] || [];

  comments.push({ id, content });

  commentByPostId[req.params.id] = comments;

  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      id,
      content,
      postId: req.params.id,
    },
  });

  res.status(201).send(comments);
});

app.post('/events', (req, res) => {
  const { type } = req.body;
  console.log('Recieved Event', type);
  res.end();
});

app.listen(4001, () => {
  console.log('Listening on 4001');
});
