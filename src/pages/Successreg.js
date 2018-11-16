import React from 'react'
import {
    Link,
} from 'react-router-dom'
import {
    Form,
    Input,
    Button,
    message,
} from 'antd';
import {
    injectIntl,
    intlShape,
    FormattedMessage
} from 'react-intl';

import '@/style/Successreg.less'


class Successreg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }

    }


    componentWillMount() {

    }
    componentWillUnmount() {

    }
    componentDidMount() {
        // this.autoFocusInst.focus();
        var resize = function() {
            var clientHeight = document.documentElement.clientHeight;
            var Login_box = document.getElementsByClassName("login_box")[0];
            if (Login_box) {
                Login_box.style.height = (clientHeight) + "px";
            }
        };
        window.addEventListener ? window.addEventListener('resize', resize) : window.attachEvent('resize', resize);
        resize();
    }


    render() {
        return (
            <div className="login_box">
            <div className="login" >
            <div className="kc_loginbox kc_successreg">
                <div className="kc_login kc_reginfo">  
                         <i className="icon iconfont icon-chenggong"></i>  <span className="kc_regtit"><FormattedMessage
                            id='ito_sucessreg'
                            defaultMessage="恭喜您，注册成功。"
                        /><Link to={'/kuangfront_pc/login'}><span> <FormattedMessage
                            id='login2'
                            defaultMessage="点击登录"
                        /></span></Link></span>
                 </div>
            </div>
               </div>
            </div>
        );
    }
}
Successreg.propTypes = {
    intl: intlShape.isRequired
}
export default injectIntl(Successreg);