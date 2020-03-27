import {
  FETCH_POSTS,
  UPDATE_POST,
  CREATE_POST,
  FILTER_POSTS,
  SORT_POSTS,
  DELETE_POST
} from "./types";
import axios from "axios";

const API_URL = "http://localhost:4000/api/posts";

export const fetchPosts = listOptions => async (dispatch, getState) => {
  try {
    const {
      auth: { accessToken }
    } = getState();
    const { filterTag, sorts } = listOptions;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };

    let url = API_URL;
    if (filterTag.length > 0 || sorts.length > 0) {
      url += "?";
      let queries = [];
      if (filterTag.length > 0) {
        queries.push(`tag=${filterTag}`);
      }
      if (sorts.length > 0) {
        queries.push(`sort=${sorts}`);
      }
      url += queries.join("&");
    }

    const response = await axios.get(url, config);
    dispatch({ type: FETCH_POSTS, payload: response.data });
  } catch (e) {
    console.log(e);
  }
};

export const createPost = (formData, callback) => async (
  dispatch,
  getState
) => {
  try {
    const {
      auth: { accessToken }
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };
    const response = await axios.post(API_URL, formData, config);
    dispatch({ type: CREATE_POST, payload: response.data });
    if (callback) {
      callback();
    }
  } catch (e) {
    console.log(e);
  }
};

export const updatePost = (postId, formData, callback) => async (
  dispatch,
  getState
) => {
  try {
    const {
      auth: { accessToken }
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };
    const response = await axios.put(`${API_URL}/${postId}`, formData, config);
    dispatch({ type: UPDATE_POST, payload: response.data });
    if (callback) {
      callback();
    }
  } catch (e) {
    console.log(e);
  }
};

export const deletePost = (postId, callback) => async (dispatch, getState) => {
  try {
    const {
      auth: { accessToken }
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };
    await axios.delete(`${API_URL}/${postId}`, config);
    dispatch({ type: DELETE_POST, payload: postId });
    if (callback) {
      callback();
    }
  } catch (e) {
    console.log(e);
  }
};

export const upVote = (postId, callback) => async (dispatch, getState) => {
  try {
    const {
      auth: { accessToken }
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };
    const response = await axios.post(
      `${API_URL}/${postId}/upvote`,
      {},
      config
    );
    dispatch({ type: UPDATE_POST, payload: response.data });
    if (callback) {
      callback();
    }
  } catch (e) {
    console.log(e);
  }
};

export const downVote = (postId, callback) => async (dispatch, getState) => {
  try {
    const {
      auth: { accessToken }
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };
    const response = await axios.post(
      `${API_URL}/${postId}/downvote`,
      {},
      config
    );
    dispatch({ type: UPDATE_POST, payload: response.data });
    if (callback) {
      callback();
    }
  } catch (e) {
    console.log(e);
  }
};

export const cancelVote = (postId, callback) => async (dispatch, getState) => {
  try {
    const {
      auth: { accessToken }
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };
    const response = await axios.post(
      `${API_URL}/${postId}/cancelvote`,
      {},
      config
    );
    dispatch({ type: UPDATE_POST, payload: response.data });
    if (callback) {
      callback();
    }
  } catch (e) {
    console.log(e);
  }
};

export const updateFilterTag = tag => {
  return {
    type: FILTER_POSTS,
    payload: tag
  };
};

export const updateSort = sort => {
  return {
    type: SORT_POSTS,
    payload: sort
  };
};
