import React from 'react'
import axios from 'axios'
import {
  Form,
  Input,
  Select,
  Row,
  Col,
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
import '@/style/Register.less'
import {
  codeTest
} from '@/components/utils'
const FormItem = Form.Item;
const Option = Select.Option;
const registerError = (msg) => {
  message.error(msg);
};

class ForgetForm extends React.Component {
  state = {
    isDisabled: false,
    buttonText: "",
    countdown: 0,

  };
  //对验证码进行判断
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
          "type": "RESETPASSWORD"
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
        axios.post("/kc/reset-password", values, {
            headers: {
              "Content-Type": "application/json",
            }
          })
          .then(res => {
            console.log(res)
            if (res.data.code == '100200') {
              message.success(this.props.intl.formatMessage({
                id: 'reSuccess'
              }))
              setTimeout(function() {
                window.location.href = "/kuangfront_pc/login";
              }, 1000)
            } else {
              codeTest(this.props, res.data.code);
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    });
  }


  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('new_password')) {
      callback(this.props.intl.formatMessage({
        id: 'regTitle8'
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

    const regTitle3 = intl.formatMessage({
      id: 'regTitle3',
    });
    const phoneMsg2 = intl.formatMessage({
      id: 'phoneMsg2',
    });
    const oldMsg2 = intl.formatMessage({
      id: 'oldMsg2',
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
           <div className="kc_regbox" style={{height:"560px"}}>
                    <Form className="kc_form" style={{minHeight:"420px"}} onSubmit={this.handleSubmit}>
                    <h2>Reset</h2>
                        <FormItem
                        >
                          {getFieldDecorator('ident', {
                            rules: [ {
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
                        >
                          {getFieldDecorator('new_password', {
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
                        >
                          {getFieldDecorator('check_password', {
                            rules: [{
                              required: true, message:`${regTitle8}`,
                            }, {
                              validator: this.checkPassword,
                            }],
                          })(
                            <Input placeholder={regTitle8} type="password"  />
                          )}
                        </FormItem>
                        
                       
                        <FormItem>
                          <Button  id="phonereg" type="primary" htmlType="submit" size="large"><FormattedMessage id='submit'/></Button>
                        </FormItem>
                      </Form>
                </div>
              </div>
            </div>
    );
  }
}
const Forget = Form.create()(ForgetForm);
Forget.propTypes = {
  intl: intlShape.isRequired
}
export default injectIntl(Forget);