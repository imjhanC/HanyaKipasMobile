import React, { useState, useEffect } from 'react';
import { 
    View, 
    StyleSheet, 
    TextInput, 
    Text, 
    TouchableNativeFeedback,
    FlatList,
    Dimensions,
    SafeAreaView
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomePage from "./HomePage/HomePage.tsx";
import ProfilePage from "./HomePage/ProfilePage.tsx";
import SearchPage from "./HomePage/SearchPage.tsx";
import Ionicons from "react-native-vector-icons/Ionicons";S
import { createStackNavigator } from '@react-navigation/stack';

const btmNav = createBottomTabNavigator();
const stack = createStackNavigator();

const Home = () => {
  return(
      <stack.Navigator
        initialRouteName='HomePage'
        screenOptions={{
          headerShown: false
        }}
      >
        <stack.Screen name="HomePage" component={HomePage} />
        <stack.Screen name="ProfilePage" component={ProfilePage} />
        <stack.Screen name="SearchPage" component={SearchPage} />
      </stack.Navigator>
  );
}

const App = ({route, navigation}: any) => {

    const windowHeight = Dimensions.get('window').height;

    return (
      <SafeAreaView style={{flex:1}}>
        <NavigationContainer>
          <btmNav.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle:{
                height: windowHeight * .07,
              },
              tabBarActiveTintColor: 'red',
            }}
          >
            <btmNav.Screen 
              name="Home" 
              component={Home}
              options={{
                tabBarIcon: ({focused}) => 
                  <Ionicons 
                    name = {focused ? "home" : "home-outline"}
                    size = {25}
                    color = {focused ? "#0086ff" : "#676767"} // Updated color to #0086ff
                  />
              }}   
            />

            <btmNav.Screen 
              name="Profile" 
              component={ProfilePage}
              options={{
                tabBarIcon: ({focused}) => 
                  <Ionicons 
                    name = {focused ? "person" : "person-outline"}
                    size = {25}
                    color = {focused ? "#0086ff" : "#676767"} // Updated color to #0086ff
                  />
              }} 
            />

            <btmNav.Screen 
              name="Profile2" 
              component={ProfilePage}
              options={{
                tabBarIcon: ({focused}) => 
                  <Ionicons 
                    name = {focused ? "person" : "person-outline"}
                    size = {25}
                    color = {focused ? "#0086ff" : "#676767"} // Updated color to #0086ff
                  />
              }} 
            />

          </btmNav.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  label: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 3,
    textAlignVertical: 'center',
  },
  input: {
    flex: 3,
    fontSize: 20,
    color: 'blue',
  },
  button: {
    backgroundColor: '#286090',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default App;
