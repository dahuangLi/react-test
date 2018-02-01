import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import  axios from 'axios';
import { Form, Input, Button, Radio ,Row,Col,Table,Pagination ,Divider,Modal,InputNumber,Select } from 'antd';
import ContentHeader from '../common/header'
import VehNameSelect from '../common/VehNameSelect'
import './infoConfig'

import {AjaxPostFunc} from '../common/ajaxFunc';
import RealtimeConfig from '../common/formRule';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Search = Input.Search;
const { TextArea } = Input;


const RealtimeAddForm = Form.create()(
    (props) => {
      const { visible, onCancel, onCreate, form ,vehNameSelect,selectChange,signalListData,onSelectChange} = props;
      const { getFieldDecorator } = form;
      const columns = [
        {
            title: '编号',
            dataIndex: 'keyIndex',
            key: 'keyIndex',
            width:50
        },{
            title: '信号名称',
            dataIndex: 'signalName',
            key: 'name',
            width:120
        },{
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            width:120
        }
      ]
      const rowSelection = {
        signalListData,
        onChange: onSelectChange,
      };
      return (
        <Modal
          visible={visible}
          title="新增配置"
          okText="确定"
          cancelText="取消"
          onCancel={onCancel}
          onOk={onCreate}
          width = {800}
        >
            <Row>
                <Col span={12}>
                    <Table
                            dataSource={signalListData}
                            pagination={false}
                            columns={columns} 
                            size="small"
                            scroll={{ y: 280 }}
                            className = "textCenter"
                            rowSelection={rowSelection}
                    />
                </Col>
                <Col span={12}>
                <Form layout="horizontal" className = "form_bottom_reset">
                    <VehNameSelect vehNameSelect = {vehNameSelect} formSet = {form}/> 
                    <FormItem 
                        label="配置名称"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {getFieldDecorator('itemName',{
                            rules: [{ required: true, message: '请输入配置名称!' }],
                        })(<Input/>)}
                    </FormItem>
                    <FormItem 
                        label="采集周期"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {getFieldDecorator('collectCycle',{
                            rules: [{ required: true, message: '请输入采集周期!' }],
                        })(<InputNumber min={10} placeholder="请输入数字,为10的倍数" />)}
                    </FormItem>
                    <FormItem 
                        label="传输周期"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {getFieldDecorator('transCycle',{
                            rules: [{ required: true, message: '请输入传输周期!' }],
                        })(<InputNumber min={10} placeholder="请输入数字,为10的倍数" />)}
                    </FormItem>
                    <FormItem 
                        label="传输类型"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {getFieldDecorator('transType',{
                            rules: [{ required: true, message: '请输入传输类型!' }],
                        })(
                                <Select onChange={selectChange}>
                                    <Select.Option value="0">停止采集</Select.Option>
                                    <Select.Option value="1">以10ms采集1次后停止</Select.Option>
                                    <Select.Option value="2">按指定的频率通讯</Select.Option>
                                </Select>
                            )}
                    </FormItem>
                    <FormItem 
                        label="备注"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {getFieldDecorator('remark',{
                            rules: [{ required: false }],
                        })(<TextArea />)}
                    </FormItem>
                </Form>
                </Col>
            </Row>
          
        </Modal>
      );
    }
);

export default class RealTimeConfigMaintenance extends Component{
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
        visible:false,
        signalListData:[],
        paramSignalData:[],
        businessType:1,
        fields:{},
        btnCtr:{
            realtimeQuery:"hidden",
            realtimeAdd:"hidden",
            realtimeEnablement:"hidden",
            realtimeDelete:"hidden",
            realtimeDetail:"hidden",
            realtimeDisable:"hidden"
        },
        formRule : [
            {
                name:"配置编号",
                paramsSet:"itemNo"
            },
            {
                name:"配置名称",
                paramsSet:"itemName"
            },
            {
                name:"车型名称",
                paramsSet:"vehicleMode"
            }
        ]
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
        console.log(pageNumber)

        if(!isNaN(pageNumber)){
            params.pageIndex = pageNumber
        } else {
            params.pageIndex = this.state.pagination.current;
        }

