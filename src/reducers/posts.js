import { FETCH_POSTS, UPDATE_POST, CREATE_POST, FILTER_POSTS, SORT_POSTS, DELETE_POST } from '../actions/types';

const INITIAL_STATE = {
  filterTag: '',
  sorts: '',
  posts: []
};

export default function(state = INITIAL_STATE, action) {
  let newPosts;

  switch (action.type) {
    case FETCH_POSTS:
      return { ...state, posts: action.payload };
    case CREATE_POST:
      return state;
    case UPDATE_POST: 
      let updatedPost = action.payload;
      newPosts = state.posts.map(post => post._id === updatedPost._id ? updatedPost : post );
      return { ...state, posts: newPosts };
    case DELETE_POST: 
      newPosts = state.posts.filter(post => post._id !== action.payload);
      return { ...state, posts: newPosts };
        
    case FILTER_POSTS:
      return { ...state, filterTag: action.payload };
    case SORT_POSTS:
      return { ...state, sorts: action.payload };
    default:
      return state;
  }
}