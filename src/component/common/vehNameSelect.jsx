import React, {Component} from 'react';
import  axios from 'axios';
import {Input,Modal,Table,Radio,Form,notification  } from  'antd';
import './common.less';

const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;


export default class VehNameSelect extends Component{
    state = {
        vehNameData : [],
        backObj:"",
        radioValue:"a",
        visible:false
    }
    radioChange = (e)=>{
        console.log(this)
        this.setState({
            backObj:this.state.vehNameData[e.target.value - 1],
            radioValue:e.target.value
        })
        this.props.vehNameSelect(this.state.vehNameData[e.target.value - 1]);
    }
    vehNameSelect = () =>{
        var _this = this;
        axios.post('/api/allServer',{modelName:""})
        .then(function(res){
          console.log(res)
          if(res.data.status == "SUCCEED"){
            for(var i = 0;i<res.data.data.length;i++){
                res.data.data[i].keyIndex = i+1;
            }
            const dataSource = res.data.data
            _this.setState({
                vehNameData  : dataSource,
                visible: true,
            })
          }
        })
        .catch(function(err){
            console.log(err);
        });
    }
    handleCancel = (e) => {
        this.setState({
          visible: false,
        });
    }
    handleOk = (e) =>{
        console.log(this)

        if(this.state.radioValue == 'a'){
            Modal.info({
                title: '提示',
                content: (
                  <div>
                    <p>请选择车型.</p>
                  </div>
                ),
                onOk() {},
              });
            return
        }

        this.props.formSet.setFieldsValue({
            vehicleMode:this.state.backObj.name
        })
        this.setState({
            visible: false,
        });
    }
    render(){
        const columns = [
            {
                title: '编号',
                dataIndex: 'keyIndex',
                key: 'keyIndex',
                width:50
            },{
                title: '车型名称',
                dataIndex: 'name',
                key: 'name',
                width:120
            },{
                title: '操作',
                dataIndex: 'action',
                width:120,
                render:function(text,record){
                    return <RadioButton value={record.keyIndex}>选择</RadioButton>
                }
            }
        ]
        const { getFieldDecorator } = this.props.formSet;
        return (
                <div>
                    <FormItem
                        label="车型名称"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {getFieldDecorator('vehicleMode', {
                            rules: [{ required: true, message: '请选择车型名称!' }],
                        })(
                            <Search
                                placeholder="input search text"
                                onSearch={this.vehNameSelect}
                                enterButton
                                readOnly
                            />
                        )}
                    </FormItem>
                    <Modal
                        title="Basic Modal"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <div>
                            <RadioGroup onChange={this.radioChange} defaultValue="a" size = "small">
                                <Table 
                                        dataSource={this.state.vehNameData}
                                        pagination={false}
                                        columns={columns} 
                                        size="small" 
                                        scroll={{ y: 140 }}
                                        className = "textCenter"
                                />
                            </RadioGroup>    
                        </div>
                    </Modal>
                </div>
        )
    }
};