        params.businessType = businessTypeSet || this.state.businessType;
        let requestParams = {
            method:"post",
            url:"/api/configFirst",
            params:params
        }
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
    // saveFormRef = (form) => {
    //     this.form = form;
    // }
    addFormRef = (form) => {
        this.form = form;
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
    // 新增配置
    realtimeAdd = () =>{
        var _this = this
        const form = this.form;
        form.validateFields((err, values) => {
          if (err) {
            return;
          }
          values.vehicleModeId = this.state.vehicleModeObj.id;
          values.signalList = this.state.paramSignalData;

          if(this.props.pathName == "realTimeConfigMaintenance"){
            values.businessType = 1;
          } else {
            values.businessType = 2;
          }
          if(values.signalList.length == 0){
            Modal.error({
                title: '提示',
                content: '请选择信号!',
              });
              return;
          }

          axios.post('/api/addIssueItem',values)
          .then(function(res){
            if(res.data.status == "SUCCEED"){
                form.resetFields();
                _this.setState({ visible: false });
                _this.handleCreate();
            }
          })
          .catch(function(err){
              console.log(err);
          });
        });
    }
    realtimeAddShowModal = () =>{
        this.setState({ visible: true });
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    vehNameSelect = (backData) =>{
        this.setState({ vehicleModeObj: backData });
        this.signalListFunc(backData);
    }   
    selectChange = (value) =>{
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
    
    onSelectChange = (selectedRowKeys) => {
        var _this = this
        var paramSignalData = []
        for(var i = 0;i<selectedRowKeys.length;i++){
            paramSignalData.push(_this.state.signalListData[selectedRowKeys[i]])
            this.setState({
                paramSignalData:paramSignalData
            })
        }


    }
    buttonShow = () =>{
        let btnCtrArray = Object.keys(this.state.btnCtr);
        let newBtnCtrObj = {};
        for(var i =0;i<this.props.pageButton.length;i++){
            for(var j = 0;j<btnCtrArray.length;j++){
                if(this.props.pageButton[i].url == btnCtrArray[j]){
                    newBtnCtrObj[btnCtrArray[j]] = "visible";
                }
            }
        }
        this.setState({
            btnCtr : Object.assign(this.state.btnCtr,newBtnCtrObj)
        })
    }
    render() {
        console.log(this)
        const fields = this.state.fields;
        const { visible, confirmLoading, ModalText,ModalTitle } = this.state;
        const statusTextDisabled = "禁用",
              statusTextTrue = "启用"
        const columns = [{
            title: '编号',
            dataIndex: 'keyIndex',
          },{
            title: '配置编号',
            dataIndex: 'itemNo',
          }, {
            title: '配置名称',
            dataIndex: 'itemName',
          }, {
            title: '车型名称',
            dataIndex: 'vehicleMode',
          }, {
            title: '单据状态',
            dataIndex: 'status',
            render: function(text,record){
                switch (record.status){
                    case 1: return "启用";break;
                    case 2: return "禁用";break;
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
                                    style = {{visibility:record.status == 1 ? _this.state.btnCtr.realtimeDisable : _this.state.btnCtr.realtimeEnablement}}   
                                    onClick={record.status == 1 ? _this.statusFunc.bind(this,2,record) :　_this.statusFunc.bind(this,1,record)}
                                >
                                { record.status == 1 ? statusTextDisabled : statusTextTrue}
                                </span>
                                <Divider type="vertical" />
                                <span  style = {{visibility:_this.state.btnCtr.realtimeDelete}} 
                                 onClick={_this.statusFunc.bind(this,0,record)}>删除</span>
                                <Divider type="vertical" />
                                <span  style = {{visibility:_this.state.btnCtr.realtimeDetail}} 
                                 onClick={_this.detailInfo.bind(this,record)}>详情</span>
                            </div>
            }.bind(this),
            width:140
          }];

        return (
            <div>
                <ContentHeader mainMenu="通讯配置管理" childMenu='通讯配置管理>>实时配置维护'/>
                <RealtimeConfig
                    handleCreate={this.handleCreate}
                    realtimeAddShowModal = {this.realtimeAddShowModal}
                    handleFormChange={this.handleFormChange}
                    btnCtr = {this.state.btnCtr}
                    formRule = {this.state.formRule}
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
                    />
                </div>
                <RealtimeAddForm
                    ref={this.addFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.realtimeAdd}
                    vehNameSelect = {this.vehNameSelect}
                    selectChange = {this.selectChange}
                    signalListData = {this.state.signalListData}
                    onSelectChange = {this.onSelectChange}
                    btnCtr = {this.state.btnCtr}
                />
            </div>
        )
    }

    // 打开页面 加载列表数据 componentDidMount 
    componentDidMount (){
        var _this = this;
        var params = {};
        this.props.actions.asyncAdd(this.props.pathName);
        if(this.props.pathName == "markConfig"){
            params.businessType = 2;
        } else {
            params.businessType = 1;
        }
        axios.post('/api/configFirst',params)
        .then(function(res){
          if(res.data.status == "SUCCEED"){
            for(var i = 0;i<res.data.data.length;i++){
                res.data.data[i].keyIndex = i+1;
            }
            _this.setState ({
                tableListData:res.data.data,
                pagination:{
                    total:res.data.totalCount,
                    current:res.data.pageIndex
                }
            })
          }
          _this.buttonShow();
        })
        .catch(function(err){
            console.log(err);
        });
      }

};

