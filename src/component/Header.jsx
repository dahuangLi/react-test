import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import '../less/header'

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message:''
        };
        this.headerClick=this.headerClick.bind(this);
    }
    headerClick(ev){
        console.log(ev.target.getAttribute("data-abc"));
    };
    render() {
        return (
            <header className="header" style={{ color: '#690' }}>
                <h1 onClick={this.headerClick} data-abc="90">{this.props.message}</h1>
                <ul>
                    <li><NavLink to="/" exact activeClassName="selected">Home</NavLink></li>
                    <li><NavLink to="/about/666" activeClassName="selected">About</NavLink></li>
                    <li><NavLink to="/list" activeClassName="selected">List</NavLink></li>
                </ul>
            </header>
        );
    }
}