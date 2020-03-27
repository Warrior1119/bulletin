import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faThumbsUp,
  faThumbsDown,
  faTrash,
  faPen
} from "@fortawesome/free-solid-svg-icons";
import * as actions from "../../actions/posts";
import requireAuth from "../requireAuth";
import moment from "moment-timezone";

class Posts extends Component {
  state = {
    filterTag: this.props.filterTag || "",
    sorts: this.props.sorts || ""
  };

  componentDidMount() {
    this.props.fetchPosts({
      filterTag: this.state.filterTag,
      sorts: this.state.sorts
    });
  }

  onUpvote = post => {
    if (post.upvoted) {
      this.props.cancelVote(post._id);
    } else {
      this.props.upVote(post._id);
    }
  };

  onDownvote = post => {
    if (post.downvoted) {
      this.props.cancelVote(post._id);
    } else {
      this.props.downVote(post._id);
    }
  };

  onClickDelete = post => {
    this.props.deletePost(post._id);
  };

  onClickSearch = () => {
    this.props.fetchPosts({
      filterTag: this.state.filterTag,
      sorts: this.state.sorts
    });
    this.props.updateFilterTag(this.state.filterTag);
  };

  onTagClick = tag => {
    this.setState({ filterTag: tag });
    this.props.fetchPosts({
      filterTag: tag,
      sorts: this.state.sorts
    });
    this.props.updateFilterTag(tag);
  };

  onSearchTextChange = e => {
    this.setState({ filterTag: e.target.value });
  };

  onSortSelectChange = e => {
    this.setState({ sorts: e.target.value });
    this.props.fetchPosts({
      filterTag: this.state.filterTag,
      sorts: e.target.value
    });
    this.props.updateSort(this.state.filterTag);
  };

  renderPosts() {
    if (!this.props.posts) {
      return <React.Fragment />;
    }
    return this.props.posts.map(post => (
      <li key={post._id} className="list-group-item">
        <div className="row">
          <div className="col-12">
            <div className="action float-right">
              <Link
                className="btn btn-primary btn-xs"
                to={`/posts/${post._id}/edit`}
              >
                <FontAwesomeIcon icon={faPen} />
              </Link>

              <button
                type="button"
                className="btn btn-danger btn-xs"
                title="Delete"
                onClick={() => {
                  this.onClickDelete(post);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            <div>
              <div className="post-title">{post.title}</div>

              <div className="mic-info">
                Created on{" "}
                {moment(post.createdAt).format("MMMM D YYYY")}
              </div>
            </div>
            <div className="post-text">{post.body}</div>
            <div className="tags">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="tag"
                  onClick={() => {
                    this.onTagClick(tag);
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="votes-wrapper">
              <button
                type="button"
                className={
                  "btn btn-vote btn-xs " + (post.upvoted ? "active" : "")
                }
                onClick={() => {
                  this.onUpvote(post);
                }}
                title="Upvote"
              >
                <FontAwesomeIcon icon={faThumbsUp} />
              </button>
              <span className="votes">{post.upvotes - post.downvotes}</span>
              <button
                type="button"
                className={
                  "btn btn-vote btn-xs " + (post.downvoted ? "active" : "")
                }
                onClick={() => {
                  this.onDownvote(post);
                }}
                title="Downvote"
              >
                <FontAwesomeIcon icon={faThumbsDown} />
              </button>
            </div>
          </div>
        </div>
      </li>
    ));
  }

  render() {
    return (
      <div className="card">
        <div className="card-header">
          <input
            className="form-control mr-sm-2"
            type="text"
            placeholder="Search"
            aria-label="Search"
            value={this.state.filterTag}
            onChange={this.onSearchTextChange}
          />
          <button
            className="btn btn-outline-secondary "
            onClick={this.onClickSearch}
          >
            Search
          </button>
          <select
            className="form-control"
            onChange={this.onSortSelectChange}
            defaultValue={this.state.sorts}
          >
            <option value="">Sort by</option>
            <option value="votes">Popularity</option>
            <option value="title">Title</option>
            <option value="createdAt">Created Date</option>
          </select>

          <div className="float-right">
            <Link className="new-post btn btn-primary" to={"/posts/new"}>
              New Post
            </Link>
          </div>
        </div>
        <div className="card-body">
          <ul className="list-group">{this.renderPosts()}</ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.posts
  };
}

export default compose(connect(mapStateToProps, actions), requireAuth)(Posts);
