import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import * as actions from '../../actions/auth';

class SignUp extends Component {
  onSubmit = formProps => {
    this.props.signup(formProps, () => {
      setTimeout(() => {
        this.props.history.push('/');
      }, 100)
      
    });
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="auth-card card bg-light">
        <article className="card-body">
          <form onSubmit = {handleSubmit(this.onSubmit)}>
            <h3 className="text-center">Sign Up</h3>

            <div className="form-group">
              <label>Name</label>
              <Field
                name="name"
                type="text"
                component="input"
                autoComplete="none"
                className="form-control"
                placeholder="Enter full name"
              />
            </div>

            <div className="form-group">
              <label>Email address</label>
              <Field
                name="email"
                type="text"
                component="input"
                autoComplete="none"
                className="form-control"
                placeholder="Enter email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <Field
                name="password"
                type="password"
                component="input"
                autoComplete="none"
                className="form-control" 
                placeholder="Enter password"
              />
            </div>
            <div>{this.props.errorMessage}</div>
            <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
          </form>
        </article>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage
  };
}

export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: 'signup' })
)(SignUp);