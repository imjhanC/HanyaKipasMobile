import React, { Component } from 'react';
import {
  StyleSheet,
  Button,
  Text,
  View
} from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

type Props = {
    navigation: NavigationProp<ParamListBase>;
};

type States = {
    aState: number;
};

export default class FirstScreen extends Component<Props, States> {
  static navigationOptions = {
    title: 'First Screen',
  };

  constructor(props: any) {
      super(props);

      this.state = {
          aState: 0,
      };

      console.log('[+] <FirstScreen> constructor() invoked');
  }

  componentDidMount() {
      console.log('[+] <FirstScreen> componentDidMount() invoked')
  }

  componentDidUpdate() {
      console.log('[+] <FirstScreen> componentDidUpdate() invoked')
  }

  componentWillUnmount() {
      console.log('[+] <FirstScreen> componentWillUnmount() invoked')
  }

  render() {
    console.log('[+] <FirstScreen> render() invoked');

    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          First Screen
        </Text>
        <View style={styles.button}>
          <Button
            title="Go to Second Screen"
            onPress={() => {this.props.navigation.navigate('Second')}}
          />
        </View>
        <Text style={styles.title}>
          {this.state.aState}
        </Text>
        <View style={styles.button}>
          <Button
            title="Update State"
            onPress={() => {this.setState({
                aState: this.state.aState + 1,
            })}}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20,
    color: 'black'
  },
  button: {
      margin: 10,
  }
});