import firebase from "firebase"
import "firebase/firestore"
import {
   USER_POSTS_STATE_CHANGE,
   USER_STATE_CHANGE,
   CLEAR_DATA,
   USERS_LIKES_STATE_CHANGE
} from "../constants"
import {
   USER_FOLLOWINGS_STATE_CHANGE,
   USERS_POSTS_STATE_CHANGE,
   USERS_DATA_STATE_CHANGE
} from "./../constants/index"

export function clearData() {
   return (dispatch) => {
      dispatch({ type: CLEAR_DATA })
   }
}

export function fetchUser() {
   return (dispatch) => {
      firebase
         .firestore()
         .collection("users")
         .doc(firebase.auth().currentUser.uid)
         .get()
         .then((snapshot) => {
            if (snapshot.exists) {
               dispatch({
                  type: USER_STATE_CHANGE,
                  currentUser: snapshot.data()
               })
            } else {
               console.log("does not exist")
            }
         })
   }
}

export function fetchUserPosts() {
   return (dispatch) => {
      firebase
         .firestore()
         .collection("posts")
         .doc(firebase.auth().currentUser.uid)
         .collection("userPost")
         .get()
         .then((snapshot) => {
            let posts = snapshot.docs.map((doc) => {
               const data = doc.data()
               const id = doc.id
               return { id, ...data }
            })
            dispatch({ type: USER_POSTS_STATE_CHANGE, posts })
         })
   }
}

export function fetchUserFollowings() {
   return (dispatch) => {
      firebase
         .firestore()
         .collection("following")
         .doc(firebase.auth().currentUser.uid)
         .collection("userFollowing")
         .onSnapshot((snapshot) => {
            let followings = snapshot.docs.map((doc) => {
               const id = doc.id
               return id
            })
            dispatch({ type: USER_FOLLOWINGS_STATE_CHANGE, followings })
            for (let i = 0; i < followings.length; i++) {
               dispatch(fetchUsersData(followings[i], true))
            }
         })
   }
}

export function fetchUsersData(uid, getPosts) {
   return (dispatch, getState) => {
      const found = getState().usersState.users.some((el) => el.uid === uid)
      if (!found) {
         firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then((snapshot) => {
               if (snapshot.exists) {
                  let user = snapshot.data()
                  user.uid = snapshot.id

                  dispatch({ type: USERS_DATA_STATE_CHANGE, user })
               } else {
                  console.log("does not exist")
               }
            })

         if (getPosts) {
            dispatch(fetchUsersFollowingPosts(uid))
         }
      }
   }
}

export function fetchUsersFollowingPosts(uid) {
   return (dispatch, getState) => {
      firebase
         .firestore()
         .collection("posts")
         .doc(uid)
         .collection("userPost")
         .orderBy("creation", "asc")
         .get()
         .then((snapshot) => {
            const uid = snapshot.docs[0]?.ref?.path.split("/")[1]
            const user = getState().usersState.users.find(
               (el) => el.uid === uid
            )

            let posts = snapshot.docs.map((doc) => {
               const data = doc.data()
               const id = doc.id
               return { id, ...data, user }
            })

            for (let i = 0; i < posts.length; i++) {
               dispatch(fetchUsersFollowingLikes(uid, posts[i].id))
            }
            dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid })
         })
   }
}

export function fetchUsersFollowingLikes(uid, postId) {
   return (dispatch, getState) => {
      firebase
         .firestore()
         .collection("posts")
         .doc(uid)
         .collection("userPost")
         .doc(postId)
         .collection("likes")
         .doc(firebase.auth().currentUser.uid)
         .onSnapshot((snapshot) => {
            console.log(snapshot)
            const postId = snapshot.ref.path.split("/")[3]

            let currentUserLike = false
            if (snapshot.exists) {
               currentUserLike = true
            }
            dispatch({
               type: USERS_LIKES_STATE_CHANGE,
               postId,
               currentUserLike
            })
         })
   }
}
