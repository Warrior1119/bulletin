import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { WithContext as ReactTags } from "react-tag-input";

class PostForm extends Component {
  state = {
    tags: this.props.post && this.props.post.tags
      ? this.props.post.tags.map(tag => ({ id: tag, text: tag }))
      : []
  };

  onSubmit = formProps => {
    if (this.props.onSubmit) {
      this.props.onSubmit({
        title: formProps.title,
        body: formProps.body,
        tags: this.state.tags.map(tag => tag.text)
      });
    }
  };

  handleTagDelete = i => {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i)
    });
  };

  handleTagAddition = tag => {
    this.setState({
      tags: [...this.state.tags, tag]
    });
  };

  render() {
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <div className="form-group">
          <label>Title</label>
          <Field
            name="title"
            type="text"
            component="input"
            autoComplete="none"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Body</label>
          <Field
            name="body"
            type="text"
            component="textarea"
            rows="6"
            autoComplete="none"
            className="form-control"
          />
        </div>

        <div className="tag-input">
          <ReactTags
            tags={this.state.tags}
            handleDelete={this.handleTagDelete}
            handleAddition={this.handleTagAddition}
            allowDragDrop={false}
            classNames={{ tag: "tag", tagInputField: "form-control" }}
          />
        </div>

        <div>{this.props.errorMessage}</div>
        <button type="submit" className="btn btn-primary btn-block">
          {this.props.button}
        </button>
        <button className="btn btn-secondary btn-block" onClick={this.props.onCancel}>
          Cancel
        </button>
      </form>

    );
  }
}

function mapStateToProps(state, props) {
  return {
    initialValues: props.post
  };
}

export default compose(
  connect(mapStateToProps),
  reduxForm({ form: "postForm" })
)(PostForm);
