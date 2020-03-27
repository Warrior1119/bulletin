import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import * as actions from "../../actions/posts";
import PostForm from './form/PostForm';
import requireAuth from "../requireAuth";

class CreatePost extends Component {


  onSubmit = postData => {
    this.props.createPost(postData, () => {
      this.props.history.push('/');  
    });
  }

  onCancel = () => {
    this.props.history.push('/');
  }
  
  render() {

    return (
      <div className="card">
        <div className="card-body">
          <h3 className="text-center">Create post</h3>
          <PostForm onSubmit={this.onSubmit} onCancel={this.onCancel} button="Create post" />

        </div>
      </div>
    );
  }
}

export default compose(
  connect(null, actions),
  requireAuth
)(CreatePost);
