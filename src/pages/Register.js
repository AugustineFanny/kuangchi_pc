import React from 'react'
import axios from 'axios'
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  message,
} from 'antd';
import {
  Link
} from 'react-router-dom'
import {
  injectIntl,
  intlShape,
  FormattedMessage
} from 'react-intl';
import {
  codeTest
} from '@/components/utils'
import '@/style/Register.less'
const FormItem = Form.Item;
const Option = Select.Option;

const registerError = (msg) => {
  message.error(msg);
};

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    isDisabled: false,
    buttonText: "",
    countdown: 0,

  };
  captcha = () => {
    let value = this.props.form.getFieldValue("ident");
    if (!value) {
      message.error(this.props.intl.formatMessage({
        id: 'emailMsg2'
      }), 1);
      return;
    }
    axios.get('/kc/captcha/send-captcha', {
        params: {
          "ident": value,
          "type": "REGISTER"
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
          codeTest(this.props, res.data.code)

        }



      })
      .catch(function(error) {
        console.log(error);
      });
  }
  componentDidMount() {
    // this.autoFocusInst.focus();
    var resize = function() {
      var clientHeight = document.documentElement.clientHeight;
      var Register_box = document.getElementsByClassName("Phonereg")[0];
      if (Register_box) {
        Register_box.style.height = (clientHeight) + "px";
      }
    };
    window.addEventListener ? window.addEventListener('resize', resize) : window.attachEvent('resize', resize);
    resize();
    //获取邀请码
    var qs = (function(a) {
      if (a == "") return {};
      var b = {};
      for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
      }
      return b;
    })(window.location.search.substr(1).split('&'));

    if (qs["i"]) {
      sessionStorage.setItem("inviteCode", qs["i"])
    }
  }
  componentWillReceiveProps(nextProps) {
    // var resize = function() {
    //   var clientHeight = document.documentElement.clientHeight;
    //   var Register_box = document.getElementsByClassName("Phonereg")[0];
    //   Register_box.style.height = (clientHeight) + "px";
    // };
    // window.addEventListener ? window.addEventListener('resize', resize) : window.attachEvent('resize', resize);
    // resize();
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        var inviteCode = sessionStorage.getItem("inviteCode");
        if (inviteCode)
          values["invite_code"] = inviteCode;
        axios.post("/kc/register", values, {
            headers: {
              "Content-Type": "application/json",
            }
          })
          .then(res => {
            if (res.data.code == '100200') {
              setTimeout(function() {
                window.location.href = "/kuangfront_pc/successreg";
              }, 1000)
            } else {
              codeTest(this.props, res.data.code)
            }

          })
          .catch(err => {
            console.log(err)
          })
          // console.log('Received values of form: ', values);
      }
    });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({
      confirmDirty: this.state.confirmDirty || !!value
    });
  }
  checkUsername = (rule, value, callback) => {
    if (value && !/^[a-zA-Z]\w{3,29}$/.test(value)) {
      callback(this.props.intl.formatMessage({
        id: 'regTitle9'
      }));
    }
    callback();
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback(this.props.intl.formatMessage({
        id: 'regTitle8'
      }));
    } else {
      callback();
    }
  }
  isCheck = (rule, value, callback) => {
    const form = this.props.form;
    if (value == false) {
      callback(this.props.intl.formatMessage({
        id: 'regTitle4'
      }));
    } else {
      callback();
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
  render() {
    const {
      getFieldDecorator
    } = this.props.form;
    const {
      intl
    } = this.props;
    const getMessage = intl.messages;
    const regTitle = intl.formatMessage({
      id: 'regTitle',
    });
    const regTitle2 = intl.formatMessage({
      id: 'regTitle2',
    });
    const regTitle3 = intl.formatMessage({
      id: 'regTitle3',
    });
    const phoneMsg2 = intl.formatMessage({
      id: 'phoneMsg2',
    });
    const oldMsg2 = intl.formatMessage({
      id: 'oldMsg2',
    });

    const regTitle5 = intl.formatMessage({
      id: 'regTitle5',
    });
    const regTitle6 = intl.formatMessage({
      id: 'regTitle6',
    });
    const regTitle7 = intl.formatMessage({
      id: 'regTitle7',
    });
    const regTitle8 = intl.formatMessage({
      id: 'regTitle8',
    });
    const newInput = intl.formatMessage({
      id: 'newInput',
    });

    return (
      <div className="Phonereg">
        <div className="kc_register">
           <div className="kc_regbox">
                    <Form className="kc_form" onSubmit={this.handleSubmit}>
                    <h2>User signup</h2>
                        <FormItem
                          hasFeedback
                        >
                          {getFieldDecorator('username', {
                            rules: [{ required: true, message: `${regTitle}` },
                                    { validator: this.checkUsername}],
                          })(
                            <Input placeholder={regTitle5} />
                          )}
                        </FormItem>
                        <FormItem
                          hasFeedback
                        >
                          {getFieldDecorator('ident', {
                            rules: [{
                              type: 'email', message: `${regTitle2}`,
                            }, {
                              required: true, message: `${regTitle3}`,
                            }],
                          })(
                            <Input placeholder={regTitle6}  />
                          )}
                        </FormItem>
                         <FormItem>
                          <Row gutter={8}>
                            <Col span={16}>
                              {getFieldDecorator('captcha', {
                                rules: [{ required: true, message: `${phoneMsg2}`  }],
                              })(
                                <Input placeholder={regTitle7} size="large" />
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
                          hasFeedback
                        >
                          {getFieldDecorator('password', {
                            rules: [{
                              required: true, message: `${oldMsg2}`,
                            }, {
                              validator: this.checkConfirm,
                            }],
                          })(
                            <Input placeholder={newInput} type="password" />
                          )}
                        </FormItem>
                        <FormItem
                          hasFeedback
                        >
                          {getFieldDecorator('check_password', {
                            rules: [{
                              required: true, message:`${regTitle8}`,
                            }, {
                              validator: this.checkPassword,
                            }],
                          })(
                            <Input placeholder={regTitle8} type="password" onBlur={this.handleConfirmBlur} />
                          )}
                        </FormItem>
                        
                        <div className="toLogin">
                       
                        <section>
                         <FormattedMessage
                            id='Accountnumber'
                            defaultMessage="已有账号"
                        /><Link to={'/kuangfront_pc/login'}><span> <FormattedMessage
                            id='login2'
                            defaultMessage="点击登录"
                        /></span></Link> </section>
                        </div>
                        <FormItem>
                          <Button  id="phonereg" type="primary" htmlType="submit" size="large"><FormattedMessage
                            id='register'
                            defaultMessage="注册"
                        /></Button>
                        </FormItem>
                      </Form>
                </div>
              </div>
            </div>
    );
  }
}
const EmailRegister = Form.create()(RegistrationForm);
EmailRegister.propTypes = {
  intl: intlShape.isRequired
}
export default injectIntl(EmailRegister);