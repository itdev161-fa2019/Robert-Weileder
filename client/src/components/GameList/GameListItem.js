import React from 'react';
import { useHistory } from 'react-router-dom';
import slugify from 'slugify';
import './styles.css';

const GameListItem = props => {
    const { game, clickGame, deleteGame, editGame } = props;
    const history = useHistory();

    const handleClickGame = game => {
        const slug = slugify(game.title, { lower: true });

        clickGame(game);
        history.push(`/games/${slug}`);
    };

    const handleEditGame = game => {
        editGame(game);
        history.push(`/edit-game/${game._id}`);
    };

    /* jshint ignore:start */
    return (
        <div>
            <div className="gameListItem" onClick={() => handleClickGame(game)}>
              <h2>{game.title}</h2>
              <p>{game.platform}</p>
              <p>{game.developer}</p>
              <p>{game.genre}</p>
              <p>{game.rating}</p>
              <p>{game.prodYear}</p>
              <p>{game.comment}</p>
            </div>
            <div className="gameControls">
              <button onClick={() => deleteGame(game)}>Delete</button>
              <button onClick={() => handleEditGame(game)}>Edit</button>
            </div>
        </div>
    );
    /* jshint ignore:end */
    
};

export default GameListItem;