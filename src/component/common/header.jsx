import React, {Component} from 'react';
import {Row,Col} from  'antd';
import './common.less';

export default class ContentHeader extends Component{
    render(){
        return (
            <Row className="contentHeader">
                <Col span={12}>
                    <span className="bottomLine">{this.props.mainMenu}</span>
                </Col>
                <Col span={12} className="contentHeaderCtr">
                    {this.props.childMenu}
                </Col>
            </Row>
        )
    }
};
