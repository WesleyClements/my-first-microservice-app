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

  comments.push({ id, content, status: 'pending' });

  commentByPostId[req.params.id] = comments;

  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: {
      id,
      content,
      status: 'pending',
      postId: req.params.id,
    },
  });

  res.status(201).send(comments);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  console.log('Recieved Event', type);
  switch (type) {
    case 'CommentModerated': {
      console.log(data);
      const { id, status, postId } = data;
      const comments = commentByPostId[postId];
      const comment = comments.find((comment) => id === comment.id);
      comment.status = status;
      return res.end(
        async () =>
          await axios.post('http://event-bus-srv:4005/events', { type: 'CommentUpdated', data: { ...comment, postId } })
      );
    }
  }
  res.end();
});

app.listen(4001, async () => {
  console.log('Listening on 4001');

  try {
    const { data: events } = await axios.get('http://event-bus-srv:4005/events');
    events.forEach(async ({ type, data }) => {
      switch (type) {
        case 'CommentCreated': {
          const { id, content, status, postId } = data;
          const comments = commentByPostId[postId] || [];
          comments.push({ id, content, status });
          commentByPostId[postId] = comments;
          break;
        }
        case 'CommentModerated': {
          const { id, status, postId } = data;
          const comments = commentByPostId[postId];
          const comment = comments.find((comment) => id === comment.id);
          comment.status = status;
          await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: { ...comment, postId },
          });
          break;
        }
      }
    });
  } catch {}
});
