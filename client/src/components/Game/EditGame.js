import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './styles.css';

const EditGame = ({ token, game, onGameUpdated }) => {
    let history = useHistory();
    const [gameData, setGameData] = useState({
        title: game.title,
        platform: game.platform,
        developer: game.developer,
        genre: game.genre,
        rating: game.rating,
        prodYear: game.prodYear,
        comment: game.comment
    });
    const { title, platform, developer, genre, rating, prodYear, comment } = gameData;

    const onChange = e => {
        const { name, value } = e.target;

        setGameData({
            ...gameData,
            [name]: value
        });
    };

    const update = async () => {
        if (!title || !comment) {
            console.log('Title, platform, developer, genre, rating, and year produced are required');
        } else {
            const newGame = {
                title: title,
                platform: platform,
                developer: developer,
                genre: genre,
                rating: rating,
                prodYear: prodYear,
                comment: comment
            };

            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    }
                };

                // Create the game
                const body = JSON.stringify(newGame);
                const res = await axios.put(
                    `http://localhost:5000/api/games/${game._id}`,
                    body,
                    config
                );

                // Call the handler and redirect
                onGameUpdated(res.data);
                history.push('/');
            } catch (error) {
                console.error(`Error updating game: ${error.response.data}`);
            }
        }
    };

    /* jshint ignore:start */
    return (
        <div className="form-container">
            <h2>Edit Game</h2>
            <input
                name='title'
                type='text'
                placeholder='Title'
                value={title}
                onChange={e => onChange(e)}
            />
            <input
                name='platform'
                type='text'
                placeholder='Platform'
                value={platform}
                onChange={e => onChange(e)}
            />
            <input
                name='developer'
                type='text'
                placeholder='Developer'
                value={developer}
                onChange={e => onChange(e)}
            />
            <input
                name='genre'
                type='text'
                placeholder='Genre'
                value={genre}
                onChange={e => onChange(e)}
            />
            <input
                name='rating'
                type='text'
                placeholder='Rating'
                value={rating}
                onChange={e => onChange(e)}
            />
            <input
                name='prodYear'
                type='text'
                placeholder='Production Year'
                value={prodYear}
                onChange={e => onChange(e)}
            />
            <textarea
                name="comment"
                cols="30"
                rows="10"
                value={comment}
                onChange={e => onChange(e)}
            ></textarea>
            <button onClick={() => update()}>Submit</button>
        </div>
    );
    /* jshint ignore:end */
};

export default EditGame;