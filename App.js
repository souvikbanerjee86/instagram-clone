import "react-native-gesture-handler"
import React, { useEffect, useState } from "react"
import { View, Text } from "react-native"
import LandingScreen from "./components/auth/Landing"

import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"

import firebase from "firebase/app"
import RegisterScreen from "./components/auth/Register"
import LoginScreen from "./components/auth/Login"

import { Provider } from "react-redux"
import { createStore, applyMiddleware } from "redux"
import rootReducer from "./redux/reducers"
import thunk from "redux-thunk"
import MainScreen from "./components/Main"
import AddScreen from "./components/main/Add"
import SaveScreen from "./components/main/Save"
import { LogBox } from "react-native"
import CommentScreen from "./components/main/Comment"

const store = createStore(rootReducer, applyMiddleware(thunk))

const firebaseConfig = {
   apiKey: "AIzaSyDa76bV_jFP6oSh0P-mD61rAKTV3xjbC0Q",
   authDomain: "instagram-dev-8b5bd.firebaseapp.com",
   projectId: "instagram-dev-8b5bd",
   storageBucket: "instagram-dev-8b5bd.appspot.com",
   messagingSenderId: "714162039620",
   appId: "1:714162039620:web:224ef15eaa2978c4aa8511",
   measurementId: "G-GELD5SJ5DQ"
}

firebase.initializeApp(firebaseConfig)

const Stack = createStackNavigator()
export default function App() {
   const [loaded, setLoaded] = useState(false)
   const [loggedIn, setLoggedIn] = useState(false)
   useEffect(() => {
      LogBox.ignoreLogs(["Setting a timer for a long period of time"])
      firebase.auth().onAuthStateChanged((user) => {
         if (!user) {
            setLoaded(true)
            setLoggedIn(false)
         } else {
            setLoaded(true)
            setLoggedIn(true)
         }
      })
   }, [])
   if (!loaded) {
      return (
         <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
         >
            <Text>Loading....</Text>
         </View>
      )
   }
   if (!loggedIn) {
      return (
         <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
               <Stack.Screen
                  name="Landing"
                  component={LandingScreen}
                  options={{ headerShown: false }}
               />
               <Stack.Screen
                  name="Register"
                  component={RegisterScreen}
                  options={{ headerShown: false }}
               />
               <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{ headerShown: false }}
               />
            </Stack.Navigator>
         </NavigationContainer>
      )
   }
   return (
      <Provider store={store}>
         <NavigationContainer>
            <Stack.Navigator initialRouteName="Main">
               <Stack.Screen name="Main" component={MainScreen} />
               <Stack.Screen name="Add" component={AddScreen} />
               <Stack.Screen name="Save" component={SaveScreen} />
               <Stack.Screen name="Comment" component={CommentScreen} />
            </Stack.Navigator>
         </NavigationContainer>
      </Provider>
   )
}
