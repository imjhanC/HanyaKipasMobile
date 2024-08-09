import React, { Component } from 'react';
import FirstScreen from './FirstScreen';
import SecondScreen from './SecondScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

const StackNav = createStackNavigator ();

export default class App extends Component{
  render() {
    return(
      <NavigationContainer>
        <StackNav.Navigator initialRouteName="First">
          <StackNav.Screen
            name="First"
            component={FirstScreen}
          />
          <StackNav.Screen
            name="Second"
            component={SecondScreen}
          />
        </StackNav.Navigator>
      </NavigationContainer>
    ); 
  }
}