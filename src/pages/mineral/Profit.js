import React from 'react'
import '@/style/Attrecord.less'
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
} from '@/components/utils';
class Profit extends React.Component {
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
    this.getTrades(1)
  }
  getTrades = (page) => {
    axios.get("/kc/wallet/FET/mining", {
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
          message.error(res.data.msg, 1);
        }
      })
  }
  changeStatus = (desc) => {
    if (desc == "mining") {
      return <FormattedMessage
                        id='Miningprofit'
                        defaultMessage = "挖矿收益"
                       />;
    } else if (desc == "share") {

      return <FormattedMessage
                        id='Personal'
                        defaultMessage = "个人推广算力"
                       />;
    } else {
      return <FormattedMessage
                        id='Promotion'
                        defaultMessage = "竞赛推广算力"
                       />;
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
    let columns;
    if (this.state.language == "zh-CN") {
      columns = [{
        title: '币种',
        dataIndex: 'currency',
        render: text => <p><strong>{text}</strong></p>,
        width: '20%',
      }, {
        title: '数量',
        dataIndex: 'amount',
        width: '20%',
      }, {
        title: '类型',
        dataIndex: 'desc',
        render: (text, record, index) => {
          return (
            <p key={index}>
              {this.changeStatus(record.desc)}
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
          id: 'currency'
        }),
        dataIndex: 'currency',
        render: text => <p><strong>{text}</strong></p>,
        width: '20%',
      }, {
        title: this.props.intl.formatMessage({
          id: 'sellAmount'
        }),
        dataIndex: 'amount',
        width: '20%',
      }, {
        title: this.props.intl.formatMessage({
          id: 'type'
        }),
        dataIndex: 'desc',
        render: (text, record, index) => {
          return (
            <p key={index}>
              {this.changeStatus(record.desc)}
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

      <div className="kc_attrecord"  ref={node => this.node = node}>
             <Table columns={columns}
                rowKey={record => record.create_time}
                dataSource={this.state.dataList}
                pagination={this.state.pagination}
                onChange={this.handleTableChange}
                loading={this.state.loading}
              />
      </div>
         
      </div>
    )
  }
}
Profit.propTypes = {
  intl: intlShape.isRequired
}
export default injectIntl(Profit);