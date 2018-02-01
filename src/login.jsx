import React,{Component} from 'react';
import { render } from 'react-dom';
import { Input, Icon,Row,Col,Button } from 'antd';
import { BrowserRouter as Router, Route, Switch ,Link} from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import Index from './store/index';
// import Login from './component/login';
import RouterShow from './component/index';
import List from './container/List';
import './less/login.less'; 

import axios from 'axios';


export default class  App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        userName: '',
        password: '',
        iconLoading: false,
      };
    }
    emitEmpty = () => {
      this.userNameInput.focus();
      this.setState({ userName: ''});
    }
    emitEmptyPassword = () => {
      this.passwordInput.focus();
      this.setState({ password: ''});
    }
    onChangeUserName = (e) => {
      this.setState({ userName: e.target.value });
    }
    onChangePassword = (e) => {
      this.setState({ password: e.target.value });
    }
    buttonClick = () => {
      var _this = this;
      this.setState({ iconLoading: true });
      const postData = {
          userName: this.state.userName, 
          password: this.state.password
      };
      axios.post('/api/login',postData)
      .then(function(res){
          if(res.status){
              location.reload();
          }
      })
      .catch(function(err){
          console.log(err);
      });
    }
    render() {
      const  userName  = this.state.userName;
      const  password  = this.state.password;
      const suffixUserName = userName ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
      const suffixPassword = password ? <Icon type="close-circle" onClick={this.emitEmptyPassword} /> : null;
      console.log(this)
      return (
          <div>
              <div  className="login-left">
                  <div className="login-middle">
                      <section>
                          <img className="img_login_logo" src={require('../images/login_logo.png')} alt="图片"/>
                          <Input
                                  placeholder="请输入用户名"
                                  size="large"
                                  prefix={<Icon type="user" style={{ divor: 'rgba(0,0,0,.25)' }} />}
                                  suffix={suffixUserName}
                                  value={userName}
                                  onChange={this.onChangeUserName}
                                  ref={node => this.userNameInput = node}
                          />
                      </section>
                      <section>
                          <Input
                                  placeholder="请输入密码"
                                  size="large"
                                  prefix={<Icon type="lock" style={{ divor: 'rgba(0,0,0,.25)' }} />}
                                  suffix={suffixPassword}
                                  value={password}
                                  onChange={this.onChangePassword}
                                  ref={node => this.passwordInput = node}
                          />
                      </section>
                      <section>
                          <Button className="button_set" size="large" 
                          type="primary" icon="loading-3-quarters" 
                          loading={this.state.iconLoading} onClick={this.buttonClick}>
                              登录
                          </Button>
                      </section>
                  </div>
              </div>
              <div className="login_right">
                  <img className="login_bg" src={require('../images/login_bg.png')} alt="图片"/>
                  <img className="login_image_car" src={require('../images/login_image_car.png')} alt="图片"/>
              </div>
          </div>
      );
    }
}

render(
    <AppContainer>
        <App/>
    </AppContainer>,
    document.querySelector('#rootLogin'),
);

if (module.hot) {
    module.hot.accept()
}
