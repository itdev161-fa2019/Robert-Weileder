import React from 'react';

const Game = props => {
    const { game } = props;

    /* jshint ignore:start */
    return (
      <div>
          <h1>{game.title}</h1>
          <p>{game.platform}</p>
          <p>{game.developer}</p>
          <p>{game.genre}</p>
          <p>{game.rating}</p>
          <p>{game.prodYear}</p>
          <p>{game.comment}</p>
      </div>

    )
    /* jshint ignore:end */
};

export default Game;