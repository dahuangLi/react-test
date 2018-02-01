import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message:''
        };
    }
    render() {
        return (
            <Router>
                <div>
                    <h1>Im Index!!</h1>
                </div>
            </Router>
        );
    }
}

