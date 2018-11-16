import React from 'react'
import '@/style/Extend.less'
import {
  message,
  Spin,
  Button,
} from 'antd';
import axios from 'axios'
import '@/assets/iconfont/iconfont.css'
import {
  injectIntl,
  intlShape,
  FormattedMessage
} from 'react-intl';
import Tree, {
  TreeNode
} from 'rc-tree';
import cssAnimation from 'css-animation';
import 'rc-tree/assets/index.css';
import QRCode from '@/components/QRCode'
import copy from 'copy-to-clipboard'
import {
  codeTest
} from '@/components/utils';

function getSize(size) {
  const clienWidth = document.documentElement.clientWidth / 40
  return Math.floor(size * clienWidth)
}

function animate(node, show, done) {
  let height = node.offsetHeight;
  return cssAnimation(node, 'collapse', {
    start() {
      if (!show) {
        node.style.height = `${node.offsetHeight}px`;
      } else {
        height = node.offsetHeight;
        node.style.height = 0;
      }
    },
    active() {
      node.style.height = `${show ? height : 0}px`;
    },
    end() {
      node.style.height = '';
      done();
    },
  });
}

function generateTreeNodes(treeNode, children) {
  const arr = [];
  const key = treeNode.props.eventKey;
  for (let i = 0; i < children.length; i++) {
    arr.push({
      name: children[i].name,
      key: `${key}-${i}`,
      isLeaf: children[i].isLeaf
    })
  }
  return arr;
}

function getNewTreeData(treeData, curKey, child) {
  const loop = (data) => {
    data.forEach((item) => {
      if (curKey.indexOf(item.key) === 0) {
        if (item.children) {
          loop(item.children);
        } else {
          item.children = child;
        }
      }
    });
  };
  loop(treeData);
}

class Extend extends React.Component {
  constructor() {
    super();
    this.state = {
      list: [],
      animating: false,
      treeData: [],
      addr: "",
      pc_url: ""
    }
  }
  componentDidMount() {
    this.getInfo();
    this.getList();
    this.getAddr();
  }
  getList = () => {
    axios.get("/kc/self/invite-num", {
        headers: {
          "authorization": sessionStorage.getItem("authorization")
        }
      })
      .then(res => {
        if (res.data.code == '100103') {
          window.location.href = "/kuangfront_pc/login";
        } else if (res.data.code == '100200') {
          var res = res.data.data;
          var list = [];
          for (var i in res) {
            list.push(res[i])
          }
          this.setState({
            list: list
          })
        } else {
          codeTest(this.props, res.data.code);
        }

      })
  }
  getAddr = (currency) => {
    axios.get("/kc/self/invitelink", {
        headers: {
          "authorization": sessionStorage.getItem("authorization")
        }
      })
      .then(res => {
        var res = res.data.data;
        this.setState({
          addr: res.url,
          pc_url: res.pc_url
        })
        if (res) {
          this.setState({
            animating: true
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  getInfo = () => {
    axios.get('/kc/self/info', {
        headers: {
          "Content-Type": "application/json",
          "authorization": sessionStorage.getItem("authorization")
        }
      })
      .then((res) => {
        var data = res.data.data;
        this.setState({
          treeData: [{
            name: data.username,
            key: '0-0'
          }],
        });

      })
      .catch(function(error) {
        console.log(error);
      });
  }
  cloneBtn = () => {
    copy(this.state.pc_url);
    message.success(this.props.intl.formatMessage({
      id: 'Replicating'
    }), 1);
  }
  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      axios.get("/kc/self/invites?username=" + treeNode.props.title, {
          headers: {
            "authorization": sessionStorage.getItem("authorization")
          }
        })
        .then(res => {
          if (res.data.code == '100103') {
            window.location.href = "/kuangfront_pc/login";
          } else if (res.data.code == '100200') {
            const treeData = [...this.state.treeData];
            getNewTreeData(treeData, treeNode.props.eventKey, generateTreeNodes(treeNode, res.data.data));
            this.setState({
              treeData
            });
            resolve();
          } else {
            message.error(res.data.msg, 1);
          }
          // if (res) {
          //   this.setState({
          //     animating: true
          //   })
          // }
        })
    });
  }
  render() {
    const animation = {
      enter(node, done) {
        return animate(node, true, done);
      },
      leave(node, done) {
        return animate(node, false, done);
      },
      appear(node, done) {
        return animate(node, true, done);
      },
    };
    const loop = (data) => {
      return data.map((item) => {
        if (item.children) {
          return <TreeNode title={item.name} key={item.key}>{loop(item.children)}</TreeNode>;
        }
        return (
          <TreeNode title={item.name} key={item.key} isLeaf={item.isLeaf}
          />
        );
      });
    };
    const treeNodes = loop(this.state.treeData);

    return (

      <div className="kc_extend">
             {
          this.state.animating?
            <div className="kc_extends">
              
              <div><i className="icon iconfont icon-tongzhituiguang"></i><FormattedMessage
                                      id='Recommend'
                                      defaultMessage = "推荐"
                                  /></div>
              <div className="kc_er">
                  <div className="kc_erinfo">
                   <div className="share_img">
                         {this.state.pc_url ?
                            <QRCode value={this.state.pc_url} size={getSize(20)} /> :
                            null
                         }
                   </div>
                   <div className="er_title">
                   <FormattedMessage
                          tagName="p"
                          id='recommendurl'
                          defaultMessage = "专属注册链接"
                      />
                        <p><span>{this.state.pc_url}</span> <span className="cloneurl" onClick={this.cloneBtn}> <FormattedMessage
                          id='recommendshare'
                          defaultMessage = "复制链接分享"
                      /></span></p>
                   </div>
                  </div>       
              </div>
              <div><i className="icon iconfont icon-tongzhituiguang"></i><FormattedMessage
                          id='myPublice'
                          defaultMessage = "我的推荐"
                      /></div>
              <div className="kc_table">
                  <div  className="extendsTable">
                    <div className="extendsTable_info">
                       {
                      this.state.list.map((item,index)=>{
                        return(
                              <div key={index+"q"} className="table_info">
                                    <section>
                                        <p className="table_tit">M{index + 1}</p>
                                        <p className="table_content">{item}</p>
                                    </section>
                                </div>
                           )
                      })
                    }
                    </div>
                    </div>
                    <div className="tree_info">
                    <Tree
                      showIcon={false}
                      onSelect={this.onSelect}
                      loadData={this.onLoadData}
                      showLine={true}
                    >
                      {treeNodes}
                    </Tree>
                    </div>

              </div>
           </div>
           :<div id="kc_spins">
           <Spin />
           </div>
        }
           </div>
    )
  }
}
Extend.propTypes = {
  intl: intlShape.isRequired
}
export default injectIntl(Extend);