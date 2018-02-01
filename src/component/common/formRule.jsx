import React, {Component} from 'react';
import { Form, Input, Button, Radio ,Row,Col,Table,Pagination ,Divider,Modal,InputNumber,Select } from 'antd';
import "./common"
const FormItem = Form.Item;


const RealtimeFormConfig = Form.create({
    onValuesChange(props, values) {
        console.log(props)
      props.handleFormChange(values);
    },
  })((props) => {
    const {  handleCreate, realtimeAddShowModal, form, roleName,btnCtr,formRule } = props;
    const { getFieldDecorator } = form;


    const queryShow = formRule.map((item,index) =>{

            if((index + 1) % 4 == 0){
                return  <Col span={6} key={index}>
                        <FormItem
                            label = {item.name}
                            labelCol={{ span: 7 }}
                            wrapperCol={{ span: 17 }}
                        >
                            {getFieldDecorator(item.paramsSet, {
                                rules: [{ required: false, message: '请输入密码!' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
            } else {
                return  <Col span={6} key={index}>
                        <FormItem
                            label = {item.name}
                            labelCol={{ span: 7 }}
                            wrapperCol={{ span: 17 }}
                        >
                            {getFieldDecorator(item.paramsSet, {
                                rules: [{ required: false, message: '请输入密码!' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
            }
    })

    return (
            <Form layout="inline" className="formPadding">
                <Row>
                    {queryShow}
                    <Col span={4}>
                        <Button type="primary" style = {{visibility:btnCtr.realtimeQuery}}  onClick = {handleCreate}>查询</Button>
                        <Button type="primary" style = {{marginLeft:"44px",visibility:btnCtr.realtimeAdd}} onClick = {realtimeAddShowModal}>新增</Button>
                    </Col>
                </Row>
            </Form>
    );
});

export default class RealtimeConfig extends Component{
    
    render(){
        console.log(this)
        return (
            <RealtimeFormConfig
                    handleCreate={this.props.handleCreate}
                    realtimeAddShowModal = {this.props.realtimeAddShowModal}
                    handleFormChange={this.props.handleFormChange}
                    btnCtr = {this.props.btnCtr}
                    formRule = {this.props.formRule}
                />
        )
    }
};

