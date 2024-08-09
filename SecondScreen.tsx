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
    bState: number;
};

export default class SecondScreen extends Component<Props, States> {
  static navigationOptions = {
    title: 'Second Screen',
  };

  constructor(props: any) {
      super(props);

      this.state = {
          bState: 0,
      };

      console.log('[+] <SecondScreen> constructor() invoked')
  }

  componentDidMount() {
      console.log('[+] <SecondScreen> componentDidMount() invoked')
  }

  componentDidUpdate() {
      console.log('[+] <SecondScreen> componentDidUpdate() invoked')
  }

  componentWillUnmount() {
      console.log('[+] <SecondScreen> componentWillUnmount() invoked')
  }

  render() {
    console.log('[+] <SecondScreen> render() invoked');

    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Second Screen
        </Text>
        <Text style={styles.title}>
          {this.state.bState}
        </Text>
        <View style={styles.button}>
          <Button
            title="Update State"
            onPress={() => {this.setState({
                bState: this.state.bState - 1,
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