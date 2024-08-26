import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import io from 'socket.io-client';

const App = () => {
  const [products, setProducts] = useState([]);
  const socket = io('http://127.0.0.1:5000/products');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      socket.emit('get_products');
    });

    socket.on('products', (data) => {
      console.log('Products received:', data);
      setProducts(data);
    });

    return () => {
      socket.off('connect');
      socket.off('products');
      socket.disconnect();
    };
  }, [socket]);

  const renderProduct = ({ item }) => (
    <View style={styles.productBox}>
      <Text>Name: {item.name}</Text>
      <Text>Quantity: {item.quantity}</Text>
      <Text>Price: ${item.price.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  productBox: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default App;
