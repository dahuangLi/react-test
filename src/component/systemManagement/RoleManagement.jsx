import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import  axios from 'axios';
import { Form, Input, Button, Radio ,Row,Col,Table,Pagination ,Divider,Modal,InputNumber,Select,DatePicker } from 'antd';
import ContentHeader from '../common/header'
import './system'

import {AjaxPostFunc} from '../common/ajaxFunc';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Search = Input.Search;
const { TextArea } = Input;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

const RealtimeConfig = Form.create({
    onValuesChange(props, values) {
      props.handleFormChange(values);
    },
  })((props) => {
    const {  onChange, realtimeAddShowModal, form, roleName,btnCtr,dateChange,selectChange } = props;
    const { getFieldDecorator } = form;
    return (
            <Form layout="inline" className="formPadding">
                <Row>
                    <Col span={6}>
                    <FormItem
                            label="角色名"
                            labelCol={{ span: 7 }}
                            wrapperCol={{ span: 17 }}
                        >
                            {getFieldDecorator('selectedName', {
                                rules: [{ required: false, message: '请输入密码!' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label="角色状态"
                            labelCol={{ span: 7 }}
                            wrapperCol={{ span: 17 }}
                        >
                            {getFieldDecorator('userState',{
                                rules: [{ required: false, message: '请输入新密码!' }],
                            })(
                                <Select onChange={selectChange}>
                                    <Select.Option value="0">全部</Select.Option>
                                    <Select.Option value="1">禁用</Select.Option>
                                    <Select.Option value="2">启用</Select.Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={2}>
                        <label className="initLabel">时间范围</label>
                    </Col>
                    <Col span={10}>
                        <RangePicker onChange={dateChange} />
                    </Col>
                </Row>    
                <Row>
                    <Col span={6} push={18}>
                        <Button type="primary" style = {{visibility:btnCtr.btnFind,marginLeft:"44px"}} onClick = {onChange}>查询</Button>
                        <Button type="primary" style = {{visibility:btnCtr.btnCreat,marginLeft:"44px"}} onClick = {realtimeAddShowModal}>新建角色</Button>
                    </Col>
                </Row>
            </Form>
    );  
});


export default class RoleManagement extends Component{
    state = {
        tableListData : [],
        pagination:{
            current:1,
            pageSize:10,
            total:0,
            onChange:function (pageNumber){
                this.handleCreate(pageNumber);
            }.bind(this),
            showTotal:function(total){
                return `共 ${this.state.pagination.total} 条`;
            }.bind(this),
        },
        loading: false,
        paramSignalData:[],
        businessType:1,
        fields:{},
        btnCtr:{
            btnUpdate:"hidden",
            btnRoleInfo:"hidden",
            btnDelete:"hidden",
            btnCreat:"hidden",
            btnFind:"hidden",
            btnOkoff:"hidden",
            btnSetRote:"hidden"
        },
        dateSet:{
            startTime:"",
            endTime:""
        }
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.pathName == "markConfig"){
            this.setState({
                businessType:2
            })
        }
        if (nextProps.pathName != this.props.pathName) { // 判断路由是否变化
            if(nextProps.pathName == "markConfig"){
                this.setState({
                    businessType:2
                })
                this.handleCreate(1,2)
            } else {
                this.setState({
                    businessType:1
                })
                this.handleCreate(1,1)
            }
        }
    }
    //  列表查询
    handleCreate = (pageNumber,businessTypeSet) =>{
        console.log(this)
        
        const _this = this;
        this.setState({ loading: true });
        // 发送请求
        var params = this.state.fields;
        Object.assign(this.state.fields,this.state.dateSet)

        if(!isNaN(pageNumber)){
            params.pageIndex = pageNumber
        } else {
            params.pageIndex = this.state.pagination.current;
        }

        let requestParams = {
            method:"post",
            url:"/api/getRoleManagementData",
            params:params
        }
        console.log(requestParams)
        AjaxPostFunc(requestParams)
        .then(function onFulfilled(data){
            console.log(data)
            _this.setState ({
                tableListData:data.data,
                pagination:{
                    total:data.totalCount,
                    current:data.pageIndex
                }
            })
        }).catch(function onRejected(error){
            console.log(error)
        });
    }
    //  获取表单参数
    handleFormChange = (changedFields) => {
        this.setState({
          fields: { ...this.state.fields, ...changedFields },
        });
      }
    // 删除 启用 禁用 确认
    showConfirm = (title,text,record,num) => {
        var _this = this
        confirm({
          title: title,
          content: text,
          onOk() {
            var params = {
                itemName:record.itemName,
                itemId:record.itemId,
                status:num
            }  
            console.log(params)
            axios.post('/api/updateIssueItemStatus',params)
            .then(function(res){
                if(res.data.status == "SUCCEED"){
                    _this.handleCreate();
                  }
            })
            .catch(function(err){
                console.log(err);
            });
          },
          onCancel() {},
        });
      }
    //  删除 启用 禁用  
    statusFunc = (num,record) => {
        var textInfo,title
        switch (num){
            case 0: textInfo = "确定删除当前配置吗?";title = "删除"; break;
            case 1: textInfo = "确定启用当前配置吗?";title = "启用"; break;
            case 2: textInfo = "确定禁用当前配置吗?";title = "禁用"; break;
        }
        this.showConfirm(title,textInfo,record,num);

    }
    // 详情页面
    detailInfo = (record) => {
        axios.post('/api/getIssueItemDetail',{itemId:record.itemId})
        .then(function(res){

          if(res.data.status == "SUCCEED"){
              const recordReset = res.data.data;
            axios.post('/api/getIssueSignalList',{itemId:record.itemId})
            .then(function(res){
              if(res.data.status == "SUCCEED"){
                for(var i = 0;i<res.data.data.signalList.length;i++){
                    res.data.data.signalList[i].keyIndex = i+1;
                }
                const dataSource = res.data.data.signalList;
                Modal.info({
                    title: '详情',
                    width:800,
                    content: (
                      <div>
                          <Row className = "row_top">
                              <Col span={4}>配置编号:</Col>
                              <Col span={8}>{recordReset.itemNo}</Col>
                              <Col span={4}>配置名称:</Col>
                              <Col span={8}>{recordReset.itemName}</Col>
                          </Row>
                          <Row className = "row_top">
                              <Col span={4}>车型名称:</Col>
                              <Col span={8}>{recordReset.vehicleMode}</Col>
                              <Col span={4}>传输类型:</Col>
                              <Col span={8}>{recordReset.transType}</Col>
                          </Row>
                          <Row className = "row_top">
                              <Col span={4}>采集周期:</Col>
                              <Col span={8}>{recordReset.collectCycle}</Col>
                              <Col span={4}>传输周期:</Col>
                              <Col span={8}>{recordReset.transCycle}</Col>
                          </Row>
                          <Row className = "row_top">
                              <Col span={4}>创建人:</Col>
                              <Col span={8}>{recordReset.creator}</Col>
                              <Col span={4}>创建时间:</Col>
                              <Col span={8}>{recordReset.createTime}</Col>
                          </Row>
                          <Row className = "row_top">
                              <Col  span={4}>更新人:</Col>
                              <Col span={8}>{recordReset.updator}</Col>
                              <Col span={4}>更新时间:</Col>
                              <Col span={8}>{recordReset.updateTime}</Col>
                          </Row>
                          <Row className = "row_top">
                              <Col span={4}>配置编号:</Col>
                              <Col span={20}>{recordReset.remark}</Col>
                          </Row>
                          <Row className = "row_top">
                              <Col span={24}>
                                  <Table 
                                    dataSource={dataSource} 
                                    pagination={false} 
                                    columns={columns} 
                                    size="small" 
                                    scroll={{ y: 140 }}
                                  />
                              </Col>
                          </Row>
                      </div>
                    ),
                    onOk() {},
                });
              }
            })
            .catch(function(err){
                console.log(err);
            });
          }
        })
        .catch(function(err){
            console.log(err);
        });


        const columns = [
            {
                title: '编号',
                dataIndex: 'keyIndex',
                key: 'keyIndex',
                width:50
            },{
                title: '信号ID',
                dataIndex: 'signalId',
                key: 'signalId',
                width:300
            },{
                title: '信号名称',
                dataIndex: 'signalName',
                key: 'signalName',
                width:140
            },{
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
            }
        ]
    }
    realtimeAddShowModal = () =>{
        this.setState({ visible: true });
    }
    saveFormRef = (form) => {
        this.form = form;
    }
    signalListFunc = (backData) =>{
        var _this = this;
        axios.post('/api/getSignalListByVehicleMode',{vehicleMode:backData.name,vehicleModeId:backData.id})
        .then(function(res){
          if(res.data.status == "SUCCEED"){
            for(var i = 0;i<res.data.data.length;i++){
                res.data.data[i].keyIndex = i+1;
            }
            const dataSource = res.data.data
            _this.setState({
                signalListData  : dataSource,
            })
          }
        })
        .catch(function(err){
            console.log(err);
        });
    }
    
    buttonShow = () =>{
        console.log(this)
        let btnCtrArray = Object.keys(this.state.btnCtr);
        let newBtnCtrObj = {};
        for(var i =0;i<this.props.pageButton.length;i++){
            for(var j = 0;j<btnCtrArray.length;j++){
                if(this.props.pageButton[i].url == btnCtrArray[j]){
                    newBtnCtrObj[btnCtrArray[j]] = "visible";
                }
            }
        }
        console.log(Object.assign(this.state.btnCtr,newBtnCtrObj))
        this.setState({
            btnCtr : Object.assign(this.state.btnCtr,newBtnCtrObj)
        })
    }
    dateChange = (date, dateString) =>{
        console.log(dateString)
        this.setState({
            dateSet:{
                startTime:dateString[0] + " 00:00:00",
                endTime:dateString[1] + " 23:59:59",
            }
        })
    }
    selectChange = (value) =>{
        console.log(value)
    }
    render() {
        const fields = this.state.fields;
        const { visible, confirmLoading, ModalText,ModalTitle } = this.state;
        const statusTextDisabled = "禁用",
              statusTextTrue = "启用"
        const columns = [{
            title: '编号',
            dataIndex: 'keyIndex',
          },{
            title: '角色名',
            dataIndex: 'roleName',
          }, {
            title: '描述',
            dataIndex: 'roleDesc',
          }, {
            title: '状态',
            dataIndex: 'roleState',
            render: function(text,record){
                switch (record.roleState){
                    case 0: return "启用";break;
                    case -1: return "禁用";break;
                }
            }
          }, {
            title: '创建人',
            dataIndex: 'creator',
          }, {
            title: '创建时间',
            dataIndex: 'createTime',
          }, {
            title: '更新人',
            dataIndex: 'updator',
          }, {
            title: '更新时间',
            dataIndex: 'updateTime',
          }, {
            title: '操作',
            dataIndex: 'action',
            render: function(text,record){
                var _this = this;
                    return  <div>
                                <span
                                    style = {{ visibility:_this.state.btnCtr.btnOkoff }}
                                    onClick={record.status == 1 ? _this.statusFunc.bind(this,2,record) :　_this.statusFunc.bind(this,1,record)}
                                >
                                { record.status == 1 ? statusTextDisabled : statusTextTrue}
                                </span>
                                <Divider type="vertical" />
                                <span  style = {{visibility:_this.state.btnCtr.btnDelete}} 
                                 onClick={_this.statusFunc.bind(this,0,record)}>删除</span>
                                <Divider type="vertical" />
                                <span  style = {{visibility:_this.state.btnCtr.btnRoleInfo}} 
                                 onClick={_this.detailInfo.bind(this,record)}>详情</span>
                                 <Divider type="vertical" />
                                <span  style = {{visibility:_this.state.btnCtr.btnSetRote}} 
                                 onClick={_this.detailInfo.bind(this,record)}>权限设置</span>
                            </div>
            }.bind(this),
            width:220
          }];

        return (
            <div>
                <ContentHeader mainMenu="系统管理" childMenu='系统管理>>角色维护'/>
                <RealtimeConfig
                    onChange={this.handleCreate}
                    realtimeAddShowModal = {this.realtimeAddShowModal}
                    handleFormChange={this.handleFormChange}
                    btnCtr = {this.state.btnCtr}
                    dateChange = {this.dateChange}
                    selectChange = {this.selectChange}
                />
                <div className="formPadding" >
                    <Table
                        rowKey="id"
                        columns={columns}
                        pagination = {false}
                        dataSource={this.state.tableListData}
                        pagination = {this.state.pagination}
                        bordered
                        size="small"
                        btnCtr = {this.state.btnCtr}
                        scroll={{ x: true }}
                    />
                </div>
            </div>
        )
    }

    // 打开页面 加载列表数据 componentDidMount 
    componentDidMount (){
        var _this = this;
        var params = {};
        console.log(_this)
        this.props.actions.asyncAdd(this.props.pathName);
        let requestParams = {
            method:"post",
            url:"/api/getRoleManagementData",
            params:params
        }
        AjaxPostFunc(requestParams)
        .then(function onFulfilled(data){
            console.log(data)
            if(data.status == "SUCCEED"){
                for(var i = 0;i<data.data.length;i++){
                    data.data[i].keyIndex = i+1;
                }

                _this.setState ({
                    tableListData:data.data,
                    pagination:{
                        total:data.totalCount,
                        current:data.pageIndex
                    }
                })
            }
            _this.buttonShow();
        }).catch(function onRejected(error){
            console.log(error)
        });
      }

};

