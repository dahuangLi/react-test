import React, {Component} from 'react';
import PropTypes from 'prop-types';

let propTypes={
    name: PropTypes.string.isRequired,
    imgSrc: PropTypes.string,
    linkNum: PropTypes.number,
    joined: PropTypes.number,
};

export default class Card extends Component{
    constructor(props){
        super(props);
        this.state = {

        };
    }
    render(){
        let { name,imgSrc, meta, desc, joined, linkNum } = this.props;
        return (
            <section className="card">
                <div className="images">
                    <img src={imgSrc} />
                </div>
                <div className="content">
                    <div className="header">{name}</div>
                    <div className="meta">
                        <span>{meta}</span>
                    </div>
                    <div className="description"></div>
                </div>
            </section>
        )
    }
}


Card.propTypes = propTypes;





