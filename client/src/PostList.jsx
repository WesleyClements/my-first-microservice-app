import React, { useState, useEffect } from 'react';
import axios from 'axios';

import CommentList from './CommentList';
import CommentCreate from './CommentCreate';

export default () => {
  const [posts, setPosts] = useState({});

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {Object.values(posts).map((post) => (
        <div className="card" style={{ width: '30%', marginBottom: '20px' }} key={post.id}>
          <div className="card-body">
            <h3>{post.title}</h3>
            <CommentList comments={post.comments} />
            <CommentCreate postId={post.id} />
          </div>
        </div>
      ))}
    </div>
  );
};
