import React, { useState, useEffect } from "react"
import {
   View,
   Text,
   StyleSheet,
   FlatList,
   Button,
   Dimensions,
   TextInput
} from "react-native"
import firebase from "firebase"
import "firebase/firestore"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { fetchUsersData } from "./../../redux/actions/index"
const CommentScreen = ({ route, users, fetchUsersData }) => {
   const { uid, postId } = route.params
   const [comments, setComments] = useState([])
   const [post, setPost] = useState(null)
   const [text, setText] = useState("")

   useEffect(() => {
      fetchPost()
   }, [postId, users])
   const fetchPost = () => {
      firebase
         .firestore()
         .collection("posts")
         .doc(uid)
         .collection("userPost")
         .doc(postId)
         .collection("comments")
         .get()
         .then((snapshot) => {
            let comments = snapshot.docs.map((doc) => {
               const data = doc.data()
               const id = doc.id
               return { id, ...data }
            })
            matchComments(comments)
         })
      setPost(postId)
   }

   const matchComments = (comments) => {
      for (let i = 0; i < comments.length; i++) {
         const user = users.find((x) => x.uid == comments[i].creator)
         if (user == undefined) {
            fetchUsersData(comments[i].creator, false)
         } else {
            comments[i].user = user
         }
      }
      setComments(comments)
   }

   const saveComment = () => {
      firebase
         .firestore()
         .collection("posts")
         .doc(uid)
         .collection("userPost")
         .doc(postId)
         .collection("comments")
         .add({
            creator: firebase.auth().currentUser.uid,
            text: text
         })
      setText("")
      fetchPost()
   }

   return (
      <View style={{ flex: 1, margin: 20 }}>
         <FlatList
            numColumns={1}
            horizontal={false}
            data={comments}
            keyExtractor={(item) => {
               return item.id
            }}
            renderItem={({ item }) => (
               <View style={styles.commentStyle}>
                  <Text>{item.text}</Text>
                  {item.user !== undefined ? (
                     <Text style={styles.userStyle}>by: {item.user.name}</Text>
                  ) : null}
               </View>
            )}
         />
         <TextInput
            style={styles.inputStyle}
            value={text}
            onChangeText={(value) => setText(value)}
            placeholder="Enter Comment..."
         />
         <Button title="Save" onPress={() => saveComment()} />
      </View>
   )
}

const styles = StyleSheet.create({
   commentStyle: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: "#fff",
      paddingVertical: 20,
      paddingHorizontal: 10,
      marginBottom: 5,
      borderRadius: 5
   },
   inputStyle: {
      padding: 20,
      backgroundColor: "white",
      marginBottom: 10,
      marginTop: 10,
      color: "grey",
      borderStartWidth: 1,
      borderEndWidth: 1,
      borderTopWidth: 1,
      boderLeftWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderColor: "lightgray"
   },
   userStyle: {
      color: "lightgrey",
      fontSize: 12,
      fontStyle: "italic"
   }
})

const mapStateToProps = (state) => {
   return {
      users: state.usersState.users
   }
}
const mapDispatchToProps = (dispatch) =>
   bindActionCreators({ fetchUsersData }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CommentScreen)
