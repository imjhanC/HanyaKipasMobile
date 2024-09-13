import React, { useState, useEffect } from 'react';
import { TouchableNativeFeedback, View, Text, StyleSheet, Dimensions } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
}

const windowWidth = Dimensions.get('window').width;

export const Button: React.FC<ButtonProps> = ({ title, onPress }) => {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    if (isPressed) {
      console.log('Button is pressed');
    }
  }, [isPressed]);

  return (
    <TouchableNativeFeedback
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
    >
      <View style={[styles.buttonContainer, isPressed && { backgroundColor: '#ddd' }]}>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: 60,
    width: windowWidth * 0.8,
    borderRadius: 12.5,
    borderColor: '#ced5e0',
    borderWidth: 1.5,
    margin: 5,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#0b3370',
  },
});
