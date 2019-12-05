import React from 'react';

const Post = props => {
    const { post } = props;

    /* jshint ignore:start */
    return (
      <div>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
      </div>
    )
    /* jshint ignore:end */
};

export default Post;