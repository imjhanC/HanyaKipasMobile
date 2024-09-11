import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import axios from 'axios';

// Define the types
interface Product {
  product_name: string;
  product_qty: number;
  price_per_unit: number;
  total_price: number;
}

interface Order {
  order_id: number;
  cusname: string;
  cus_addr: string;
  cus_phoneno: string;
  created_at: string;
  products: Product[];
}

interface OrderGroup {
  timestamp: string;
  orders: Order[];
}

const OrderPage = () => {
  const [orders, setOrders] = useState<OrderGroup[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch orders for the current logged-in user
  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3000/orders/current'); // Adjust the API endpoint
      const ordersByTimestamp = response.data.orders;

      // Convert the object to an array of { timestamp, orders }
      const ordersArray = Object.keys(ordersByTimestamp).map(timestamp => ({
        timestamp,
        orders: ordersByTimestamp[timestamp]
      }));

      setOrders(ordersArray);
    } catch (error) {
      setErrorMessage('Failed to fetch orders');
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchOrders();

    // Set up polling
    const intervalId = setInterval(fetchOrders, 3000); // Fetch every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Render each product in an order
  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <Text style={styles.productName}>Product: {item.product_name}</Text>
      <Text style={styles.productDetail}>Qty: {item.product_qty}</Text>
      <Text style={styles.productDetail}>Unit Price: ${item.price_per_unit.toFixed(2)}</Text>
      <Text style={styles.productDetail}>Total: ${item.total_price.toFixed(2)}</Text>
    </View>
  );

  // Render each order with its products
  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderBox}>
      <Text style={styles.orderId}>Order ID: {item.order_id}</Text>
      <Text style={styles.orderDetail}>Customer: {item.cusname}</Text>
      <Text style={styles.orderDetail}>Address: {item.cus_addr}</Text>
      <Text style={styles.orderDetail}>Phone: {item.cus_phoneno}</Text>

      <ScrollView style={styles.productList}>
        <FlatList
          data={item.products}  // Assuming `products` is a list of product objects for each order
          renderItem={renderProductItem}
          keyExtractor={(product) => product.product_name}
        />
      </ScrollView>
    </View>
  );

  // Render the orders grouped by timestamp
  const renderOrderGroup = ({ item }: { item: OrderGroup }) => (
    <View>
      <Text style={styles.timestamp}>Time : {item.timestamp}</Text>
      <FlatList
        data={item.orders}  // Array of orders for each timestamp
        renderItem={renderOrderItem}
        keyExtractor={(order) => order.order_id.toString()}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <FlatList
        data={orders}
        renderItem={renderOrderGroup}
        keyExtractor={(item) => item.timestamp}
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
    color:'#487df7',
  },
  orderList: {
    paddingBottom: 20,
  },
  orderBox: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timestamp: {
    fontSize: 21,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'black',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  productList: {
    maxHeight: 150,
    marginTop: 10,
  },
  productItem: {
    backgroundColor: '#e8e8e8',
    padding: 10,
    marginVertical: 5,
    borderRadius: 6,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  productDetail: {
    fontSize: 12,
    color: '#666',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default OrderPage;
