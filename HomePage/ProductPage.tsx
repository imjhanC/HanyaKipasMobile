import React from 'react';
import { View, Text, Image, StyleSheet, TouchableNativeFeedback, ScrollView } from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AnimatedButton from './AnimatedButton'; // Import the AnimatedButton component

const App = ({ route, navigation }: any) => {

  const getImageSource = (imgBase64: string) => {
    return { uri: `data:image/jpeg;base64,${imgBase64}` };
  };

  const { 
    product_name, product_qty, product_desc,
    product_img, product_price, product_type 
  } = route.params;

  const handleAddToCart = () => {
    // Handle the add to cart action here
    console.log('Added to cart!');
  };

  return (
    <ScrollView style={styles.productPageContainer}>
      <TouchableNativeFeedback onPress={() => navigation.navigate('HomePage')}>
        <MaterialCommunityIcons
          name="arrow-left"
          style={styles.backIcon}
        />
      </TouchableNativeFeedback>
      
      { product_img && (
        <Image 
          source={getImageSource(product_img)}  
          style={styles.productImg}
        />
      )}
      
      <View style={styles.textContainer}>
        <Text style={styles.productName}>{product_name}</Text>
        <View style={styles.priceQtyContainer}>
          <Text style={styles.productPrice}>Price: RM{product_price}</Text>
          <Text style={styles.productQty}>Quantity: {product_qty}</Text>
        </View>
        <Text style={styles.productType}>Type: {product_type}</Text>
        <AnimatedButton onPress={handleAddToCart} />
        <View style={styles.separator} />
        <Text style={styles.productDesc}>Description: {product_desc}</Text>
      </View>
    </ScrollView>
  );
};

export default App;

// Add appropriate styles
const styles = StyleSheet.create({
  productPageContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  backIcon: {
    fontSize: 45,
    paddingTop: 15,
    paddingLeft: 5,
    color: '#487df7',
  },
  productImg: {
    width: '100%',
    height: 400,
    resizeMode: 'contain',
    marginBottom: 5,
    borderWidth: 2,
    borderColor: '#383838',
    borderRadius: 10,
    overflow: 'hidden',
  },
  textContainer: {
    paddingHorizontal: 5,
  },
  productName: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#006aff',
  },
  productDesc: {
    fontSize: 16,
    color: 'black',
    marginBottom: 8,
  },
  priceQtyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#60d2f7',
  },
  productQty: {
    fontSize: 17,
  },
  productType: {
    fontSize: 17,
    color: '#666',
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
});
