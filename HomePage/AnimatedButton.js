import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const AnimatedButton = ({ onPress }) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [colorAnim] = useState(new Animated.Value(0));

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: false,
      }).start(),
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }).start(),
    ]);
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }).start(),
      Animated.timing(colorAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start(),
    ]);
  };

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ff7e79', '#ff8c00'],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.buttonContainer}
    >
      <Animated.View
        style={[
          styles.button,
          {
            transform: [{ scale: scaleAnim }],
            backgroundColor,
          },
        ]}
      >
        <Text style={styles.buttonText}>Add to Cart</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 130, // Increased horizontal padding for wider button
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AnimatedButton;
