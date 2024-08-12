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
import HomePage from "./HomePage.tsx";
import ProfilePage from "./ProfilePage.tsx";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const btmNav = createBottomTabNavigator();

const App = ({route, navigation}: any) => {

    const windowHeight = Dimensions.get('window').height;

    return (
      <NavigationContainer>
        <btmNav.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle:{
              height: windowHeight * .06,
            }
          }}
        >
            <btmNav.Screen 
              name="Home" 
              component={HomePage}
              options={{
                tabBarIcon: ({focused}) => 
                  <MaterialCommunityIcons 
                    name = {focused ? "fan-auto" : "fan-alert"}
                    size = {25}
                    color = {focused ? "#5ed1f5" : "#676767"}
                  />
              }}   
            />
            <btmNav.Screen name="Profile" component={ProfilePage} />
        </btmNav.Navigator>
      </NavigationContainer>
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
    // right:20,
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