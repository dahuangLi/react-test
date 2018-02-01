import React, {Component} from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch ,NavLink} from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import './less/hello.css';

import ModuleManagement from './component/ModuleManagement';
import RoleManagement from './component/systemManagement/RoleManagement'
import axios from 'axios';
import EditPassword from './component/index/editPassword';
import RealTimeConfigMaintenance from  './component/infoConfig/retimeConfig';
import CondictionConfigMaintenance from './component/infoConfig/condictionConfig'
import LoginOut from './component/index/loginout';
import './less/hello.css';


import { Menu, Icon ,Row,Col,Layout ,Modal, Button,Input} from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;

import { createStore, applyMiddleware, bindActionCreators} from 'redux';
import thunk from 'redux-thunk';
import {Provider, connect} from 'react-redux';
import reducer from './reducer';
import * as actionsCreators from './actions';


const store = createStore(reducer, applyMiddleware(thunk));


export default class Index extends Component {
    constructor(props) {
      super(props);
    }

    state = {
      resArray:[],
      openKeys: [],
      roleName:"",
      visible: false 
    };
    showModal = () => {
      this.setState({
        visible: true,
      });
    }
    handleOk = (e) => {
      this.setState({
        visible: false,
      });
    }
    handleCancel = (e) => {
      this.setState({
        visible: false,
      });
    }
    rootSubmenuKeys = this.state.resArray;
    onOpenChange = (openKeys) => {
      const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.setState({ openKeys : [latestOpenKey] });
      } else {  
        this.setState({
          openKeys: latestOpenKey ? [latestOpenKey] : [],
        });
      }
    }
    render() {
      let {
            A, B,pageButton, addCounter, addIfOdd, asyncAdd, decrement, increment
        } = this.props;
      const resShows = this.state.resArray.map((item,index) => {
          return <SubMenu key={index} title={<span><Icon type="mail" /><span>{item.name}</span></span>}>
                  {
                      item.children.map((child,num) => {
                          return <Menu.Item key={child.url}>
                          <NavLink to={"/" + child.url}>{child.name}</NavLink>    
                          </Menu.Item>;
                      })
                  }
                 </SubMenu>
      });

      return (
        <Router>
          <Layout>
          <Header className = "rowBottomLine">
            <Row>
              <Col span={12}>
                <img style={{height:83}} src={require('../images/common_jmcLogo.png')} alt="图片"/></Col>
              <Col span={12}>
                <Row>
                  <Col span={3} offset={6}>
                    <span className="spanCtr"><Icon type="home" style={{ fontSize: 16, color: '#dd0721' }} />主页</span>
                    &nbsp;&nbsp;&nbsp;|
                  </Col>
                  <Col span={6}>
                    <span className="spanCtr"><Icon type="user" style={{ fontSize: 16, color: '#dd0721' }} />用户名:</span>
                    <span>{this.state.roleName}</span>
                    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                  </Col>
                  <Col span={4}>
                    <EditPassword roleName={this.state.roleName}/>
                  </Col>
                  <Col span={3}>
                      <LoginOut />
                  </Col>
              </Row>
              </Col>
            </Row>
          </Header>
          <Layout>
            <Sider>
                <Menu
                    mode="inline"
                    openKeys={this.state.openKeys}
                    onOpenChange={this.onOpenChange}
                >
                {resShows}
                </Menu>
            </Sider>
            <Content className = "contentLeftLine">
            <Switch>
                <Route exact path="/ModuleManagement" component={ModuleManagement} />
                <Route exact path="/realTimeConfigMaintenance"><RealTimeConfigMaintenance 
                    pathName = "realTimeConfigMaintenance"
                    {...{actions:{addIfOdd, asyncAdd, decrement, increment},addCounter,pageButton}}
                />
                </Route>
                 <Route exact path="/RoleManagement"><RoleManagement 
                                    pathName = "RoleManagement"
                                    {...{actions:{addIfOdd, asyncAdd, decrement, increment},addCounter,pageButton}}
                />
                </Route>
                <Route exact path="/markConfig"><RealTimeConfigMaintenance pathName = "markConfig"/></Route>
                <Route exact path="/ConditionsAcquisitionMaintenance" component={CondictionConfigMaintenance} />
            </Switch>
            </Content>
          </Layout>
          <Footer></Footer>
        </Layout>
        </Router>
      );
    }
    componentWillMount(){
      var _this = this;
      axios.post('/api/getMenus',{})
      .then(function(res){
          _this.setState ({
              resArray : res.data.menus,
              roleName : res.data.roleName
          })
      })
      .catch(function(err){
          console.log(err);
      });
    }
};


Index = connect(
    state => state,
    dispatch => bindActionCreators(actionsCreators, dispatch)
  )(Index);

render(
    <AppContainer>
        <Provider
            store={store}
        >
            <Index />
        </Provider>
    </AppContainer>,
    document.querySelector('#root'),
);

if (module.hot) {
    module.hot.accept()
}
