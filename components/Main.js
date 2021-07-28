import React, { useEffect } from "react"
import { View, Text } from "react-native"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import {
   fetchUser,
   fetchUserPosts,
   fetchUserFollowings,
   clearData
} from "../redux/actions"
import FeedScreen from "./main/Feed"
import ProfileScreen from "./main/Profile"
import SearchScreen from "./main/Search"
import firebase from "firebase"
const Tab = createMaterialBottomTabNavigator()

const EmptyScreen = () => {
   return null
}
const MainScreen = ({
   fetchUser,
   currentUser,
   fetchUserPosts,
   fetchUserFollowings,
   clearData
}) => {
   useEffect(() => {
      clearData()
      fetchUser()
      fetchUserPosts()
      fetchUserFollowings()
   }, [])

   if (!currentUser) {
      return <View></View>
   }
   return (
      <Tab.Navigator initialRouteName="Feed" labeled={false}>
         <Tab.Screen
            name="Feed"
            component={FeedScreen}
            options={{
               tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="home" size={26} color={color} />
               )
            }}
         />

         <Tab.Screen
            name="Search"
            component={SearchScreen}
            options={{
               tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                     name="magnify"
                     size={26}
                     color={color}
                  />
               )
            }}
         />

         <Tab.Screen
            name="Add Image"
            component={EmptyScreen}
            listeners={({ navigation }) => ({
               tabPress: (e) => {
                  e.preventDefault()
                  navigation.navigate("Add")
               }
            })}
            options={{
               tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                     name="plus-box"
                     size={26}
                     color={color}
                  />
               )
            }}
         />
         <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            listeners={({ navigation }) => ({
               tabPress: (e) => {
                  e.preventDefault()
                  navigation.navigate("Profile", {
                     uid: firebase.auth().currentUser.uid
                  })
               }
            })}
            options={{
               tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                     name="account-circle"
                     size={26}
                     color={color}
                  />
               )
            }}
         />
      </Tab.Navigator>
   )
}

const mapStateToProps = (state) => {
   return {
      currentUser: state.userState.currentUser
   }
}
const mapDispatchToProps = (dispatch) =>
   bindActionCreators(
      { fetchUser, fetchUserPosts, fetchUserFollowings, clearData },
      dispatch
   )

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen)
