import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/auth';

class SignOut extends Component {
  componentDidMount() {
    this.props.signout();
    this.props.history.push('/sign-in');
  }

  render() {
    return (<div></div>);
  }

}



export default connect(null, actions)(SignOut);