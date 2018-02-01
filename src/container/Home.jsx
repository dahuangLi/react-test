import React, { Component } from 'react';
import CardWrap from './CardWrap';
import '../less/body'

export default class Body extends Component {
    constructor(props){
        super(props);
    }
    render() {
        let cards= [
            {
                imgSrc: require('../images/matthew.png'),
                name: '周雪',
                meta: 'Coworker',
                desc: '1111111111111111111111111',
                joined: 2014,
                linkNum: 100
            },
            {
                imgSrc: require('../images/molly.png'),
                name: '俞艳',
                meta: 'Coworker',
                desc: '222222222222222222222222222',
                joined: 2015,
                linkNum: 90
            },
            {
                imgSrc: require('../../images/elyse.png'),
                name: '吴薇',
                meta: 'Coworker',
                desc: '333333333333333333333333333333',
                joined: 2017,
                linkNum: 200
            },
            {
                imgSrc: require('../images/matthew.png'),
                name: '祁慧',
                meta: 'Coworker',
                desc: '44444444444444444444444444444444',
                joined: 2016,
                linkNum: 98
            }
        ];
        return (
            <section className="home">
                <CardWrap cards={ cards }/>
            </section>
        );
    }
}
