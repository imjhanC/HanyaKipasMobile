import React, { useState, useRef } from 'react';
import { View, TextInput, Text, Alert, StyleSheet, Image, Animated, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';

const LoginScreen = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
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
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert("Error", "Invalid username or password.");
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
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={loading}
      >
        <Animated.View style={[styles.button, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
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
    backgroundColor: '#383838',
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
    borderColor: '#00a6e3',
    borderWidth: 5,
    fontSize: 18,
    paddingHorizontal: 8,
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 20,
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
});

export default LoginScreen;
