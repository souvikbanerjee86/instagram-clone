import React, { useState } from "react"
import {
   View,
   TextInput,
   FlatList,
   Text,
   TouchableOpacity,
   StyleSheet
} from "react-native"
import firebase from "firebase"
import "firebase/firestore"
const SearchScreen = ({ navigation }) => {
   const [users, setUsers] = useState([])

   const fetchUsers = (search) => {
      firebase
         .firestore()
         .collection("users")
         .where("name", ">=", search)
         .get()
         .then((snapshot) => {
            let users = snapshot.docs.map((doc) => {
               const data = doc.data()
               const id = doc.id
               return { id, ...data }
            })
            setUsers(users)
         })
   }

   return (
      <View style={styles.container}>
         <TextInput
            onChangeText={(search) => fetchUsers(search)}
            placeholder="Search Here...."
            style={styles.inputStyle}
         />
         <FlatList
            numColumns={1}
            horizontal={false}
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
               return (
                  <View style={styles.userView}>
                     <TouchableOpacity
                        onPress={() =>
                           navigation.navigate("Profile", { uid: item.id })
                        }
                     >
                        <Text style={styles.textStyle}>{item.name}</Text>
                     </TouchableOpacity>
                  </View>
               )
            }}
         />
      </View>
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
      borderRadius: 5
   },
   userView: {
      marginTop: 10,
      paddingHorizontal: 10,
      paddingVertical: 15,
      backgroundColor: "white"
   },
   textStyle: {
      fontSize: 20
   }
})

export default SearchScreen
