import React from 'react'
import '@/style/Subscription.less'
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
  FormattedMessage,
} from 'react-intl';
import {
  limitAmount,
  limitPrice,
  codeTest
} from '@/components/utils'
import {
  Redirect,
  Link
} from 'react-router-dom'
const FormItem = Form.Item;
const Option = Select.Option;

class SubscriptionForm extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      cuur: [],
      loading: false,
      activeKey: "FET",
      ableuse: true,
      ratio: null,
      finance: {},
      amountList: null,
      currency: null,
      price: null,
      gotoSure: false
    }
  }
  componentDidMount() {
      this.getCurr();
    }
    //币种
  getCurr = () => {
    axios.get("/kc/public/FET/exchange", {
        headers: {
          "authorization": sessionStorage.getItem("authorization")
        }
      })
      .then(res => {
        if (res.data.code == '100103') {
          window.location.href = "/kuangfront_pc/login";
        } else if (res.data.code == '100200') {
          var res = res.data.data;
          var arr = [];
          for (var i in res) {
            var obj = {
              'value': i,
            }
            arr.push(obj)
          }
          this.setState({
            cuur: arr
          })
        } else if (res.data.code == "100102") {
          message.error(res.data.msg, 1.5);
        } else {
          codeTest(this.props, res.data.code)
        }
      })
  }



  changeCurr = (value) => {
      axios.get("/kc/public/FET/exchange", {
          headers: {
            "authorization": sessionStorage.getItem("authorization")
          }
        })
        .then(res => {
          if (res.data.code == '100103') {
            window.location.href = "/kuangfront_pc/login";
          } else if (res.data.code == '100200') {
            var res = res.data.data;
            this.props.form.setFieldsValue({
              ratio: `1 ${value} = ${res[value]} FET`,
              amount: null,
              cur_amount: null
            });
            this.setState({
              ableuse: false,
              price: res[value],
              currency: value,
            }, () => {
              // this.getCurrenciesDetail(value)
            })
          } else if (res.data.code == "100102") {
            message.error(res.data.msg, 1.5);
          } else {
            codeTest(this.props, res.data.code)
          }
        })
    }
    // getCurrenciesDetail(curr) {
    //     axios.get('/kc/public/currencies/detail?flag=all')
    //       .then(res => {
    //         if (res.data.code == "100200") {
    //           var currencies = res.data.data;
    //           var finance = {};
    //           for (var i in currencies) {
    //             var raw = currencies[i];
    //             finance[[raw.currency]] = {
    //               "amount": 0,
    //               "lockAmount": 0,
    //               "usableAmount": 0
    //             };
    //           }
    //         }
    //         var val = curr;
    //         this.setState({
    //           finance: finance
    //         }, () => {
    //           this.getTotalassets(val);
    //         });
    //       })
    //   }
    //总资产
    // getTotalassets(curr) {
    //       axios.get('/kc/wallet/finance', {
    //           headers: {
    //             "Content-Type": "application/json",
    //             "authorization": sessionStorage.getItem("authorization")
    //           }
    //         })
    //         .then((res) => {
    //           if (res.data.data) {
    //             this.setState({
    //               data: res.data.data
    //             })
    //           }
    //           var oldFinance = {...this.state.finance
    //           };
    //           var finance = res.data.data;
    //           for (var index in finance) {
    //             var raw = finance[index];
    //             if (raw.currency in oldFinance) {
    //               oldFinance[raw.currency].amount = raw.amount;
    //               oldFinance[raw.currency].lockAmount = raw.lock_amount;
    //               oldFinance[raw.currency].usableAmount = limitAmount(raw.amount - raw.lock_amount);
    //             }
    //           }
    //           this.setState({
    //             amountList: oldFinance[curr]
    //           });
    //         })
    //         .catch(function(error) {
    //           console.log(error);
    //         });
    //   }
    //amount
  changeAmount = (e) => {
      var price = this.state.price;
      var val = e.target.value;
      var amount_fet;
      amount_fet = val * price;
      var amount_fet = amount_fet.toString();
      var l = amount_fet.split(".");

      if (l.length > 1 && l[1].length > 2) {
        amount_fet = Number(limitPrice(amount_fet));
        this.props.form.setFieldsValue({
          cur_amount: amount_fet,
        });
      } else {
        amount_fet = Number(amount_fet);
        this.props.form.setFieldsValue({
          cur_amount: amount_fet,
        });
      }
    }
    //cur_amount
  limitBtc = (num) => {
    return Math.floor(num * 1000000) / 1000000
  }
  changecurAmount = (e) => {
    var val = e.target.value;
    var price = this.state.price;
    var amount = val / price;
    var amount = amount.toString();
    var l = amount.split(".");
    if (l.length > 1 && l[1].length > 2) {
      amount = String(this.limitBtc(amount))
      this.props.form.setFieldsValue({
        amount: amount,
      });
    } else {
      amount = String(amount);
      this.props.form.setFieldsValue({
        amount: amount,
      });
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          loading: true
        })
        values.amount = Number(values["amount"]);
        values.cur_amount = Number(values["cur_amount"]);

        axios.post("/kc/wallet/orders", values, {
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
              this.setState({
                order: res.data.data,
                gotoSure: true
              })
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

    // var usableAmount;
    // var placeholder;
    // if (this.state.amountList) {
    //   usableAmount = this.state.amountList.usableAmount
    // } else {
    //   usableAmount = 0;
    // }
    // if (!this.state.ableuse) {
    //   placeholder = this.props.intl.formatMessage({
    //     id: 'ableUse'
    //   }) + `${usableAmount} ` + `${this.state.currency}`;
    // }
    if (this.state.gotoSure) {
      return <Redirect push to = {
        {
          pathname: '/kuangfront_pc/mywallet/subinfo',
          state: {
            order: this.state.order,
          }
        }
      }
      />;
    }
    return (
      <div className="kc_wallets">
      <div className="kc_transfer kc_subscription" >
          <div><i className="icon iconfont icon-goumai"></i><FormattedMessage
                            id='subscription'
                            defaultMessage="认购"
                        /></div>
           <div className="kc_transferto">
                 <Form>
                       <FormItem
                              {...formItemLayout}
                              label={this.props.intl.formatMessage({
                                id: 'cuur'
                              })}
                            >
                              {getFieldDecorator('base', {
                                rules: [
                                  { required: true, message: this.props.intl.formatMessage({
                                id: 'nocuur'
                              }) },
                                ],
                                onChange:this.changeCurr
                              })(
                                <Select  placeholder={this.props.intl.formatMessage({
                                id: 'select'
                              })}>
                                  {
                                    this.state.cuur.map((item,index)=>{
                                      return(
                                         <Option key={index} value={item.value}>{item.value}</Option>
                                        )
                                    })
                                  }
                                </Select>
                              )}
                      </FormItem>
                     <FormItem className="kc_ratio"
                          {...formItemLayout}
                          label={this.props.intl.formatMessage({
                                id: 'Proportion'
                              })}
                        >
                        {getFieldDecorator('ratio', {
                           
                            })(
                             <Input disabled  />
                            )}
                        </FormItem>
                    <FormItem  className="funPwd"
                          {...formItemLayout}
                          label={this.props.intl.formatMessage({
                                id: 'sellAmount'
                              })}
                        >
                        {getFieldDecorator('amount', {
                              rules: [
                                { required: true, message: this.props.intl.formatMessage({
                                id: 'AmountInto'
                              }) },
                              ],
                             onChange : this.changeAmount
                            })(
                             <Input type="number"  disabled={this.state.ableuse}  placeholder={null}/>
                            )}
                             {
                              !this.state.ableuse?  <span className="kc_curr">{this.state.currency}</span>:null
                            }
                           
                        </FormItem>
                       <FormItem className="kc_ratios funPwd"
                          {...formItemLayout}
                          label={<i className="icon iconfont icon-zhuanhuan"></i>}
                        >
                        {getFieldDecorator('cur_amount', {
                              rules: [
                                { required: true, message: this.props.intl.formatMessage({
                                id: 'AmountInto'
                              }) },
                              ],
                             onChange : this.changecurAmount
                            })(
                             <Input type="number"   disabled={this.state.ableuse} />
                            )}
                            {
                              !this.state.ableuse? <span className="kc_curr">FET</span>:null
                            }
                           
                        </FormItem>
                     
                        <FormItem className="funPwd"
                            {...formItemLayout}
                            label={this.props.intl.formatMessage({
                                id: 'payPwd'
                              })}
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
                            id='subscription'
                            defaultMessage="认购"
                        /></Button>
                 </Form>
              </div>
      </div>
         
      </div>
    )
  }
}

const Subscription = Form.create()(SubscriptionForm);
Subscription.propTypes = {
  intl: intlShape.isRequired
}
export default injectIntl(Subscription);