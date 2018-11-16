import React from 'react'
import '@/style/Subinfo.less'
import {
  message,
  Table,
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
  codeTest
} from '@/components/utils';
import {
  Redirect
} from 'react-router-dom'
class Subrecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: sessionStorage.getItem("username"),
      dataList: [],
      pagination: {},
      language: this.props.intl.locale,
      loading: true,
      status: 0,
      gotoSure: false
    }
  }
  componentDidMount() {
    this.getTrades(1)
  }
  getTrades = (page) => {
    axios.get("/kc/wallet/orders", {
        params: {
          page: page,
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
  handleRowClick = (record, index, event) => {
    console.log(record)
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

  handleTableChange = (pagination, filters, sorter) => {

    this.setState({
      pagination
    });
    this.getTrades(pagination.current);
    this.node.scrollIntoView();
  }
  render() {
    const {
      intl
    } = this.props;
    const getMessage = intl.messages;
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
    let columns;
    if (this.state.language == "zh-CN") {
      columns = [{
        title: '订单号',
        dataIndex: 'order',
        render: text => <p><strong>{text}</strong></p>,
        width: '15%',
      }, {
        title: '状态',
        dataIndex: 'status',
        render: text => <p>{this.statusfun(text)}</p>,
        width: '8%',
      }, {
        title: '兑换比例',
        dataIndex: 'exchange',
        render: (text, record, index) => {
          return (
            <p key={index}>
             1 {record.base} = {record.exchange} {record.currency}
          </p>
          )
        },
        width: '15%',
      }, {
        title: '数量',
        dataIndex: 'amount',
        render: (text, record, index) => {
          return (
            <p key={index}>
            {record.currency_amount} {record.currency}
          </p>
          )
        },
        width: '10%',
      }, {
        title: '总金额',
        dataIndex: 'base_amount',
        render: (text, record, index) => {
          return (
            <p key={index}>
             {record.base_amount} {record.base}
          </p>
          )
        },
        width: '7%',
      }, {
        title: '时间',
        dataIndex: 'create_time',
        render: text => <p>{showDatetime(text)}</p>,
        width: '10%',
      }]
    } else if (this.state.language == "en-US") {
      columns = [{
        title: this.props.intl.formatMessage({
          id: 'order'
        }),
        dataIndex: 'order',
        render: text => <p><strong>{text}</strong></p>,
        width: '15%',
      }, {
        title: this.props.intl.formatMessage({
          id: 'recharge_state'
        }),
        dataIndex: 'status',
        render: text => <p>{this.statusfun(text)}</p>,
        width: '8%',
      }, {
        title: this.props.intl.formatMessage({
          id: 'Proportion'
        }),
        dataIndex: 'exchange',
        render: (text, record, index) => {
          return (
            <p key={index}>
             1 {record.base} = {record.exchange} {record.currency}
          </p>
          )
        },
        width: '15%',
      }, {
        title: this.props.intl.formatMessage({
          id: 'sellAmount'
        }),
        dataIndex: 'amount',
        render: (text, record, index) => {
          return (
            <p key={index}>
            {record.currency_amount} {record.currency}
          </p>
          )
        },
        width: '10%',
      }, {
        title: this.props.intl.formatMessage({
          id: 'totla_amount'
        }),
        dataIndex: 'base_amount',
        render: (text, record, index) => {
          return (
            <p key={index}>
             {record.base_amount} {record.base}
          </p>
          )
        },
        width: '7%',
      }, {
        title: this.props.intl.formatMessage({
          id: 'recharge_time'
        }),
        dataIndex: 'create_time',
        render: text => <p>{showDatetime(text)}</p>,
        width: '10%',
      }]
    }


    return (
      <div className="kc_wallets">

      <div className="kc_attrecord kc_subrecord"  ref={node => this.node = node}>
             <Table columns={columns}
                rowKey={record => record.id}
                dataSource={this.state.dataList}
                pagination={this.state.pagination}
                onChange={this.handleTableChange}
                loading={this.state.loading}
                onRow={(record) => {
                return {
                  onClick: () => {
                    this.setState({
                      order: record.order,
                      gotoSure: true
                    })
                  },     
                };
              }}
              />
      </div>
      </div>
    )
  }
}
Subrecord.propTypes = {
  intl: intlShape.isRequired
}
export default injectIntl(Subrecord);