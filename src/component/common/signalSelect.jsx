import React, {Component} from 'react';
import  axios from 'axios';
import {Input,Modal,Table,Radio,Form,notification  } from  'antd';
import './common.less';

const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;


export default class SingalList extends Component{
    state = {
        signalListData : [],
        backObj:"",
        radioValue:"a",
        visible:false
    }
    radioChange = (e)=>{
        console.log(this)
        this.setState({
            backObj:this.state.signalListData[e.target.value - 1],
            radioValue:e.target.value
        })
        this.props.signalListFunc(this.state.signalListData[e.target.value - 1]);
    }
    signalListFunc = () =>{
        var _this = this;
        axios.post('/api/getSignalListByVehicleMode',{modelName:""})
        .then(function(res){
          console.log(res)
          if(res.data.status == "SUCCEED"){
            for(var i = 0;i<res.data.data.length;i++){
                res.data.data[i].keyIndex = i+1;
            }
            const dataSource = res.data.data
            _this.setState({
                signalListData  : dataSource,
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

        // if(this.state.radioValue == 'a'){
        //     Modal.info({
        //         title: '提示',
        //         content: (
        //           <div>
        //             <p>请选择车型.</p>
        //           </div>
        //         ),
        //         onOk() {},
        //       });
        //     return
        // }

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
                    <RadioGroup onChange={this.radioChange} defaultValue="a" size = "small">
                        <Table 
                                dataSource={this.state.signalListData}
                                pagination={false}
                                columns={columns} 
                                size="small" 
                                scroll={{ y: 140 }}
                                className = "textCenter"
                        />
                    </RadioGroup>    
                </div>
        )
    }
};
