import React, { useState, useRef } from 'react';
import { 
  View, 
  TextInput, 
  Dimensions, 
  Text, 
  Alert, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  TouchableWithoutFeedback, 
  TouchableNativeFeedback 
} from 'react-native';
import axios from 'axios';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const windowWidth = Dimensions.get('window').width;

const RegisterPage = ({navigation}:any) => {

  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordChk, setNewPasswordChk] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordChkVisible, setPasswordChkVisible] = useState(false);

  // Create an animated value for scaling the button
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || ! newPasswordChk) {
      Alert.alert("Error", "Please enter old password, new password, and new password check.");
      return;
    }
    else if (newPassword !== newPasswordChk) {
      Alert.alert("Error", "Passwords do not match.");
      return; 
    }
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:3000/change-password', {
        oldPassword,
        newPassword,
      });

      if (response.status === 201) {
        Alert.alert(
          "Success", 
          "Updated password successfully!", 
          [
            { 
              text: "OK", 
              onPress: () => navigation.goBack() 
            }
          ]
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 403) {
          Alert.alert("Error", "Incorrect Password inputted.");
        } else {
          Alert.alert("Error", "Password Change failed. Please try again.");
          console.log(error)
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
    }).start(() => handlePasswordChange());
  };

  return (
    <View style={styles.container}>
      <TouchableNativeFeedback
          onPress={() => navigation.goBack()}
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
      
      <Text style={styles.title}>Update Your Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Old Password"
          value={oldPassword}
          onChangeText={setOldPassword}
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
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
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
          placeholder="Confim New Password"
          value={newPasswordChk}
          onChangeText={setNewPasswordChk}
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
          <Text style={styles.buttonText}>{loading ? "Updating..." : "Update Password"}</Text>
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
  oldPasswordInput:{
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
