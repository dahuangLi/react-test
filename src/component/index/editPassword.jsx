import React, {Component} from 'react';
import { Button, Modal, Form, Input, Radio ,Icon,Row,Col} from 'antd';
import axios from 'axios';
import '../../less/hello.css'
const FormItem = Form.Item;

const CollectionCreateForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form,roleName } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="修改密码"
        okText="确定"
        cancelText="取消"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="horizontal">
          <Row>
            <Col span={5} className = "textRight">
              <span className="textSpan">用户名:</span>
            </Col>
            <Col span={12}>&nbsp;&nbsp;&nbsp;{roleName}</Col>
          </Row>
          <FormItem 
              label="旧密码"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 19 }}
            >
            {getFieldDecorator('oldPasswd', {
              rules: [{ required: true, message: '请输入密码!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem 
            label="新密码"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
          >
            {getFieldDecorator('newPasswd',{
              rules: [{ required: true, message: '请输入新密码!' }],
            })(<Input/>)}
          </FormItem>
          <FormItem 
            label="确认密码"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
          >
            {getFieldDecorator('newPasswordSure',{
              rules: [{ required: true, message: '请确认密码!' }],
            })(<Input/>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);

export default class EditPassword extends Component {
  state = {
    visible: false,
  };
  showModal = () => {
    this.setState({ visible: true });
  }
  handleCancel = () => {
    this.setState({ visible: false });
  }
  handleCreate = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      var _this = this;
      if (err) {
        return;
      }
      axios.post('/api/resetPasswd',values)
      .then(function(res){
         if(res.data.status == "SUCCEED"){
             location.reload();
         }
      })
      .catch(function(err){
          console.log(err);
      });
    });
  }
  saveFormRef = (form) => {
    this.form = form;
  }
  render() {
    return (
      <div>
        <span onClick={this.showModal}
              className="spanCtr"><Icon type="edit" 
              style={{ fontSize: 16, color: '#dd0721' }}
               />修改密码
        </span>
        &nbsp;&nbsp;&nbsp;|
        <CollectionCreateForm
          ref={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          roleName = {this.props.roleName}
        />
      </div>
    );
  }
}
