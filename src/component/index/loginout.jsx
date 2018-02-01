import React, {Component} from 'react';
import {  Modal,Icon } from 'antd';
import axios from 'axios';
import '../../less/hello.css'

export default class LoginOut extends Component {
    state = { visible: false }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        console.log(e);

        axios.post('/api/loginOut',{})
            .then(function(res){
                console.log(res)
                if(res.data.status == "SUCCEED"){
                    location.reload();
                }
            })
            .catch(function(err){
                console.log(err);
            });
    }
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    render() {
        return (
            <div>
                <span onClick={this.showModal}
                              className="spanCtr"><Icon type="edit"
                                                        style={{ fontSize: 16, color: '#dd0721' }}
                        />退出
                </span>
                &nbsp;&nbsp;&nbsp;|
                <Modal
                    title="退出"
                    visible={this.state.visible}
                    okText={'确定'}
                    cancelText={'取消'}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <h3>确定退出当前帐号吗?</h3>
                </Modal>
            </div>
        );
    }
}