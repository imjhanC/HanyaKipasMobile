import React, { useState, useEffect } from 'react';
import { 
    View, 
    StyleSheet, 
    TextInput, 
    Text, 
    TouchableNativeFeedback,
    FlatList,
    Dimensions,
    SafeAreaView,
    Button,
    ScrollView,
    Image,
} from 'react-native';
import Login from '../Login/Login.tsx';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const App = ({ navigation }: { navigation: any }) =>{

    const [currentUser, setCurrentUser] = useState('Tan Kye Wen');

    // useEffect(() => {
    //   //Fetch current user from Flask server
    //   fetch('http://127.0.0.1:3000/current_user')
    //     .then((response) => response.json())
    //     .then((data) => {
    //       setCurrentUser(data.username);
    //     })
    //     .catch((error) => console.error('Error fetching products: ', error));
    // }, []);
    
    const [profileImage, setProfileImage] = useState(require('./ProfileImages/fan1.png'));
    useEffect(() => {
      const profileImageOptions = [require('./ProfileImages/fan1.png'), require('./ProfileImages/fan2.png'), require('./ProfileImages/fan3.png')]
      let currentIndex = 0;

      const intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % profileImageOptions.length;
        setProfileImage(profileImageOptions[currentIndex]);
      }, 30000);
  
      return () => clearInterval(intervalId);
    }, [])

    return (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Hanya Kipas.</Text>
          </View>
          <View style={styles.profileImageContainer}>
            <Image source={profileImage} style={styles.profileImage} />
          </View>
          <Text style={styles.name}>{currentUser}</Text>
          <View style={styles.bodyContainer}>
            <TouchableNativeFeedback onPress={() => {
              navigation.navigate('HomePage', {screen: 'OrderPage'});
            }}>
              <View style={styles.individualBodyContainer}>
                <Text style={styles.individualBodyText}>My Orders</Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={() => {
              navigation.navigate('UpdatePassword');
            }}>
              <View style={styles.individualBodyContainer}>
                <Text style={styles.individualBodyText}>Update Password</Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback>
              <View style={styles.logoutContainer}>
                <Text style={styles.logoutText}>Logout</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </ScrollView>
      );
    };

export default App;

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#fff',
    },
    header: {
      paddingBottom: 40,
    },
    headerText: {
      color: '#6888ba',
      fontSize: 25,
      fontWeight: '900',
      fontStyle: 'italic',
      borderBottomWidth: 1,
    },
    profileImageContainer: {
      marginBottom: 20,
    },
    profileImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
    },
    name: {
      color: 'black',
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 10,
    },
    bodyContainer: {
      alignContent: 'center',
      paddingHorizontal: 50,
      paddingTop: 25,
    },
    individualBodyContainer: {
      borderRadius: 50,
      borderColor: '#b0ceff',
      borderWidth: 1,
    },
    individualBodyText: {

    },
    logoutContainer: {

    },
    logoutText: {

    },
  });