import React from 'react'
import {
    Menu,
} from 'antd';
import {
    Link,
} from 'react-router-dom'
import Account from '@/components/Account'
import '@/style/Mywallet.less'
import {
    PrivateRoute
} from '@/components/common'
import {
    injectIntl,
    intlShape,
    FormattedMessage
} from 'react-intl';
import Switchto from '@/pages/mineral/Switchto'
import Attrecord from '@/pages/mineral/Attrecord'
import Profit from '@/pages/mineral/Profit'
import Attorn from '@/pages/mineral/Attorn'
import Transfer from '@/pages/transfer/Transfer'
import TransferlnStation from '@/pages/transfer/TransferlnStation'
import Subscription from '@/pages/sub/Subscription'
import Subrecord from '@/pages/sub/Subrecord'
import Subinfo from '@/pages/sub/Subinfo'
import Password from '@/pages/my/Password'
import Fund from '@/pages/my/Fund'
import Extend from '@/pages/my/Extend'
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
class Mywallet extends React.Component {
    constructor(props) {
        super(props);
        var current = '1';
        var openKeys = [];
        if (this.props.location.state) {
            current = this.props.location.state.selected;
            openKeys = [this.props.location.state.open];
        }
        this.state = {
            current: current,
            openKeys: openKeys,

        }
    }
    componentDidMount() {
        var url = window.location.href;

        if (url.indexOf("/switchto") > 0 || url.indexOf("/attorn")) {
            this.setState({
                openKeys: ["sub2"],
                current: "3"
            });
        }
        if (url.indexOf("/attrecord") > 0) {
            this.setState({
                openKeys: ["sub2"],
                current: "4"
            });
        }
        if (url.indexOf("/profit") > 0) {
            this.setState({
                openKeys: ["sub2"],
                current: "5"
            });
        }
        if (url.indexOf("/subscription") > 0 || url.indexOf("/subinfo") > 0) {
            this.setState({
                openKeys: ["sub1"],
                current: "1"
            });
        }
        if (url.indexOf("/subrecord") > 0) {
            this.setState({
                openKeys: ["sub1"],
                current: "2"
            });
        }
        if (url.indexOf("/transfer") > 0) {
            this.setState({
                openKeys: ["sub3"],
                current: "6"
            });
        }
        if (url.indexOf("/transferlnStation") > 0) {
            this.setState({
                openKeys: ["sub3"],
                current: "7"
            });
        }
        if (url.indexOf("/password") > 0) {
            this.setState({
                openKeys: ["sub4"],
                current: "8"
            });
        }
        if (url.indexOf("/fund") > 0) {
            this.setState({
                openKeys: ["sub4"],
                current: "9"
            });
        }
        if (url.indexOf("/extend") > 0) {
            this.setState({
                openKeys: ["sub5"],
                current: "10"
            });
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.location.state) {
            this.setState({
                current: nextProps.location.state.selected,
                openKeys: [nextProps.location.state.open]
            })
        }
    }
    handleClick = (e) => {
        this.setState({
            current: e.key,
            openKeys: e.keyPath
        });
    }
    onOpenChange = (openKeys) => {
        const state = this.state;
        const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
        const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

        let nextOpenKeys = [];
        if (latestOpenKey) {
            nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
        }
        if (latestCloseKey) {
            nextOpenKeys = this.getAncestorKeys(latestCloseKey);
        }
        this.setState({
            openKeys: nextOpenKeys
        });
    }
    getAncestorKeys = (key) => {
        const map = {
            sub10: ['sub9'],
        };
        return map[key] || [];
    }
    render() {
        return (
            <div className="kc_wallet">
                <div className="kc_walletleft">
                    <Menu
                        onClick={this.handleClick}
                        style={{ width: 200 }}
                        defaultSelectedKeys={this.state.openKeys}
                        defaultOpenKeys={[this.state.current]}
                        openKeys={this.state.openKeys}
                        selectedKeys={[this.state.current]}
                        onOpenChange={this.onOpenChange}
                        mode="inline"
                      >
                        <SubMenu key="sub1" title={<FormattedMessage
                            id='subscription'
                            defaultMessage="认购"
                        />}>
                          <Menu.Item key="1"><Link to="/kuangfront_pc/mywallet/subscription"><FormattedMessage
                            id='subscription'
                            defaultMessage="认购"
                        /></Link></Menu.Item>
                          <Menu.Item key="2"><Link to="/kuangfront_pc/mywallet/subrecord"><FormattedMessage
                            id='subRecord'
                            defaultMessage="认购记录"
                        /></Link></Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" title={<FormattedMessage
                            id='coinSet'
                            defaultMessage="矿池管理"
                        />}>
                          <Menu.Item key="3"><Link to="/kuangfront_pc/mywallet/switchto"><FormattedMessage
                            id='turnin'
                            defaultMessage="转入"
                        /></Link></Menu.Item>
                          <Menu.Item key="4"><Link to="/kuangfront_pc/mywallet/attrecord"><FormattedMessage
                            id='turnRecord'
                            defaultMessage="转让记录"
                        /></Link></Menu.Item>
                          <Menu.Item key="5"><Link to="/kuangfront_pc/mywallet/profit"><FormattedMessage
                            id='Profit'
                            defaultMessage="收益"
                        /></Link></Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub3" title={<FormattedMessage
                            id='rotation'
                            defaultMessage="互转"
                        />}>
                          <Menu.Item key="6"><Link to="/kuangfront_pc/mywallet/transfer"><FormattedMessage
                            id='Crossrotation'
                            defaultMessage="平台内互转"
                        /></Link></Menu.Item>
                          <Menu.Item key="7"><Link to="/kuangfront_pc/mywallet/transferlnStation"><FormattedMessage
                            id='rotaRecord'
                            defaultMessage="内转记录"
                        /></Link></Menu.Item>
                        </SubMenu>
                         <SubMenu key="sub4" title={<FormattedMessage
                            id='safe'
                            defaultMessage="账户安全"
                        />}>
                          <Menu.Item key="8"><Link to="/kuangfront_pc/mywallet/password"><FormattedMessage
                            id='loginpwd'
                            defaultMessage="登录密码"
                        /></Link></Menu.Item>
                          <Menu.Item key="9"><Link to="/kuangfront_pc/mywallet/fund"><FormattedMessage
                            id='payPwd'
                            defaultMessage="资金密码"
                        /></Link></Menu.Item>
                        </SubMenu>
                         <SubMenu key="sub5" title={<FormattedMessage
                            id='myPublice'
                            defaultMessage="我的推荐"
                        />}>
                          <Menu.Item key="10"><Link to="/kuangfront_pc/mywallet/extend"><FormattedMessage
                            id='myPublice'
                            defaultMessage="我的推荐"
                        /></Link></Menu.Item>
                        </SubMenu>
                      </Menu>
                </div>    
                <div className="kc_walletright">
                    <Account />
                    <div className="kc_walletInfo">
                        <PrivateRoute path="/kuangfront_pc/mywallet/switchto" component={Switchto}  />
                        <PrivateRoute path="/kuangfront_pc/mywallet/attrecord" component={Attrecord}  />
                        <PrivateRoute path="/kuangfront_pc/mywallet/profit" component={Profit}  />
                        <PrivateRoute path="/kuangfront_pc/mywallet/attorn" component={Attorn}  />
                        <PrivateRoute path="/kuangfront_pc/mywallet/transfer" component={Transfer}  />
                        <PrivateRoute path="/kuangfront_pc/mywallet/transferlnStation" component={TransferlnStation}  />
                        <PrivateRoute path="/kuangfront_pc/mywallet/subscription" component={Subscription}  />
                        <PrivateRoute path="/kuangfront_pc/mywallet/subrecord" component={Subrecord}  />
                        <PrivateRoute path="/kuangfront_pc/mywallet/subinfo" component={Subinfo}  />
                        <PrivateRoute path="/kuangfront_pc/mywallet/password" component={Password}  />
                        <PrivateRoute path="/kuangfront_pc/mywallet/fund" component={Fund}  />
                        <PrivateRoute path="/kuangfront_pc/mywallet/extend" component={Extend}  />
                    </div>
                </div>    
            </div>
        )
    }
}
Mywallet.propTypes = {
    intl: intlShape.isRequired
}
export default injectIntl(Mywallet);