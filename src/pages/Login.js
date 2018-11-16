import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
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
import axios from 'axios'
import {
    fakeAuth,
    codeTest
} from '@/components/utils'
import '@/style/Login.less'
const FormItem = Form.Item;
const error = (msg) => {
    message.error(msg);
};

class NormalLoginForm extends React.Component {
    constructor(props) {
        var token = sessionStorage.getItem("authorization");
        var aa;
        super(props);
        if (token) {
            aa = true
        } else {
            aa = false
        }
        this.state = {
            redirectToReferrer: aa,
            img: "/kc/captcha/code?_=" + Date.now()

        }
        this.changeCode = this.changeCode.bind(this)

    }

    login = () => {
        fakeAuth.authenticate(() => {
            this.setState({
                redirectToReferrer: true
            });
        });
    };
    //改变验证码
    changeCode() {
        this.setState({
            img: "/kc/captcha/code?_=" + Date.now()
        })
    }
    componentWillMount() {
        // this._isMounted = true;
        var token = sessionStorage.getItem("authorization");
        if (token) {
            fakeAuth.authenticate(() => {
                this.setState({
                    redirectToReferrer: true
                });
            });

        }
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
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
    componentWillReceiveProps(nextProps) {
        var token = sessionStorage.getItem("authorization");
        if (token) {
            fakeAuth.authenticate(() => {
                this.setState({
                    redirectToReferrer: true
                });
            });
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                axios.post("/kc/login", values, {}, {
                        headers: {
                            "Content-Type": "application/json",
                            // "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MTAyMjY0NTEsImlzcyI6InZrYmNlbCJ9.6SyUXqXOsJomDOxa0J-f_LTy5Et7Jn3jQnUs3WaOiJ4"
                        }
                    })
                    .then(res => {
                        if (res.data.code == '100200') {
                            var value = res.headers.authorization;

                            message.success(this.props.intl.formatMessage({
                                id: "successLogin"
                            }));
                            setTimeout(() => {
                                    sessionStorage.setItem("authorization", value);
                                    sessionStorage.setItem("username", res.data.data.username);
                                    fakeAuth.authenticate(() => {
                                        this.setState({
                                            redirectToReferrer: true
                                        });
                                    });
                                }, 1000)
                                // fakeAuth.authenticate(() => {
                                //     this.setState({
                                //         redirectToReferrer: true
                                //     });
                                // });
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
            from
        } = this.props.location.state || {
            from: {
                pathname: "/kuangfront_pc/mywallet/subscription"
            }
        };
        const {
            redirectToReferrer
        } = this.state;

        if (redirectToReferrer) {
            return <Redirect to={from} />;
        }
        const {
            getFieldDecorator
        } = this.props.form;
        const {
            intl
        } = this.props;
        const getMessage = intl.messages;

        const loginInput = intl.formatMessage({
            id: 'loginInput',
        });
        const loginInput2 = intl.formatMessage({
            id: 'loginInput2',
        });
        const loginInput3 = intl.formatMessage({
            id: 'loginInput3',
        });
        const login_title = intl.formatMessage({
            id: 'login_title',
        });
        const login_title2 = intl.formatMessage({
            id: 'login_title2',
        });
        const code1 = intl.formatMessage({
            id: 'code1',
        });
        return (
            <div className="login_box">
            <div className="login" >
            <div className="kc_loginbox">

                    <div className="kc_login">  
                      <Form onSubmit={this.handleSubmit}  method="post">
                             <h2 className="kc_login_top">
                             User login
                    </h2>
                    <div id="kc_login_body">
                        <section>
                            <FormItem>
                            {getFieldDecorator('ident', {
                                rules: [{
                                    required: true, message:  `${loginInput}`,
                                }]
                            })(
                                <Input placeholder={login_title}/>
                            )}
                            </FormItem>  
                        </section>
                        <section>              
                            <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: `${loginInput2}`,
                                }]
                            })(
                                <Input type="password" placeholder={login_title2}/>
                            )}
                            </FormItem>
                        </section>  
                        <section className="code">  
                            <FormItem>
                             {getFieldDecorator('code', {
                                rules: [{
                                    required: true, message: `${loginInput3}`,
                                }]
                            })(
                            <Input placeholder={code1} />
                             )}
                            <div className="codeInfo">
                                <img onClick={this.changeCode} src={this.state.img} alt=""/>
                            </div>
                            </FormItem>
                            
                        </section>  
                        <div className="kc_loginBtn">   
                        <Button type="primary" htmlType="submit" className="login-form-button">
                                 <FormattedMessage
                                id='login'
                                defaultMessage="登录"
                            />
                            </Button>                 
                        </div> 
                        <section className="otc_forget">
                           <label id="no_account"><FormattedMessage
                                id='no_account'
                                defaultMessage="还没有账号?"
                            /><Link to={'/kuangfront_pc/register'}><FormattedMessage
                                id='loginNow'
                                defaultMessage="立即注册?"
                            /></Link></label>
                            <label id="forget"><Link to={'/kuangfront_pc/forget'}><FormattedMessage
                                id='forgetPwd'
                                defaultMessage="忘记密码"
                            /></Link></label>
                        </section>
                    </div> 
                 </Form>
                 </div>
            </div>
               </div>
            </div>
        );
    }
}
const Login = Form.create()(NormalLoginForm);
Login.propTypes = {
    intl: intlShape.isRequired
}
export default injectIntl(Login);