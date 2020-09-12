const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const posts = {};

const handleEvent = (type, data) => {
  switch (type) {
    case 'PostCreated': {
      const { id, title } = data;
      posts[id] = {
        id,
        title,
        comments: [],
      };
      break;
    }
    case 'CommentCreated': {
      const { id, postId, content, status } = data;
      const post = posts[postId];
      post.comments.push({ id, content, status });
      break;
    }
    case 'CommentUpdated': {
      const { id, postId, content, status } = data;
      const post = posts[postId];
      const comment = post.comments.find((comment) => id === comment.id);
      Object.assign(comment, { content, status });
      break;
    }
  }
};

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  console.log('Recieved Event', type);
  handleEvent(type, data);
  res.end();
});

app.listen(4002, async () => {
  console.log('Listening on 4002');
  try {
    const { data: events } = await axios.get('http://event-bus-srv:4005/events');
    events.forEach(({ type, data }) => {
      handleEvent(type, data);
    });
  } catch {}
});
