import React, { useState } from 'react';
import axios from 'axios';

export default ({ postId }) => {
  const [content, setContent] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/posts/${postId}/comments`, { content });
      setContent('');
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>New Content</label>
          <input type="text" className="form-control" value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};
