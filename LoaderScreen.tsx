// LoaderScreen.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

const LoaderScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Set a timeout to navigate back to the main screen after the animation ends (e.g., 3 seconds)
    const timer = setTimeout(() => {
      navigation.navigate('App');
    }, 3000);

    return () => clearTimeout(timer); // Clear the timer on component unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('./path-to-your-lottie-file.json')}
        autoPlay
        loop={false} // Set to false if you want the animation to play once
        style={styles.lottie}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // You can customize the background color
  },
  lottie: {
    width: 200, // Adjust the size of the animation
    height: 200,
  },
});

export default LoaderScreen;
