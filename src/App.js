import './App.css';
import 'antd/dist/antd.less'
import React, {
  Component
} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import RouterView from '@/router/index'
import Header from '@/components/Header'
//引入组件



const App = () => (
  <Router>
    <div className="tao_app">
        <Header />
        <RouterView />
    </div>
  </Router>
)
export default App