import React from 'react'
import {
  Table,
  Button,
  message,
} from 'antd';
import '@/assets/iconfont/iconfont.css'
import {
  Link,
  Redirect
} from 'react-router-dom'
import axios from 'axios';
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

function showStatus(status) {
  if (status == '0') {
    return (<p style={{color: 'red'}}><FormattedMessage
                            id="active"
                        /></p>);
  } else {
    return (<FormattedMessage
                            id="unactivated"
                        />);
  }
}
class Poolrecord extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      username: sessionStorage.getItem("username"),
      dataList: [],
      pagination: {},
      language: this.props.intl.locale,
      loading: true,
      id: "",
      amount: null,
      redirect: false,
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.getTrades(pagination.current);
  }
  getTrades = (page, status) => {
    axios.get("/kc/wallet/FET/locked", {
        headers: {
          "authorization": sessionStorage.getItem("authorization")
        }
      })
      .then(res => {
        if (res.data.code == '100103') {
          window.location.href = "/kuangfront_pc/login";
        } else if (res.data.code == '100200') {
          this.setState({
            dataList: res.data.data,
            loading: false
          });
        } else {
          codeTest(this.props, res.data.code);
        }
      })
  }
  componentDidMount() {
    this.getTrades(1);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      language: nextProps.intl.locale
    });
  }
  toAttorn = (record) => {
    this.setState({
      id: record.id,
      amount: record.amount,
      redirect: true
    })
  }
  render() {
    const {
      intl
    } = this.props;
    const getMessage = intl.messages;
    if (this.state.redirect) {
      return <Redirect push to = {
        {
          pathname: "/kuangfront_pc/mywallet/attorn",
          state: {
            id: this.state.id,
            amount: this.state.amount
          }
        }
      }
      />;
    }
    let columns;
    if (this.state.language == "zh-CN") {
      columns = [{
        title: '数量',
        dataIndex: 'total_amount',
        render: (text, record, index) => {
          return (
            <p key={index}>
                    {record.amount} / {record.total_amount}
                </p>
          )
        },
        width: '20%',
      }, {
        title: '已解锁',
        dataIndex: 'unlock_num',
        render: (text, record, index) => {
          return (
            <p key={index}>
               {
                record.status == "2"?<span>-</span>:<span>{record.unlock_num} / 10</span>
               }     
          </p>
          )
        },
        width: '15%',
      }, {
        title: '解冻时间',
        dataIndex: 'expire_date',
        render: text => <p>{showDate(text)}</p>,
        width: '20%',
      }, {
        title: '时间',
        dataIndex: 'create_time',
        render: text => <p>{showDatetime(text)}</p>,
        width: '20%',
      }, {
        title: '注释',
        dataIndex: 'status',
        render: (text, record, index) => {
          return (
            <p key={index}>
               {
                record.status == "2"?
                <FormattedMessage
                    id='outSuc'
                    defaultMessage = "已转让"
                />:<span>-</span>
               } 
          </p>
          )
        },
        width: '15%',
      }, {
        title: '操作',
        dataIndex: 'id',
        render: (text, record, index) => {
          return (
            <p key={index}>
              {
                record.status == "2"?<span>-</span>:<Button className="ad_btn" size="small" onClick={this.toAttorn.bind(this,record)}><FormattedMessage
                    id='turnother'
                    defaultMessage = "转让"
                /></Button>
              }
          </p>
          )
        },
      }]
    } else if (this.state.language == "en-US") {
      columns = [{
        title: this.props.intl.formatMessage({
          id: 'sellAmount'
        }),
        dataIndex: 'total_amount',
        render: (text, record, index) => {
          return (
            <p key={index}>
                    {record.amount} / {record.total_amount}
                </p>
          )
        },
        width: '20%',
      }, {
        title: this.props.intl.formatMessage({
          id: 'Unlocked'
        }),
        dataIndex: 'unlock_num',
        render: (text, record, index) => {
          return (
            <p key={index}>
               {
                record.status == "2"?<span>-</span>:<span>{record.unlock_num} / 10</span>
               }     
          </p>
          )
        },
        width: '15%',
      }, {
        title: this.props.intl.formatMessage({
          id: 'ice_out'
        }),
        dataIndex: 'expire_date',
        render: text => <p>{showDate(text)}</p>,
        width: '20%',
      }, {
        title: this.props.intl.formatMessage({
          id: 'recharge_time'
        }),
        dataIndex: 'create_time',
        render: text => <p>{showDatetime(text)}</p>,
        width: '20%',
      }, {
        title: this.props.intl.formatMessage({
          id: 'Notes'
        }),
        dataIndex: 'status',
        render: (text, record, index) => {
          return (
            <p key={index}>
               {
                record.status == "2"?
                <FormattedMessage
                    id='outSuc'
                    defaultMessage = "已转让"
                />:<span>-</span>
               } 
          </p>
          )
        },
        width: '15%',
      }, {
        title: this.props.intl.formatMessage({
          id: 'Operation'
        }),
        dataIndex: 'id',
        render: (text, record, index) => {
          return (
            <p key={index}>
              {
                record.status == "2"?<span>-</span>:<Button className="ad_btn" size="small" onClick={this.toAttorn.bind(this,record)}><FormattedMessage
                    id='turnother'
                    defaultMessage = "转让"
                /></Button>
              }
          </p>
          )
        },
      }]
    }

    return (
      <div className="kc_porecord">
           <div><i className="icon iconfont icon-jilu"></i><FormattedMessage
                    id='record'
                    defaultMessage = "记录"
                /></div>
            <Table columns={columns}
                    rowKey={record => record.id}
                    dataSource={this.state.dataList}
                    pagination={false}
                    onChange={this.handleTableChange}
                    loading={this.state.loading}
                  />
      </div>
    )
  }
}
Poolrecord.propTypes = {
  intl: intlShape.isRequired
}
export default injectIntl(Poolrecord);