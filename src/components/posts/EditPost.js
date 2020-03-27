import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import * as actions from "../../actions/posts";
import PostForm from './form/PostForm';
import requireAuth from "../requireAuth";

class EditPost extends Component {
  
  onSubmit = postData => {
    this.props.updatePost(this.props.post._id, postData, () => {
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
          <h3 className="text-center">Edit post</h3>
          <PostForm onSubmit={this.onSubmit} onCancel={this.onCancel} post={this.props.post} button="Update post" />

        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const { postId } = props.match.params;
  return {
    post: state.posts.posts.find(post => post._id == postId)
  }
}

export default compose(
  connect(mapStateToProps, actions),
  requireAuth
)(EditPost);
