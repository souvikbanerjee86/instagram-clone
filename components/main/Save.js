import React, { useState } from "react"
import { View, TextInput, Image, Button, StyleSheet } from "react-native"
import firebase from "firebase"
import "firebase/firestore"
import "firebase/firebase-storage"
const SaveScreen = ({ route, navigation }) => {
   const { image } = route.params
   const [caption, setCaption] = useState("")
   const uploadImage = async () => {
      const uri = image
      const response = await fetch(uri)
      const blob = await response.blob()

      const task = firebase
         .storage()
         .ref()
         .child(
            `post/${firebase.auth().currentUser.uid}/${Math.random().toString(
               36
            )}`
         )
         .put(blob)

      const taskProgress = (snapshot) => {
         console.log(`Transferred: ${snapshot.bytesTransferred}`)
      }
      const taskCompleted = () => {
         task.snapshot.ref.getDownloadURL().then((snapshot) => {
            savePostData(snapshot)
            console.log(snapshot)
         })
      }

      const taskError = (snapshot) => {
         console.log(snapshot)
      }

      task.on("state_changed", taskProgress, taskError, taskCompleted)
   }
   const savePostData = (downloadURL) => {
      firebase
         .firestore()
         .collection("posts")
         .doc(firebase.auth().currentUser.uid)
         .collection("userPost")
         .add({
            downloadURL,
            caption,
            likesCount: 0,
            creation: firebase.firestore.FieldValue.serverTimestamp()
         })
         .then((res) => {
            navigation.popToTop()
         })
   }
   return (
      <View style={{ flex: 1, margin: 20 }}>
         <Image source={{ uri: image }} style={{ flex: 1 }} />
         <TextInput
            style={styles.inputStyle}
            placeholder="Write a caption...."
            value={caption}
            onChangeText={(caption) => setCaption(caption)}
         />
         <View>
            <Button title="Save" onPress={() => uploadImage()} />
         </View>
      </View>
   )
}
const styles = StyleSheet.create({
   inputStyle: {
      padding: 20,
      backgroundColor: "white",
      marginBottom: 10,
      marginTop: 10,
      color: "grey"
   }
})

export default SaveScreen
