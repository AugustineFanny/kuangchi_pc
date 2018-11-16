import React from 'react'
import '@/style/Fund.less'
import {
  Input,
  Form,
  message,
  Button,
  Select,
  Row,
  Col,
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
const Option = Select.Option;
class FundForm extends React.Component {
  constructor() {
      super();
      this.state = {
        loading: false
      }
    }
    //验证码
  captcha = () => {
    let mode = this.props.form.getFieldValue("verify_mode");
    axios.get('/kc/self/verify-code', {
        params: {
          "mode": mode,
          "type": "FUNDPASSWORD"
        },
        headers: {
          "Content-Type": "application/json",
          "authorization": sessionStorage.getItem("authorization")
        }
      })
      .then((res) => {
        if (res.data.code == "100200") {
          this.setState({
            isDisabled: true,
            buttonText: '60s',
            countdown: 60
          });
          let int = setInterval(() => {
            let countdown = this.state.countdown - 1;
            if (countdown > 0) {
              this.setState({
                buttonText: countdown + 's',
                countdown: countdown
              });
            } else {
              this.setState({
                isDisabled: false
              });
              clearInterval(int);
            }
          }, 1000);
        } else {
          codeTest(this.props, res.data.code);

        }
      })
      .catch(function(error) {
        console.log(error);
      });
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
    if (value && value !== form.getFieldValue('fund_password')) {
      callback(this.props.intl.formatMessage({
        id: 'regTitle8'
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
        axios.post("/kc/self/fund-password", values, {
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
            if (res.data.code == "100200") {
              message.success(this.props.intl.formatMessage({
                id: 'success2'
              }), 1.5);
              this.props.form.resetFields();
              setTimeout(() => {
                window.location.reload();
              }, 1500)
            } else if (res.data.code == "100102") {
              message.error(res.data.msg, 1.5);
            } else {
              codeTest(this.props, res.data.code)
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
              <div><i className="icon iconfont icon-mima"></i><FormattedMessage
                                      id='payPwd'
                                      defaultMessage = "资金密码"
                                  /></div>
              <div className="kc_fundinfos">

                 <Form>
                    <FormItem
                              {...formItemLayout}
                              label={this.props.intl.formatMessage({
                                  id: 'method'
                                })}
                            >
                              {getFieldDecorator('verify_mode', {
                                rules: [
                                  { required: true, message: this.props.intl.formatMessage({
                                  id: 'choseMethod'
                                }) },
                                ],
                                initialValue:"EMAIL",
                              })(
                                <Select>
                                  <Option value="EMAIL"><FormattedMessage
                                      id='emailReg'
                                      defaultMessage = "邮箱"
                                  /></Option>
                                </Select>
                              )}
                    </FormItem>
                    <FormItem
                         {...formItemLayout}
                              label={this.props.intl.formatMessage({
                                  id: 'code1'
                                })}
                      >
                          <Row gutter={8}>
                            <Col span={16}>
                              {getFieldDecorator('verify_code', {
                                rules: [{ required: true, message: this.props.intl.formatMessage({
                                  id: 'loginInput3'
                                })  }],
                              })(
                                <Input  size="large" />
                              )}
                            </Col>
                            <Col span={8}>
                               {this.state.isDisabled ? 
                                        <Button  disabled size="large">{this.state.buttonText}</Button>:
                                           <Button style={{fontSize:"13px",float:"right"}}  onClick={this.captcha}  size="large"> <FormattedMessage
                                                  id='getCode'
                                                  defaultMessage="获取验证码"
                                              /></Button>
                                        }
                            </Col>
                          </Row>
                        </FormItem>
                    <FormItem
                          {...formItemLayout}
                          label={this.props.intl.formatMessage({
                                  id: 'payPwd'
                                })}
                        >
                        {getFieldDecorator('fund_password', {
                              rules: [
                                { required: true, message: this.props.intl.formatMessage({
                                    id: 'fundMsg2'
                                }) },
                                 {
                                validator: this.checkConfirm,
                                }
                              ],
                            })(
                             <Input type="password" />
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
                                    id: 'regTitle8'
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
const Fund = Form.create()(FundForm);
Fund.propTypes = {
  intl: intlShape.isRequired
}
export default injectIntl(Fund);