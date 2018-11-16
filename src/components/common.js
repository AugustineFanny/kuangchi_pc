import React, {
  Component
} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom'
import {
  fakeAuth
} from '@/components/utils'
export const PrivateRoute = ({
  component: Component,
  ...rest
}) => ( < Route {...rest
  }
  render = {
    props =>
    fakeAuth.isAuthenticated ? (
      <Component {...props} />
    ) : ( < Redirect to = {
        {
          pathname: "/kuangfront_pc/login",
          state: {
            from: props.location
          }
        }
      }
      />
    )
  }
  />
);