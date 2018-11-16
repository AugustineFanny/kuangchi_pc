import React from 'react'
import {
  Link
} from 'react-router-dom'
import {
  Select,
  Menu,
  Dropdown,
  Icon
} from 'antd';
import '@/style/Header.less'
import PubSub from 'pubsub-js';
import axios from 'axios'
import {
  injectIntl,
  intlShape,
  FormattedMessage
} from 'react-intl';
const Option = Select.Option;
let username = sessionStorage.getItem("username");
class Header extends React.Component {
  constructor(props) {
    super(props);
    let language;
    if (sessionStorage.getItem("language")) {
      language = sessionStorage.getItem("language")
    } else {
      language = "EN"
    }
    this.state = {
      language: language,
    }
  }
  componentDidMount() {
    if (sessionStorage.getItem("language")) {
      this.setState({
        language: sessionStorage.getItem("language")
      })
    }
  }
  logOut = () => {
    axios.get('/kc/logout')
      .then((res) => {
        if (res.data.code == '100200') {
          setTimeout(() => {
            window.location.href = "/kuangfront_pc/login";
          }, 1000)
          sessionStorage.removeItem('authorization');
          sessionStorage.removeItem('username');
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  handleChange = (e) => {
    var value = e.key;
    PubSub.publish('language', value);
    sessionStorage.setItem("lang", value);　
    switch (value) {
      case "zh-CN":
        sessionStorage.setItem("language", "CN");
        this.setState({
          language: "CN"
        })
        break;
      case "en-US":
        sessionStorage.setItem("language", "EN");
        this.setState({
          language: "EN"
        })
        break;
        //   case "ko":
        //     sessionStorage.setItem("language", "KO");
        //     break;
        //   case "ja":
        //     sessionStorage.setItem("language", "JA");
        //     break;
    }


  }
  render() {
    const {
      intl
    } = this.props;
    var guoqi;
    switch (this.props.intl.locale) {
      case 'en-US':
        guoqi = (<img src={require('../img/english.png')} alt=""/>);
        break;
      case 'zh-CN':
        guoqi = (<img src={require('../img/china.png')} alt=""/>);
        break;
        // case 'ko':
        //     guoqi = (<img src={require('../img/korea.png')} alt=""/>);
        //     break;
        // case 'ja':
        //     guoqi = (<img src={require('../img/japan.png')} alt=""/>);
        //     break;
    }
    const lang = (
      <Menu className="kc_langbtn"  onClick={this.handleChange}>
            <Menu.Item key="zh-CN">
               <img style={{width:"17px",height:"17px"}} src={require('../img/china.png')} alt=""/><span>CN</span>
            </Menu.Item>
            <Menu.Item key="en-US">
              <img style={{width:"17px",height:"17px"}}  src={require('../img/english.png')} alt=""/><span>EN</span>
            </Menu.Item>
          </Menu>
    );
    let value = sessionStorage.getItem("authorization");
    let username = sessionStorage.getItem("username");
    return (
      <div className="kc_header">
                <div className="kc_head">
                   <Link  to={{pathname:"/kuangfront_pc/mywallet/subscription", state: {open:"sub1", selected:"1"}}}> <h1>FADAX</h1></Link>
                    <div className="kc_login">
                    {
                      value?
                      <div className="kc_allogin">
                          <span className="kc_user"> {username} </span>
                      </div>:
                      <div>
                        <Link  to="/kuangfront_pc/register"><FormattedMessage
                            id='register'
                            defaultMessage="注册"
                        /></Link> 
                        <Link  to="/kuangfront_pc/login"><FormattedMessage
                            id='login'
                            defaultMessage="登录"
                        /></Link> 
                      </div>

                    }
                   <div className="country">{ guoqi }</div>
                    <div>
                         <Dropdown overlay={lang} trigger={['click']} >
                            <a className="kc_my" href="#">
                              {this.state.language} <Icon type="down" />
                            </a>
                          </Dropdown>
                    </div>
                     {
                      value?
                      <div className="kc_allogin">
                          <span><i onClick={this.logOut} className="icon iconfont icon-logout"></i></span>
                      </div>:null
                    }
                    </div>
                </div>
            </div>
    )
  }
}
Header.propTypes = {
  intl: intlShape.isRequired
}
export default injectIntl(Header);