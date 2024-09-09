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
import OrderPage from "./HomePage/OrderPage.tsx";
import ProfilePage from "./HomePage/ProfilePage.tsx";
import SearchPage from "./HomePage/SearchPage.tsx";
import ProductPage from "./HomePage/ProductPage.tsx";
import LoginPage from "./Login/Login.tsx";
import RegisterPage from './Login/Register.tsx';
import ShoppingCart from './HomePage/ShoppingCart.tsx';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createStackNavigator } from '@react-navigation/stack';

const btmNav = createBottomTabNavigator();
const stack = createStackNavigator();

const Profile = () => {
  return(
      <stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <stack.Screen name="ProfilePage" component={ProfilePage} />
        <stack.Screen name="RegisterPage" component={RegisterPage} />
        <stack.Screen name="Login" component={LoginPage} />
      </stack.Navigator>
  );
}

const HomeBtmNav = () => {

  const windowHeight = Dimensions.get('window').height;
  return(
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
        component={HomePage}
        options={{
          tabBarIcon: ({focused}) => 
            <MaterialCommunityIcons 
              name = {focused ? "home" : "home-outline"}
              size = {35}
              color = {focused ? "#0086ff" : "#676767"} // Updated color to #0086ff
            />
        }}   
      />

      <btmNav.Screen 
        name="Order" 
        component={OrderPage}
        options={{
          tabBarIcon: ({focused}) => 
            <MaterialCommunityIcons 
              name = {focused ? "script-text" : "script-text-outline"}
              size = {35}
              color = {focused ? "#0086ff" : "#676767"} // Updated color to #0086ff
            />
        }} 
      />

      <btmNav.Screen 
        name="Profile" 
        component={ProfilePage}
        options={{
          tabBarIcon: ({focused}) => 
            <MaterialCommunityIcons 
              name = {focused ? "account-settings" : "account-settings-outline"}
              size = {35}
              color = {focused ? "#0086ff" : "#676767"} // Updated color to #0086ff
            />
        }} 
      />

    </btmNav.Navigator>
  )
}

const App = ({route, navigation}: any) => {

  const [initialPage, setInitialPage] = useState('HomePage')
  
  // useEffect(() => {
  //   setInitialPage(route?.params?.loginCheck === 1 ? 'HomePage' : 'Login')
  // })

    return (
      <SafeAreaView style={{flex:1}}>
        <NavigationContainer>
          <stack.Navigator
            initialRouteName={initialPage}
            screenOptions={{
              headerShown: false
            }}
          >
            <stack.Screen name="HomePage" component={HomeBtmNav} />
            <stack.Screen name="SearchPage" component={SearchPage} />
            <stack.Screen name="OrderPage" component={OrderPage} />
            <stack.Screen name="ProductPage" component={ProductPage} />
            <stack.Screen name="Login" component={LoginPage} />
            <stack.Screen name="ShoppingCart" component={ShoppingCart} />
            <stack.Screen name="Profile" component={Profile} />
          </stack.Navigator>
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