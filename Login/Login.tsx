import React, { useState, useRef } from 'react';
import { View, TextInput, Text, TouchableOpacity, Dimensions, Alert, StyleSheet, Image, Animated, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { NavigationHelpersContext } from '@react-navigation/native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const LoginScreen = ({navigation}:any) => {
  
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  // Create an animated value for scaling the button
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:3000/login', {
        username,
        password,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Login successful!");
        // Navigate to the next screen or perform other actions on successful login
        navigation.navigate('HomePage', {loginCheck : 1})
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert("Error", "Invalid username or password.");
        console.log(error)
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
    }).start(() => handleLogin()); // Trigger login on release
  };

  return (
    <View style={styles.container}>
      <Image 
        style={styles.image}
        source={require('../HanyaKipasLogo.png')}
      />
      <Text style={styles.title}>Welcome to HanyaKipas's Login Page</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
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
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={loading}
      >
        <Animated.View style={[styles.button, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={()=> navigation.navigate('Profile',{screen:'RegisterPage'})}>
        <Text style={styles.registerText}>
          New to HanyaKipas?{" "}
          <Text style={styles.registerLink}>Register an account here</Text>
        </Text>
      </TouchableWithoutFeedback>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding:10,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#383838',
    width: windowWidth,
    height: windowHeight
  },
  title: {
    fontSize: 24,
    fontFamily: 'tahoma',
    color: '#00a6e3',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    width:'100%',
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
  image: {
    marginVertical: -50,
    alignContent: 'center',
    maxWidth: 400,
    maxHeight: 300,
    marginBottom: 24,
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
  registerText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },
  registerLink: {
    color: '#00a6e3',
    textDecorationLine: 'underline',
  },
  passwordContainer:{
    flexDirection:'row',
  },
  iconContainer: {
    position: 'absolute',
    top:'15%',
    right: 15,
    zIndex:1
  },
});

export default LoginScreen;
