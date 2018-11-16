import React, {
  Component
} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'
import Mywallet from "@/pages/Mywallet.js"
import Login from "@/pages/Login.js"
import Register from "@/pages/Register.js"
import Forget from "@/pages/Forget.js"
import Successreg from "@/pages/Successreg.js"
import {
  PrivateRoute
} from '@/components/common'

class RouteView extends Component {

  render() {
    return (
      <div className="tao_container">
                  <Route exact path="/kuangfront_pc" component={Login}/>
                  <Route  path="/kuangfront_pc/login" component={Login}/>
                  <Route  path="/kuangfront_pc/register" component={Register}/>
                  <Route  path="/kuangfront_pc/forget" component={Forget}/>
                  <Route  path="/kuangfront_pc/successreg" component={Successreg}/>
                  <PrivateRoute path="/kuangfront_pc/mywallet" component={Mywallet}  />
              </div>

    )
  }
}
export default RouteView