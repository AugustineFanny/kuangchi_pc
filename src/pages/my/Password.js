import React from 'react'
// import '@/style/Password.less'
import {
  Input,
  Form,
  message,
  Button,
} from 'antd';
import axios from 'axios'
import '@/assets/iconfont/iconfont.css'
import {
  injectIntl,
  intlShape,
  FormattedMessage
} from 'react-intl';
import {
  codeTest
} from '@/components/utils';
const FormItem = Form.Item;
class PasswordForm extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && !(/(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/.test(value))) {
      callback(this.props.intl.formatMessage({
        id: 'newInput'
      }))
    } else {
      callback();
    }
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('new_password')) {
      callback(this.props.intl.formatMessage({
        id: 'oldMsg3'
      }));
    } else {
      callback();
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          loading: true
        })
        var authorization = sessionStorage.getItem("authorization");
        axios.post("/kc/self/change-password", values, {
            headers: {
              "Content-Type": "application/json",
              "authorization": authorization
            }
          })
          .then(res => {
            if (res) {
              this.setState({
                loading: false
              })
            }
            if (res.data.code != "100200") {
              codeTest(this.props, res.data.code);
            } else {
              message.success(this.props.intl.formatMessage({
                id: 'success'
              }), 1.5);
              this.props.form.resetFields();
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    });
  }
  render() {
    const {
      getFieldDecorator
    } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      },
    };
    return (
      <div className="kc_fund">
          <div className="kc_fundinfo">
              <div><i className="icon iconfont icon-xiugaimima"></i><FormattedMessage
                                      id='changepwd2'
                                      defaultMessage = "修改密码"
                                  /></div>
              <div className="kc_fundinfos">

                 <Form>
                    <FormItem
                          {...formItemLayout}
                          label={this.props.intl.formatMessage({
                                  id: 'oldPwd'
                                })}
                        >
                        {getFieldDecorator('password', {
                              rules: [
                                { required: true, message: this.props.intl.formatMessage({
                                        id: 'oldInput'
                                      }) },
                              ],
                             // onChange : this.changeAmount
                            })(
                             <Input type="password" />
                            )}
                        </FormItem>
                         <FormItem
                          {...formItemLayout}
                          label={this.props.intl.formatMessage({
                                        id: 'newPwd'
                                      })}
                        >
                        {getFieldDecorator('new_password', {
                              rules: [
                                { required: true, message: this.props.intl.formatMessage({
                                        id: 'newPwdinput'
                                      }) },
                                {
                                validator: this.checkConfirm,
                                }
                              ],
                            })(
                             <Input type="password"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={this.props.intl.formatMessage({
                                        id: 'surePwd'
                                      })}
                          >
                            {getFieldDecorator('check_password',{
                              rules: [{
                                required: true, message: this.props.intl.formatMessage({
                                          id: 'sureInput'
                                        }),},
                              {
                                validator: this.checkPassword,
                                } ],
                            })(
                              <Input autoComplete="off" placeholder={null} type="password"  />
                            )}
                      </FormItem>
                        <Button loading={this.state.loading} type="primary" onClick={this.handleSubmit} className="kc_sure"><FormattedMessage id='changepwd'/></Button>
                 </Form>
              </div>
          </div>     
      </div>
    )
  }
}
const Password = Form.create()(PasswordForm);
Password.propTypes = {
  intl: intlShape.isRequired
}
export default injectIntl(Password);