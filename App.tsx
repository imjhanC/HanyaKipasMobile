import React, { Component } from 'react';
import Home from './Home';
import Profile from './Profile';
import Settings from './Settings';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const App = () => {
    return (
      <NavigationContainer>
        <Tab.Navigator>
           <Tab.Screen name='Home' component={Home}/>
           <Tab.Screen name='Profile' component={Profile}/>
           <Tab.Screen name='Settings' component={Settings}/>
        </Tab.Navigator>
      </NavigationContainer>
    );
}

export default App;