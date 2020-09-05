const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  console.log('Recieved Event', type);
  switch (type) {
    case 'CommentCreated': {
      const { id, content, postId } = data;
      const status = !/orange/i.test(content) ? 'approved' : 'rejected';

      return res.end(
        async () =>
          await axios.post('http://localhost:4005/events', {
            type: 'CommentModerated',
            data: { id, content, status, postId },
          })
      );
    }
  }
  res.end();
});

app.listen(4003, () => {
  console.log('Listening on 4003');
});
