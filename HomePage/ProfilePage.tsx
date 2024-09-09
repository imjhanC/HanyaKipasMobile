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
    Alert,
} from 'react-native';
import Login from '../Login/Login.tsx';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const windowWidth = Dimensions.get('window').width;
const serverUrl = 'http://127.0.0.1:3000/'

const App = ({ navigation }: any) =>{

    const [currentUser, setCurrentUser] = useState('');

    useEffect(() => {
      //Fetch current user from Flask server
      fetch(`${serverUrl}current_user`)
        .then((response) => response.json())
        .then((data) => {
          setCurrentUser(data.username);
        })
        .catch((error) => console.error('Error fetching products: ', error));
    }, []);
    
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

    const logout = async () => {
      try {
        const response = await fetch(`${serverUrl}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const data = await response.json();
        console.log(data.message); // Handle the response message
        Alert.alert(
          "Successfully Logout!",
          "See You Next Time!",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate('Login')
            }
          ]
        )
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

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
              navigation.navigate('HomePage', {screen: 'Order'});
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
            <TouchableNativeFeedback onPress={() => {
              logout();
            }}>
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
      height: 70,
      width: windowWidth * 0.8,
      borderRadius: 12.5,
      borderColor: '#ced5e0',
      borderWidth: 1.5,
      margin: 5,
      justifyContent: 'center',
      paddingLeft: 15,
    },
    individualBodyText: {
      fontSize: 20,
      fontWeight: '500',
      color: '#0b3370',
    },
    logoutContainer: {
      height: 70,
      width: windowWidth * 0.8,
      borderRadius: 12.5,
      borderColor: '#ce5540',
      borderWidth: 2,
      margin: 5,
      justifyContent: 'center',
      paddingLeft: 15,
    },
    logoutText: {
      fontSize: 20,
      fontWeight: '500',
      color: '#9b3370',
    },
  });