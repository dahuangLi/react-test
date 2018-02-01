import React, {Component} from 'react';
import Card from '../component/Card';

export default class CardWrap extends Component{
    constructor(props){
        super(props);
        this.state = {

        };
    }
    render() {
        let cards=this.props.cards.map((value,index)=>{
            return (<Card {...value} key={index} />)
        });
        return (
            <div>
                {cards }
            </div>
        );
    }
}
