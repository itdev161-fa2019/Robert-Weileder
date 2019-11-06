import React from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

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