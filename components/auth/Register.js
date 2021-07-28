import React, { useState } from "react"
import {
   TextInput,
   StyleSheet,
   View,
   Button,
   SafeAreaView,
   TouchableOpacity,
   Text
} from "react-native"
import firebase from "firebase"
import "firebase/firestore"
const RegisterScreen = ({ navigation }) => {
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [name, setName] = useState("")
   const onSignUp = () => {
      firebase
         .auth()
         .createUserWithEmailAndPassword(email, password)
         .then((result) => {
            firebase
               .firestore()
               .collection("users")
               .doc(firebase.auth().currentUser.uid)
               .set({ email, name })
         })
         .catch((err) => console.log(err))
   }
   return (
      <SafeAreaView style={styles.container}>
         <TextInput
            style={styles.inputStyle}
            placeholder="Name"
            onChangeText={(name) => setName(name)}
            value={name}
         />
         <TextInput
            style={styles.inputStyle}
            placeholder="Email"
            onChangeText={(email) => setEmail(email)}
            value={email}
         />
         <TextInput
            placeholder="Password"
            style={styles.inputStyle}
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
            value={password}
         />

         <TouchableOpacity onPress={() => onSignUp()}>
            <View style={styles.buttonStyle}>
               <Text
                  style={{
                     color: "white",
                     paddingVertical: 25,
                     fontWeight: "bold"
                  }}
               >
                  REGISTER
               </Text>
            </View>
         </TouchableOpacity>

         <View style={styles.login}>
            <Text>Already Registered?</Text>
            <Text>
               <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginText}> Login</Text>
               </TouchableOpacity>
            </Text>
         </View>
      </SafeAreaView>
   )
}
const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: "center",
      margin: 20
   },
   inputStyle: {
      padding: 20,
      backgroundColor: "white",
      marginBottom: 10,
      color: "grey"
   },
   buttonStyle: {
      marginTop: 10,
      alignItems: "center",
      backgroundColor: "#3778b0"
   },
   login: {
      flexDirection: "row",
      marginTop: 10,
      alignItems: "center",
      justifyContent: "center"
   },
   loginText: {
      color: "blue",
      alignItems: "center",
      justifyContent: "center"
   }
})

export default RegisterScreen
