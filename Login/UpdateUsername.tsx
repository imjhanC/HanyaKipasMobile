import React, { useState,useRef } from "react";
import {
    View,
    TouchableNativeFeedback,
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
    Dimensions,
    StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from 'axios';
const windowWidth = Dimensions.get('window').width;

const UpdateUsername = ({navigation}:any) =>{
    const [newUsername, setNewUsername] = useState<string>('');
    const [newUsernameChk, setNewUsernameChk] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handleUsernameChange = async () => {
        if (!password || !newUsername || !newUsernameChk) {
          Alert.alert("Error", "Please enter password, new username and new username check.");
          return;
        }
        else if (newUsername !== newUsernameChk) {
            Alert.alert("Error", "Username do not match.");
            return; 
          }
        setLoading(true);
        try {
          const response = await axios.post('http://127.0.0.1:3000/change-username', {
            password,
            newUsername,
          });
    
          if (response.status === 201) {
            Alert.alert(
              "Success", 
              "Updated username successfully! Username will be updated in the next login.", 
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
              Alert.alert("Error", "Incorrect Username inputted.");
            } else {
              Alert.alert("Error", "Username Change failed. Please try again.");
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
        }).start(() => handleUsernameChange());
      };

    return(
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
            <Text style={styles.title}>Update Your Username</Text>
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
                placeholder="New Username"
                value={newUsername}
                onChangeText={setNewUsername}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                style={styles.passwordInput}
                placeholder="Confirm New Username"
                value={newUsernameChk}
                onChangeText={setNewUsernameChk}
                />
            </View>
            <TouchableWithoutFeedback
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={loading}
            >
                <Animated.View style={[styles.button, { transform: [{ scale: scaleAnim }] }]}>
                <Text style={styles.buttonText}>{loading ? "Updating..." : "Update Username"}</Text>
                </Animated.View>
            </TouchableWithoutFeedback>
        </View>
    );
}

export default UpdateUsername;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
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
      passwordInput:{
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
      usernameInput: {
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
})