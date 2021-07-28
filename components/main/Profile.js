import React, { useState, useEffect } from "react"
import {
   View,
   Text,
   StyleSheet,
   FlatList,
   Image,
   Button,
   Dimensions
} from "react-native"
import firebase from "firebase"
import { connect } from "react-redux"
import "firebase/firestore"
const ProfileScreen = ({ currentUser, posts, route, followings }) => {
   const { uid } = route.params
   const [user, setUser] = useState(null)
   const [userPosts, setUserPosts] = useState([])
   const [following, setFollowing] = useState(false)
   useEffect(() => {
      if (uid !== null && uid === firebase.auth().currentUser.uid) {
         setUser(currentUser)
         setUserPosts(posts)
      } else {
         firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then((snapshot) => {
               if (snapshot.exists) {
                  setUser(snapshot.data())
               } else {
                  console.log("does not exist")
               }
            })

         firebase
            .firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPost")
            .get()
            .then((snapshot) => {
               let posts = snapshot.docs.map((doc) => {
                  const data = doc.data()
                  const id = doc.id
                  return { id, ...data }
               })
               setUserPosts(posts)
            })
      }
      if (followings.indexOf(uid) > -1) {
         setFollowing(true)
      } else {
         setFollowing(false)
      }
   }, [uid, followings])
   const onFollow = () => {
      firebase
         .firestore()
         .collection("following")
         .doc(firebase.auth().currentUser.uid)
         .collection("userFollowing")
         .doc(uid)
         .set({})
   }
   const onUnFollow = () => {
      firebase
         .firestore()
         .collection("following")
         .doc(firebase.auth().currentUser.uid)
         .collection("userFollowing")
         .doc(uid)
         .delete()
   }

   const onLogout = () => {
      firebase.auth().signOut()
   }

   if (user === null) {
      return <View />
   }
   return (
      <View style={styles.container}>
         <View style={styles.containerInfo}>
            <View style={styles.textContainer}>
               <Text style={styles.textStyle}>Name: {user.name}</Text>
               <Text style={styles.textStyle}>Email: {user.email}</Text>
            </View>

            {uid !== firebase.auth().currentUser.uid ? (
               <View>
                  {following ? (
                     <Button title="Following" onPress={() => onUnFollow()} />
                  ) : (
                     <Button title="Follow" onPress={() => onFollow()} />
                  )}
               </View>
            ) : (
               <Button
                  title="Logout"
                  onPress={() => onLogout()}
                  style={styles.buttonStyle}
               />
            )}
         </View>

         <View style={styles.containerGallery}>
            <FlatList
               numColumns={3}
               horizontal={false}
               contentContainerStyle={styles.containerStyle}
               data={userPosts}
               keyExtractor={(item) => {
                  return item.downloadURL
               }}
               renderItem={({ item }) => (
                  <View style={styles.containerImage}>
                     <Image
                        style={styles.image}
                        source={{ uri: item.downloadURL }}
                     />
                  </View>
               )}
            />
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1
   },
   containerInfo: {
      margin: 20
   },
   containerGallery: {},
   containerImage: {
      flex: 1 / 3,
      maxWidth: Dimensions.get("window").width / 3,
      marginBottom: 5,
      marginTop: 5
   },
   image: {
      height: 150,
      width: 100,
      alignSelf: "center",
      padding: 18,
      borderRadius: 5
   },
   textContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 10,
      backgroundColor: "white",
      paddingVertical: 15,
      paddingHorizontal: 10
   },

   textStyle: {
      fontWeight: "bold",
      fontSize: 15,
      color: "lightgrey"
   },
   buttonStyle: {
      paddingVertical: 10
   },
   containerStyle: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 5
   }
})
const mapStateToProps = (state) => {
   return {
      currentUser: state.userState.currentUser,
      posts: state.userState.posts,
      followings: state.userState.followings
   }
}
export default connect(mapStateToProps, null)(ProfileScreen)
