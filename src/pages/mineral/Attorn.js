import React from 'react'
import '@/style/Transfer.less'
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
import {
  Redirect,
  Link
} from 'react-router-dom'
import '@/assets/iconfont/iconfont.css'
import {
  injectIntl,
  intlShape,
  FormattedMessage,
  defineMessages
} from 'react-intl';
import {
  codeTest
} from '@/components/utils';
const FormItem = Form.Item;
const Option = Select.Option;

class AttornForm extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      loading: false,
      activeKey: "FET",
      id: this.props.location.state.id,
      amount: this.props.location.state.amount,
      redirect: false
    }
  }
  componentDidMount() {

    }
    //验证码
  captcha = () => {
    var that = this;
    let mode = this.props.form.getFieldValue("verify_mode");
    axios.get('/kc/self/verify-code', {
        params: {
          "mode": mode,
          "type": "TRANSFERLOCKED"
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


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          loading: true
        })
        values.currency = this.state.activeKey;
        axios.post("/kc/wallet/locked/" + this.state.id + "/transfer", values, {
            headers: {
              "Content-Type": "application/json",
              "authorization": sessionStorage.getItem("authorization"),
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
              setTimeout(() => {
                this.setState({
                  redirect: true
                })
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
      intl
    } = this.props;
    const getMessage = intl.messages;
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
    if (this.state.redirect) {
      return <Redirect push to = {"/kuangfront_pc/mywallet/attrecord"}
      />;
    }
    return (
      <div className="kc_wallets">
      <div className="kc_transfer" >
          <div><i className="icon iconfont icon-zhuanrang"></i><FormattedMessage
                    id='turnother'
                    defaultMessage = "转让"
                /></div>
           <div className="kc_transferto">
                 <Form>
                 <FormItem
                          {...formItemLayout}
                          label={this.props.intl.formatMessage({
                            id: 'sellAmount'
                          })}
                        >
                             <Input disabled={true}  value={this.state.amount + " FET"} />
                        </FormItem>
                     <FormItem
                          {...formItemLayout}
                          label={this.props.intl.formatMessage({
                            id: 'account'
                          })}
                        >
                        {getFieldDecorator('address', {
                              rules: [
                                { required: true, message: this.props.intl.formatMessage({
                            id: 'accinput'
                          }) },
                              ],
                             // onChange : this.changeAmount
                            })(
                             <Input placeholder={this.props.intl.formatMessage({
                            id: 'login_title'
                          })} />
                            )}
                        </FormItem>
                    
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
                        <FormItem className="funPwd"
                            {...formItemLayout}
                            label={(
                               <FormattedMessage
                              id='payPwd'
                              defaultMessage="资金密码"
                            />
                            )}
                          >
                            {getFieldDecorator('fund_password',{
                              rules: [{
                                required: true, message: this.props.intl.formatMessage({
                                        id: 'fundMsg2'
                                    }),
                              }, ],
                            })(
                              <Input autoComplete="off"  type="password" />
                            )}
                            <Link to={{
                              pathname:"/kuangfront_pc/mywallet/fund",
                              state: {open:"sub4", selected:"9"}
                            }}><span className="forget"> <FormattedMessage
                                                  id='forgetPwd'
                                                  defaultMessage="忘记密码"
                                              /></span></Link>
                      </FormItem>
                        <Button loading={this.state.loading} type="primary" onClick={this.handleSubmit} className="kc_sure"><FormattedMessage
                                                  id='sureturn'
                                                  defaultMessage="确认转账"
                                              /></Button>
                 </Form>
              </div>
      
         </div>
      </div>
    )
  }
}

const Attorn = Form.create()(AttornForm);
Attorn.propTypes = {
  intl: intlShape.isRequired
}
export default injectIntl(Attorn);