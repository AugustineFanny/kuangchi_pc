import React from 'react'
import '@/style/Attrecord.less'
import {
  message,
  Table,
  Tabs,
} from 'antd';
import axios from 'axios'
import '@/assets/iconfont/iconfont.css'
import {
  injectIntl,
  intlShape,
  FormattedMessage
} from 'react-intl';
import {
  showDatetime,
  showDate,
  codeTest
} from '@/components/utils';
const TabPane = Tabs.TabPane;
class Attrecord extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      username: sessionStorage.getItem("username"),
      dataList: [],
      pagination: {},
      language: this.props.intl.locale,
      loading: true,
      status: 0
    }
  }
  componentDidMount() {
    this.getTrades(1, "FET", 0)
  }
  getTrades = (page, currency, direction) => {
    axios.get("/kc/wallet/inlocked", {
        params: {
          direction: direction,
          page: page,
          currency: currency
        },
        headers: {
          "authorization": sessionStorage.getItem("authorization")
        }
      })
      .then(res => {
        if (res.data.code == '100103') {
          window.location.href = "/kuangfront_pc/login";
        } else if (res.data.code == '100200') {
          const pagination = {...this.state.pagination
          };
          pagination.total = res.data.data.total_count;
          pagination.current = res.data.data.page_no;
          pagination.pageSize = res.data.data.page_size;
          this.setState({
            dataList: res.data.data.list,
            pagination: pagination,
            loading: false
          });
        } else {
          codeTest(this.props, res.data.code);
        }
      })
  }
  transfersource = (status) => {
    if (status == 0) {
      return <FormattedMessage
                                id='turnothers'
                                defaultMessage = "转账给他人"
                             />;
    } else {
      return <FormattedMessage
                                id='otherturn'
                                defaultMessage = "他人转入"
                             />;
    }
  }
  showStatus = (str, confirmations) => {
    switch (str) {
      case 0:
        var needConfirm = 1;
        for (var i in this.state.currenciesList) {
          var coin = this.state.currenciesList[i];
          if (this.state.activeKey == coin.currency)
            needConfirm = coin.confirm_num;
        }
        str = '' + confirmations + '/' + needConfirm;
        break;
      case 1:
        str = <FormattedMessage
                            id='abnormal'
                        />;
        break;
      case 2:
        str = <FormattedMessage
                            id='complete'
                        />;
        break;
      case 3:
        str = <FormattedMessage
                            id='Tobeaudited'
                        />;
        break;
      case 4:
        str = <FormattedMessage
                            id='Auditfailure'
                        />;
        break;
    }
    return str;
  }
  callback = (val) => {
    this.getTrades(1, "FET", val)
    this.setState({
      status: val
    })
  }
  handleTableChange = (pagination, filters, sorter) => {

    this.setState({
      pagination
    });
    this.getTrades(pagination.current, "FET", this.state.status);
  }
  render() {
    const {
      intl
    } = this.props;
    const getMessage = intl.messages;
    let columns;
    if (this.state.language == "zh-CN") {
      columns = [{
        title: '转账',
        dataIndex: 'status',
        render: (text, record, index) => {
          return (
            <p key={index}>
                {
                  this.state.status == 0?<span><FormattedMessage
                            id='turnperson'
                        /> {record.to}</span>:<span>{record.from} <FormattedMessage
                            id='turnin'
                        /></span>
                }
          </p>
          )
        },
        width: '20%',
      }, {
        title: '数量',
        dataIndex: 'amount',
        width: '15%',
      }, {
        title: '状态',
        dataIndex: 'expire_date',
        render: (text, record, index) => {
          return (
            <p key={index}>
              {this.showStatus(record.status, record.confirmations)}
          </p>
          )
        },
        width: '20%',
      }, {
        title: '时间',
        dataIndex: 'create_time',
        render: text => <p>{showDatetime(text)}</p>,
        width: '20%',
      }]
    } else if (this.state.language == "en-US") {
      columns = [{
        title: this.props.intl.formatMessage({
          id: 'turnpersons'
        }),
        dataIndex: 'status',
        render: (text, record, index) => {
          return (
            <p key={index}>
                {
                  this.state.status == 0?<span><FormattedMessage
                            id='turnperson'
                        /> {record.to}</span>:<span>{record.from} <FormattedMessage
                            id='turnin'
                        /></span>
                }
          </p>
          )
        },
        width: '20%',
      }, {
        title: this.props.intl.formatMessage({
          id: 'sellAmount'
        }),
        dataIndex: 'amount',
        width: '15%',
      }, {
        title: this.props.intl.formatMessage({
          id: 'recharge_state'
        }),
        dataIndex: 'expire_date',
        render: (text, record, index) => {
          return (
            <p key={index}>
              {this.showStatus(record.status, record.confirmations)}
          </p>
          )
        },
        width: '20%',
      }, {
        title: this.props.intl.formatMessage({
          id: 'recharge_time'
        }),
        dataIndex: 'create_time',
        render: text => <p>{showDatetime(text)}</p>,
        width: '20%',
      }]
    }

    return (
      <div className="kc_wallets">
      <div className="kc_attrecord">
       <Tabs defaultActiveKey="0" onChange={this.callback}>
        <TabPane tab={this.props.intl.formatMessage({
          id: 'turnout'
        })} key="0"> 
             <Table columns={columns}
                rowKey={record => record.id}
                dataSource={this.state.dataList}
                pagination={this.state.pagination}
                onChange={this.handleTableChange}
                loading={this.state.loading}
              />
        </TabPane>
        <TabPane tab={this.props.intl.formatMessage({
          id: 'turnin'
        })} key="1"> 
             <Table columns={columns}
                rowKey={record => record.id}
                dataSource={this.state.dataList}
                pagination={this.state.pagination}
                onChange={this.handleTableChange}
                loading={this.state.loading}
              />
          </TabPane>
      </Tabs>
      </div>
      </div>
    )
  }
}
Attrecord.propTypes = {
  intl: intlShape.isRequired
}
export default injectIntl(Attrecord);