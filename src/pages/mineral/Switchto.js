import React from 'react'
import '@/style/Switchto.less'
import {
  Input,
  Form,
  message,
  Button,
} from 'antd';
import axios from 'axios'
import '@/assets/iconfont/iconfont.css'
import Poorrecord from './Poorrecord'
import {
  injectIntl,
  intlShape,
  FormattedMessage
} from 'react-intl';
import {
  codeTest
} from '@/components/utils';
const FormItem = Form.Item;
class SwitchtoForm extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false
    }
  }
  handleSubmit = (e) => {
    console.log("123");
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          loading: true
        })
        values.amount = Number(values["amount"]);
        axios.post("/kc/wallet/" + "FET" + "/locked", values, {
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
                window.location.reload();
              }, 500)
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
      <div className="kc_wallets">
      <div className="kc_switchto">
          <div className="kc_swtop">
              <div><i className="icon iconfont icon-jiahao"></i><FormattedMessage
                                                id='turnin'
                                                defaultMessage = "转入"
                                            /></div>
              <div className="kc_turn">

                 <Form>
                    <FormItem
                          {...formItemLayout}
                          label={this.props.intl.formatMessage({
                          id: 'turnAmount'
                        })}
                        >
                        {getFieldDecorator('amount', {
                              rules: [
                                { required: true, message: this.props.intl.formatMessage({
                          id: 'AmountInto'
                        }) },
                              ],
                             // onChange : this.changeAmount
                            })(
                             <Input type="number"/>
                            )}
                        </FormItem>
                        <FormItem
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
                              <Input autoComplete="off"  type="password"  />
                            )}
                      </FormItem>
                        <Button loading={this.state.loading} type="primary" onClick={this.handleSubmit} className="kc_turnit"><FormattedMessage
                                                id='turnin'
                                                defaultMessage = "转入"
                                            /></Button>
                 </Form>
                  <div className="kc_prompt"><i className="icon iconfont icon-bangzhuzhongxin"></i><FormattedMessage
                                id='Prompt'
                                defaultMessage = "友情提示"
                             /><span> : </span>
                             <FormattedMessage
                  id='PromptInfo'
                  defaultMessage = "FET转入矿池，锁定时间将从当前日期开始自动延后60天"
               />  </div>
              </div>
          </div>     
          <div className="kc_swbottom">
              <Poorrecord />
          </div>     
      </div>
      </div>
    )
  }
}
const Switchto = Form.create()(SwitchtoForm);
Switchto.propTypes = {
  intl: intlShape.isRequired
}
export default injectIntl(Switchto);