import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch ,NavLink} from 'react-router-dom';
import ModuleManagement from './ModuleManagement';
import axios from 'axios';
import EditPassword from './index/editPassword';
import RealTimeConfigMaintenance from  './infoConfig/retimeConfig';
import CondictionConfigMaintenance from './infoConfig/condictionConfig'
import LoginOut from './index/loginout';
import '../less/hello.css';


import { Menu, Icon ,Row,Col,Layout ,Modal, Button,Input} from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;



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
        console.log(this)
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
                  <img style={{height:83}} src={require('../../images/common_jmcLogo.png')} alt="图片"/></Col>
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
                  <Route exact path="/realTimeConfigMaintenance" component={RealTimeConfigMaintenance} />
                  <Route exact path="/markConfig"><RealTimeConfigMaintenance name = "99999"/></Route>
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

