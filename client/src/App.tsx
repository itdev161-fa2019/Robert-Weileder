import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import GameList from './components/GameList/GameList';
import Game from './components/Game/Game';
import CreateGame from './components/Game/CreateGame';
import EditGame from './components/Game/EditGame';

class App extends React.Component {
  state = {
    games: [],
    game: null,
    token: null,
    user: null
  };

  componentDidMount() {
      this.authenticateUser();
  };

  authenticateUser = () => {
    const token = localStorage.getItem('token');

    if(!token) {
      localStorage.removeItem('user')
      this.setState({ user: null });
    }

    
    if (token) {
      const config = {
        headers: {
          'x-auth-token': token
        }
      }
      axios.get('http://localhost:5000/api/auth', config)
        .then((response) => {
          localStorage.setItem('user', response.data.name)
          this.setState(
            {
              user: response.data.name,
              token: token
            },
            () => {
              this.loadData();
            }
          );
        })
        .catch((error) => {
          localStorage.removeItem('user');
          this.setState({ user: null });
          console.error(`Error logging in: ${error}`);
        })
    }
  };

  loadData = () => {
    const  { token } = this.state;

    if (token) {
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      axios
        .get('http://localhost:5000/api/games', config)
        .then(response => {
          this.setState({
            games: response.data
          });
        })
        .catch(error => {
          console.error(`Error fetching data: ${error}`);
        });
    }
  };

  logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({ user: null, token: null });
  };

  viewGame = game => {
    console.log(`view ${game.title}`);
    this.setState({
      game: game
    });
  };

  deleteGame = game => {
    const { token } = this.state;

    if (token) {
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      axios
        .delete(`http://localhost:5000/api/games/${game._id}`, config)
        .then(response => {
          const newGames = this.state.games.filter(g => g._id !== game._id);
          this.setState({
            games: [...newGames]
          });
        })
        .catch(error => {
          console.error(`Error deleting game: ${error}`);
        });
    }
  };

  editGame = game => {
    this.setState({
      game: game
    });
  };

  onGameCreated = game => {
    const newGames = [...this.state.games, game];

    this.setState({
      Games: newGames
    });
  };

  onGameUpdated = game => {
    console.log('updated game: ', game);
    const newGames = [...this.state.games];
    const index = newGames.findIndex(g => g._id === game._id);

    newGames[index] = game;

    this.setState({
      games: newGames
    });
  };

  render() {
    let { user, games, game, token } = this.state;
    const authProps = {
      authenticateUser: this.authenticateUser
    }

    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1>Video Game Reviews</h1>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                          {user ? (
                            <Link to="/new-game">New Game</Link>
                          ) : (
                            <Link to="/register">Register</Link>
                          )}
                        </li>
                        <li>
                          {user ? (
                            <Link to="" onClick={this.logOut}>
                              Log out
                            </Link>
                          ) : (
                            <Link to="/login">Log in</Link>
                          )}
                        </li>
                    </ul>
                </header>
                <main>
                  <Switch>
                    <Route exact path="/">
                      {user ? (
                      <React.Fragment>
                        <div>Hello {user}!</div>
                        <GameList 
                          games={games}
                          clickGame={this.viewGame}
                          deleteGame={this.deleteGame}
                          editGame={this.editGame}
                        />
                      </React.Fragment> 
                    ) : (
                      <React.Fragment>Please Register or Login</React.Fragment>
                    )}
                    </Route>
                    <Route path="/games/:gameId">
                      <Game game={game} />
                    </Route>
                    <Route path="/new-game">
                      <CreateGame token={token} onGameCreated={this.onGameCreated} />
                    </Route>
                    <Route path="/edit-game/:gameId">
                      <EditGame 
                        token={token} 
                        game={game} 
                        onGameUpdated={this.onGameUpdated} 
                      />
                    </Route>
                    <Route 
                      exact
                      path="/register"
                      render={() => <Register {...authProps} />}
                    />
                    <Route
                      exact
                      path="/login"
                      render={() => <Login {...authProps} />}
                    />
                    </Switch>
                </main>
            </div>
        </Router>
    );
};
}

export default App;
