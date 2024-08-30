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

const App = (navigation: any) =>{
    const [text, onChangeText] = React.useState();
    
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        image: 'https://via.placeholder.com/150',
      };

    return (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: user.image }} style={styles.profileImage} />
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>

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
    profileImageContainer: {
      marginBottom: 20,
    },
    profileImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 10,
    },
    email: {
      fontSize: 18,
      color: '#666',
      marginBottom: 10,
    },
    bio: {
      fontSize: 16,
      textAlign: 'center',
      marginVertical: 10,
      paddingHorizontal: 20,
    },
  });