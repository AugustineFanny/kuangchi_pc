import React from 'react'
import '@/style/Account.less'
import axios from 'axios'
import {
  limitAmount
} from './utils'
import {
  message,
} from 'antd';
import {
  injectIntl,
  intlShape,
  FormattedMessage
} from 'react-intl';
class Account extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {},
      profit: {}
    }
  }
  componentDidMount() {
    this.getAmount();
    var url = window.location.href;
    if (url.indexOf("/kuangfront_pc/mywallet/profit") > 0) {
      this.getProfit()
    }
  }
  componentWillReceiveProps(nextProps) {
    this.getAmount();
    this.getProfit();
  }
  getProfit = () => {
    axios.get("/kc/wallet/FET/mining-stat", {
        headers: {
          "authorization": sessionStorage.getItem("authorization")
        }
      })
      .then(res => {
        if (res.data.code == '100103') {
          window.location.href = "/kuangfront_pc/login";
        } else if (res.data.code == '100200') {

          this.setState({
            profit: res.data.data
          })
        } else {
          message.error(res.data.msg, 1);
        }
      })
  }
  getAmount = () => {
    axios.get('/kc/wallet/finance', {
        params: {
          currency: "FET"
        },
        headers: {
          "Content-Type": "application/json",
          "authorization": sessionStorage.getItem("authorization")
        }
      })
      .then(res => {
        var res = res.data.data;
        res[0].current = limitAmount(res[0].amount - res[0].lock_amount);
        res[0].mining_amount = limitAmount(res[0].mining_amount);
        this.setState({
          data: res[0]
        })
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  showAmount = (amount) => {
    if (amount == null) {
      return 0;
    } else {
      return limitAmount(parseFloat(amount));
    }
  }
  render() {
    var url = window.location.href;
    let content;
    if (url.indexOf("/kuangfront_pc/mywallet/profit") > 0) {
      content = (
        <div className="kc_account">
              <div className="kc_amount" id="kc_profit1"> 
          <div>
          <FormattedMessage
                tagName="h3"
                id='earnings'
                defaultMessage="昨日收益"
            />
                <p className="kc_line"></p>
                <p className="kc_num">{this.showAmount(this.state.profit.yesterday)} FET</p>
                <div className="icon">
                    <img src={require('@/img/bg_expect.png')} alt=""/>
                </div>
          </div></div>  
          <div className="kc_amount" id="kc_profit2"> 
          <div>
          <FormattedMessage
                tagName="h3"
                id='monthearnings'
                defaultMessage="本月收益"
            />
                <p className="kc_line"></p>
                <p className="kc_num">{this.showAmount(this.state.profit.month)} FET</p>
                <div className="icon">
                    <img src={require('@/img/bg_history.png')} alt=""/>
                </div>
          </div></div>  
         </div>
      )
    } else if (url.indexOf("/extend") > 0 || url.indexOf("/fund") > 0 || url.indexOf("/password") > 0) {
      content = (null)
    } else {
      content = (
        <div className="kc_account">
          <div className="kc_amount">
              <div>
              <FormattedMessage
                tagName="h3"
                id='Activeaccount'
                defaultMessage="活动账户"
            />
                <p className="kc_line"></p>
                <p className="kc_num">{this.state.data.current} FET</p>
                <div className="icon">
                    <img src={require('@/img/bg_integral.png')} alt=""/>
                </div>
              </div>
          </div>  
          <div className="kc_amount"> 
          <div>
          <FormattedMessage
                tagName="h3"
                id='Numbercoins'
                defaultMessage="矿池币数"
            />
                <p className="kc_line"></p>
                <p className="kc_num">{this.state.data.mining_amount} FET</p>
                <div className="icon">
                    <img src={require('@/img/bg_ranking.png')} alt=""/>
                </div>
          </div></div>  
          
      </div>
      )
    }
    return (
      <div>{content}</div>
    )
  }
}
Account.propTypes = {
  intl: intlShape.isRequired
}
export default injectIntl(Account);