import React, { useState, useRef } from 'react';
import { View, TextInput, Dimensions, Text, Alert, StyleSheet, TouchableOpacity, Animated, TouchableWithoutFeedback, TouchableNativeFeedback } from 'react-native';
import axios from 'axios';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const RegisterPage = ({navigation}:any) => {
  
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordChk, setPasswordChk] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordChkVisible, setPasswordChkVisible] = useState(false);

  // Create an animated value for scaling the button
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleRegister = async () => {
    if (!username || !password || !passwordChk) {
      Alert.alert("Error", "Please enter username, password and confirm password.");
      return;
    }
    else if (password !== passwordChk) {
      Alert.alert("Error", "Passwords do not match.");
      return; 
    }
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:3000/register', {
        username,
        password,
      });

      if (response.status === 201) {
        Alert.alert(
          "Success", 
          "User registered successfully!", 
          [
            { 
              text: "OK", 
              onPress: () => navigation.navigate('Login') 
            }
          ]
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 409) {
          Alert.alert("Error", "Username already exists.");
        } else {
          Alert.alert("Error", "Registration failed. Please try again.");
        }
      } else {
        console.error(error);
        Alert.alert("Error", "Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 2.9, // Scale down the button
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1, // Scale back to original size
      friction: 3,
      useNativeDriver: true,
    }).start(() => handleRegister());
  };

  return (
    <View style={styles.container}>
      <TouchableNativeFeedback
          onPress={() => navigation.navigate('Profile',{screen: 'Login'})}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            style={{
              fontSize: 45,
              paddingLeft: 5,
              color: '#487df7',
              marginBottom:'auto'
            }}
          />
        </TouchableNativeFeedback>
      
      <Text style={styles.title}>Welcome to HanyaKipas's Register Page</Text>
      <TextInput
        style={styles.usernameInput}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.iconContainer}
          >
            <MaterialCommunityIcons
              name={passwordVisible ? "eye" : "eye-off"}
              size={24}
              color="#c0c0c0"
            />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confim Password"
          value={passwordChk}
          onChangeText={setPasswordChk}
          secureTextEntry={!passwordChkVisible}
        />
        <TouchableOpacity
            onPress={() => setPasswordChkVisible(!passwordChkVisible)}
            style={styles.iconContainer}
          >
            <MaterialCommunityIcons
              name={passwordChkVisible ? "eye" : "eye-off"}
              size={24}
              color="#c0c0c0"
            />
        </TouchableOpacity>
      </View>
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={loading}
      >
        <Animated.View style={[styles.button, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.buttonText}>{loading ? "Registering..." : "Register"}</Text>
        </Animated.View>
      </TouchableWithoutFeedback>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontFamily: 'tahoma',
    fontWeight:'700',
    color: '#00a6e3',
    marginBottom: 'auto',
    textAlign: 'center',
  },
  inputContainer:{
    flexDirection:'row',
    width: windowWidth*0.9,
  },
  usernameInput:{
    height: 50,
    width: '100%',
    marginLeft:'auto',
    marginRight:'auto',
    borderColor: '#00a6e3',
    borderWidth: 5,
    fontSize: 18,
    paddingHorizontal: 15,
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 20,
    color:'black',
  },
  passwordInput: {
    height: 50,
    width: '100%',
    marginLeft:'auto',
    marginRight:'auto',
    borderColor: '#00a6e3',
    borderWidth: 5,
    fontSize: 18,
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 20,
    color:'black',
    paddingLeft:15,
    paddingRight:50
  },
  iconContainer: {
    position: 'absolute',
    top:'15%',
    right: 15,
    zIndex:1
  },
  button: {
    marginVertical: 40,
    backgroundColor: '#00a6e3',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
});

export default RegisterPage;
