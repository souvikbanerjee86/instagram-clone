import React, { useState, useEffect } from "react"
import {
   View,
   Text,
   StyleSheet,
   FlatList,
   Image,
   Button,
   Dimensions,
   TouchableOpacity
} from "react-native"
import { connect } from "react-redux"
import firebase from "firebase"
require("firebase/firestore")
const width = Dimensions.get("window").width
const FeedScreen = ({ route, feed, userLoaded, followings, navigation }) => {
   const [posts, setPosts] = useState([])
   useEffect(() => {
      if (userLoaded === followings.length && followings.length > 0) {
         feed.sort((a, b) => {
            return a.creation - b.creation
         })
         setPosts(feed)
      }
   }, [userLoaded, feed])

   const onLikePress = (userId, postId) => {
      console.log(userId, postId)
      firebase
         .firestore()
         .collection("posts")
         .doc(userId)
         .collection("userPost")
         .doc(postId)
         .collection("likes")
         .doc(firebase.auth().currentUser.uid)
         .set({})
   }
   const onDislikePress = (userId, postId) => {
      firebase
         .firestore()
         .collection("posts")
         .doc(userId)
         .collection("userPost")
         .doc(postId)
         .collection("likes")
         .doc(firebase.auth().currentUser.uid)
         .delete()
   }

   return (
      <View style={styles.container}>
         <View style={styles.containerGallery}>
            <FlatList
               numColumns={1}
               horizontal={false}
               data={posts}
               keyExtractor={(item) => {
                  return item.downloadURL
               }}
               renderItem={({ item }) => (
                  <View style={styles.containerImage}>
                     <View style={styles.userVIewStyle}>
                        <Text style={styles.textStyle}>
                           By: {item.user.name}
                        </Text>
                        <TouchableOpacity
                           onPress={() =>
                              navigation.navigate("Comment", {
                                 uid: item.user.uid,
                                 postId: item.id
                              })
                           }
                        >
                           <Text style={styles.textStyle}>View Comments</Text>
                        </TouchableOpacity>
                     </View>
                     <Image
                        style={styles.image}
                        source={{ uri: item.downloadURL }}
                     />
                     <View style={styles.captionStyle}>
                        <Text style={styles.captionTextStyle}>
                           {item.caption}
                        </Text>
                     </View>

                     {item.currentUserLike ? (
                        <View
                           style={{
                              marginTop: 10,
                              marginHorizontal: 15,
                              borderRadius: 5
                           }}
                        >
                           <Button
                              title="Dislike"
                              onPress={() =>
                                 onDislikePress(item.user.uid, item.id)
                              }
                           />
                        </View>
                     ) : (
                        <View
                           style={{
                              marginTop: 10,
                              marginHorizontal: 15,
                              borderRadius: 5
                           }}
                        >
                           <Button
                              title="Like"
                              onPress={() =>
                                 onLikePress(item.user.uid, item.id)
                              }
                           />
                        </View>
                     )}
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

   containerImage: {
      marginTop: 10,
      marginBottom: 10,
      justifyContent: "center",
      backgroundColor: "white",
      marginHorizontal: 20,
      paddingBottom: 20,
      borderRadius: 5
   },
   image: {
      flex: 1,
      width: width * 0.8,
      height: 245,
      borderRadius: 5,
      marginHorizontal: 17,
      resizeMode: "cover"
   },
   textStyle: {
      fontSize: 12,
      padding: 4,
      fontWeight: "bold",
      color: "grey"
   },
   userVIewStyle: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      marginHorizontal: 17
   },
   captionStyle: {
      marginHorizontal: 17
   },
   captionTextStyle: {
      fontSize: 12,
      color: "lightgrey",
      fontStyle: "italic"
   }
})
const mapStateToProps = (state) => {
   return {
      currentUser: state.userState.currentUser,
      feed: state.usersState.feed,
      userLoaded: state.usersState.userLoaded,
      followings: state.userState.followings
   }
}
export default connect(mapStateToProps, null)(FeedScreen)
