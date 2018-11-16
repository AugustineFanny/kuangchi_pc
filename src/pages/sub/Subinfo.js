import React from 'react'
import '@/style/Subinfo.less'
import {
  Input,
  Form,
  message,
  Button,
  Modal,
  Spin
} from 'antd';
import axios from 'axios'
import '@/assets/iconfont/iconfont.css'
import QRCode from '@/components/QRCode'
import copy from 'copy-to-clipboard'
import {
  injectIntl,
  intlShape,
  FormattedMessage,
} from 'react-intl';
import {
  Redirect
} from 'react-router-dom'
import {
  showDatetime,
  codeTest
} from '@/components/utils'
import Subform from './Subform'
const FormItem = Form.Item;

function getSize(size) {
  const clienWidth = document.documentElement.clientWidth / 40
  return Math.floor(size * clienWidth)
}
class SubscriptionForm extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      orderInfo: {},
      addr: "",
      animating: true,
      showmask: false,
      loading: false,
      visible: false,
      datasrue: false
    }
  }
  componentDidMount() {
    this.getOrder()
  }
  getOrder = () => {
      var order = this.props.location.state.order;
      axios.get("/kc/wallet/order/" + order, {
          headers: {
            "authorization": sessionStorage.getItem("authorization")
          }
        })
        .then(res => {
          if (res) {
            this.setState({
              datasrue: true
            })
          }
          if (res.data.code == '100103') {
            window.location.href = "/kuangfront_pc/login";
          } else if (res.data.code == '100200') {
            var res = res.data.data;
            var orderInfo = {...this.state.orderInfo
            };
            orderInfo = res;
            orderInfo.create_time = showDatetime(res.create_time);
            this.setState({
              orderInfo: orderInfo,
              addr: res.address
            })
          } else if (res.data.code == "100102") {
            message.error(res.data.msg, 1.5);
          } else {
            codeTest(this.props, res.data.code)
          }

        })
    }
    //点击复制
  copyUrl = () => {
    copy(this.state.addr);
    message.success(this.props.intl.formatMessage({
      id: 'Replicating'
    }), 1);
  }
  statusfun = (status) => {
    switch (status) {
      case 0:
      case "0":
        return <span className="noPay"  style={{color:"#f10"}}><FormattedMessage
                                                id='changeStatus2'
                                                defaultMessage = "未付款"
                                            /></span>;
      case 1:
      case "1":
        return <span className="toexamine" style={{color:"#f10"}}><FormattedMessage
                                                id='changeStatus3'
                                                defaultMessage = "已付款,待审核"
                                            /></span>;
      case 2:
      case "2":
        return <span className="complete" style={{color:"#ff8d1f"}}><FormattedMessage
                                                id='finish'
                                                defaultMessage = "完成"
                                            /></span>;
      case 3:
      case "3":
        return <span className="cancel" style={{color:"#9496a3"}}><FormattedMessage
                                                id='changeStatus5'
                                                defaultMessage = "取消"
                                            /></span>;
      case 4:
      case "4":
        return <span className="autocancel" style={{color:"#9496a3"}}><FormattedMessage
                                                id='tradeState5'
                                                defaultMessage = "自动取消"
                                            /></span>;
    }
  }
  cancelOrder = () => {
    var order = this.props.location.state.order;
    var _this = this;
    Modal.confirm({
      title: this.props.intl.formatMessage({
        id: 'cantit'
      }),
      okText: this.props.intl.formatMessage({
        id: 'ok'
      }),
      cancelText: this.props.intl.formatMessage({
        id: 'no'
      }),
      onOk() {
        axios.delete("/kc/wallet/order/" + order, {
            headers: {
              "authorization": sessionStorage.getItem("authorization")
            }
          })
          .then(res => {
            if (res.data.code == '100103') {
              window.location.href = "/kuangfront_pc/login";
            } else if (res.data.code == '100200') {
              message.success(_this.props.intl.formatMessage({
                id: 'success2'
              }), 1.5);
              setTimeout(() => {
                window.location.reload();
              }, 1000)

            } else if (res.data.code == "100102") {
              message.error(res.data.msg, 1.5);
            } else {
              codeTest(this.props, res.data.code)
            }
          })
      },
      onCancel() {
        console.log("取消")
      },
    });
  }
  gotoSure = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    this.setState({
      loading: true
    });
    setTimeout(() => {
      this.setState({
        loading: false,
        visible: false
      });
    }, 3000);
  }
  handleCancel = () => {
    this.setState({
      visible: false
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

    var orderInfo = this.state.orderInfo;

    return (
      <div className="kc_wallets">
      <div className="kc_transfer kc_subscription" >
          <div><i className="icon iconfont icon-liebiao"></i><FormattedMessage
                                id='orderinfo'
                                defaultMessage = "订单详情"
                            /> </div>
           
          {
            this.state.datasrue?
              <div className="kc_transferto">
                <div className="kc_subinfo">
                  <h3><FormattedMessage
                                id='subscriptions'
                                defaultMessage = "认购"
                            /> {orderInfo.currency}</h3>
                  <p><FormattedMessage
                          id='totla_amount'
                          defaultMessage = "总金额"
                      /><span className="kc_strong">{orderInfo.base_amount} {orderInfo.base}</span></p>
                  <p><FormattedMessage
                          id='sellAmount'
                          defaultMessage = "数量"
                      /><span>{orderInfo.currency_amount} {orderInfo.currency}</span></p>
                  <p><FormattedMessage
                          id='order'
                          defaultMessage = "订单号"
                      /><span>{orderInfo.order}</span></p>
                  <p><FormattedMessage
                          id='Proportion'
                          defaultMessage = "兑换比例"
                      /><span>1 {orderInfo.base} = {orderInfo.exchange} {orderInfo.currency}</span></p>
                  <p><FormattedMessage
                          id='recharge_time'
                          defaultMessage = "时间"
                      /><span>{orderInfo.create_time}</span></p>
                  <p><FormattedMessage
                                id='recharge_state'
                                defaultMessage = "状态"
                            /><span>{this.statusfun(orderInfo.status)}</span></p>
                   {
                           orderInfo.status == "0"?
                           <div className="subinfo_form">
                                 <p><FormattedMessage
                                      id='add'
                                      defaultMessage = "地址"
                                  /><span>{orderInfo.address}</span></p>
                              <section className="addr_img" onClick={this.copyUrl}>
                                   {this.state.addr ?
                                              <QRCode value={this.state.addr} size={getSize(20)} /> :
                                              null
                                           }
                              </section> 
                          </div>:null
                     }
                     {
                            orderInfo.status == "0"?
                                <div className="kc_foot">
                                        <Button   onClick={this.cancelOrder}><FormattedMessage
                                    id='appealcancel'
                                    defaultMessage = "取消"
                                /></Button>
                                        <Button  type="primary" onClick={this.gotoSure}><FormattedMessage
                                    id='payFinish'
                                    defaultMessage = "支付完成"
                                /></Button>
                                </div>:null
                         }
                </div>
                  <Modal
                    visible={this.state.visible}
                    title=""
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                  >
                   <Subform order={this.props.location.state.order}/>
                  </Modal>
                 
              </div>: <div className="kc_transferto kc_spin">
                <Spin />
              </div>
          }
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