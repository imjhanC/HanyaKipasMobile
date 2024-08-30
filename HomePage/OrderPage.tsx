import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const OrderPage = () => {
  // Mock data for order history
  const orders = [
    { id: '1', orderNumber: '1001', date: '2024-08-01', status: 'Delivered' },
    { id: '2', orderNumber: '1002', date: '2024-08-15', status: 'Processing' },
    { id: '3', orderNumber: '1003', date: '2024-08-20', status: 'Shipped' },
    { id: '4', orderNumber: '1004', date: '2024-08-25', status: 'Cancelled' },
  ];

  // Render individual order item
  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
      <Text style={styles.orderDate}>Date: {item.date}</Text>
      <Text style={styles.orderStatus}>Status: {item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.orderList}
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderList: {
    paddingBottom: 20,
  },
  orderItem: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderStatus: {
    fontSize: 14,
    color: '#888',
  },
});

export default OrderPage;
