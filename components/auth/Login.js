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
const LoginScreen = ({ navigation }) => {
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const onSignIn = () => {
      firebase
         .auth()
         .signInWithEmailAndPassword(email, password)
         .then((result) => console.log(result))
         .catch((err) => console.log(err))
   }
   return (
      <SafeAreaView style={styles.container}>
         <TextInput
            style={styles.inputStyle}
            placeholder="Email"
            onChangeText={(email) => setEmail(email)}
            value={email}
         />

         <TextInput
            style={styles.inputStyle}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
            value={password}
         />

         <TouchableOpacity onPress={() => onSignIn()}>
            <View style={styles.buttonStyle}>
               <Text
                  style={{
                     color: "white",
                     paddingVertical: 20,
                     fontWeight: "bold"
                  }}
               >
                  SIGN IN
               </Text>
            </View>
         </TouchableOpacity>

         <View style={styles.register}>
            <Text>Not Registered Yet! </Text>
            <Text>
               <TouchableOpacity
                  onPress={() => navigation.navigate("Register")}
               >
                  <Text style={styles.registerText}>Register</Text>
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
      color: "grey",
      borderStartWidth: 1,
      borderEndWidth: 1,
      borderTopWidth: 1,
      boderLeftWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderColor: "lightgray"
   },
   buttonStyle: {
      marginTop: 10,
      alignItems: "center",
      backgroundColor: "#3778b0"
   },
   register: {
      flexDirection: "row",
      marginTop: 10,
      alignItems: "center",
      justifyContent: "center"
   },
   registerText: {
      color: "blue"
   }
})

export default LoginScreen
