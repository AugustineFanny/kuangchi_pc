import React from 'react'
// import '@/style/Subform.less'
import {
  Input,
  Form,
  message,
  Button,
  Upload,
  Icon
} from 'antd';
import axios from 'axios'
import '@/assets/iconfont/iconfont.css'
import {
  injectIntl,
  intlShape,
  FormattedMessage
} from 'react-intl';
import {
  beforeUpload,
  codeTest
} from '@/components/utils'
const FormItem = Form.Item;
class SubformForm extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false
    }
  }
  customRequest = (obj) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.setState({
        [obj.filename + "Image"]: reader.result
      })
    })
    reader.readAsDataURL(obj.file);
    this.setState({
      [obj.filename]: obj.file
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          loading: true
        })
        var formData = new FormData();
        var screenshot = this.state.screenshot;
        formData.append("hash", values["hash"]);
        formData.append("screenshot", screenshot);
        axios.post("/kc/wallet/order/" + this.props.order, formData, {
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
              }, 1500)
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
      <div className="kc_subform">
          <div className="kc_swtop">
                 <Form>
                    <FormItem
                          {...formItemLayout}
                          label={"Txid"}
                        >
                        {getFieldDecorator('hash', {
                              rules: [
                                { required: true, message: this.props.intl.formatMessage({
                                                id: 'subform_tit'
                                            })  },
                              ],
                            })(
                             <Input />
                            )}
                        </FormItem>
                         <FormItem className="qrcodeImg" 
                           {...formItemLayout}
                          label={<FormattedMessage
                        id='cuurImg'
                        defaultMessage = "打币截图"
                    />}
                         >
                        {getFieldDecorator('screenshot',{
                              rules: [
                                { required: true, message: this.props.intl.formatMessage({
                                                id: 'sunform_tit'
                                            })},
                              ],
                            })(
                             <Upload
                                className="avatar-uploader"
                                name="screenshot"
                                showUploadList={false}
                                action="//jsonplaceholder.typicode.com/posts/"
                                beforeUpload={beforeUpload}
                                customRequest={this.customRequest}
                              >
                                {
                                  this.state.screenshotImage ?
                                    <img src={this.state.screenshotImage} alt="" className="avatar" /> :
                                    <Icon type="plus" className="avatar-uploader-trigger" />
                                }
                              </Upload>
                          )}
                      </FormItem>
                        <Button loading={this.state.loading} type="primary" onClick={this.handleSubmit}><FormattedMessage
                        id='submit'
                        defaultMessage = "提交"
                    /></Button>
                 </Form>
          </div>     
          
      </div>
    )
  }
}
const Subform = Form.create()(SubformForm);
Subform.propTypes = {
  intl: intlShape.isRequired
}
export default injectIntl(Subform);