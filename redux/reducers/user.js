import {
   USER_STATE_CHANGE,
   USER_POSTS_STATE_CHANGE,
   USER_FOLLOWINGS_STATE_CHANGE,
   CLEAR_DATA
} from "./../constants/index"
const initialState = {
   currentUser: null,
   posts: [],
   followings: []
}

export const User = (state = initialState, action) => {
   switch (action.type) {
      case USER_STATE_CHANGE:
         return {
            ...state,
            currentUser: action.currentUser
         }
      case USER_POSTS_STATE_CHANGE:
         return {
            ...state,
            posts: action.posts
         }
      case USER_FOLLOWINGS_STATE_CHANGE:
         return {
            ...state,
            followings: action.followings
         }
      case CLEAR_DATA:
         return { currentUser: null, posts: [], followings: [] }
      default:
         return state
   }
}
