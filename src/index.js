import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import {
    createStore,
    combineReducers
} from 'redux'
import PubSub from 'pubsub-js'
import {
    connect,
    Provider
} from 'react-redux'
import ReducerObj from "./reducers/index"
import {
    addLocaleData,
    IntlProvider,
    FormattedMessage
} from 'react-intl';
import zh from 'react-intl/locale-data/zh';
import en from 'react-intl/locale-data/en';
import ko from 'react-intl/locale-data/ko';
import ja from 'react-intl/locale-data/ja';
import zh_CN from './locale/zh_CN';
import en_US from './locale/en_US';
import ko_a from './locale/ko';
import ja_a from './locale/ja';

global.Intl = require('intl');
let messages = {};
messages["en-US"] = en_US;
messages["zh-CN"] = zh_CN;
messages["ko"] = ko_a;
messages["ja"] = ja_a;

addLocaleData([...zh, ...en, ...ko, ...ja]);
//创建reducers
const reducers = combineReducers(ReducerObj)
    // 创建store
const store = createStore(reducers);

class Apps extends React.Component {
    constructor() {
        super();
        this.state = {
            lang: 'en-US'
        }
    }



    componentDidMount() {
        if (sessionStorage.getItem("lang")) {
            this.setState({
                lang: sessionStorage.getItem("lang")
            })
        }
        this.pubsub_token = PubSub.subscribe('language', function(topic, lang) {
            if (sessionStorage.getItem("lang")) {
                this.setState({
                    lang: sessionStorage.getItem("lang")
                })
            } else {
                this.setState({
                    lang: lang
                });
            }
        }.bind(this));
    }
    componentWillUnmount() {

        PubSub.unsubscribe(this.pubsub_token);
    }

    render() {
        let currentLang;
        if (sessionStorage.getItem("lang")) {
            currentLang = sessionStorage.getItem("lang")
        } else {
            currentLang = this.state.lang
        }
        return (
            <IntlProvider locale={currentLang} messages={messages[currentLang]}>
              <App />
              </IntlProvider>
        )
    }
}
const renderPage = () => {
    ReactDOM.render(<Provider store={store}><Apps /></Provider>, document.getElementById('root'));
}

// 订阅
store.subscribe(renderPage);
renderPage();