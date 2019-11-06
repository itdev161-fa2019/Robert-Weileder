import React from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class App extends React.Component {
  state = {
    data: null
  }

  componentDidMount() {
    axios.get('http://localhost:5000')
      .then((response) => {
        this.setState({
          data: response.data
        })
      })
      .catch((error) => {
        console.error(`Error fetching data: ${error}`);
      })
  }

  render() {
    return (
        <Router>
            <div classname="App">
                <header classname="App-header">
                    <h1>GoodThings</h1>
                    <ul>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                    </ul>
                </header>
                <main>
                    <Route exact path="/">
                        {this.state.local}
                    </Route>
                    <Switch>
                        <Route path="/register">
                            Register
                        </Route>
                        <Route path="/login">
                            Login
                        </Route>
                    </Switch>
                </main>
            </div>
        </Router>
    )
}
}

export default App;
