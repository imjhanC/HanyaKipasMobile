import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet,TouchableNativeFeedback} from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const App = ({ route,navigation }:any) => {

  const getImageSource = (imgBase64: string) => {
    return { uri: `data:image/jpeg;base64,${imgBase64}` };
  };
  const { 
    product_name, product_qty, product_desc,
    product_img, product_price,product_type} = route.params;
  
  return (
      <View style={styles.productPageContainer}>
        <TouchableNativeFeedback
          onPress={() => navigation.navigate('HomePage')}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            style={{
              fontSize: 45,
              paddingTop: 15,
              paddingLeft: 5,
              color: '#487df7',
            }}
          />
        </TouchableNativeFeedback>
        { product_img && (
          <Image 
            source={ product_img} 
            style={styles.productImg}
          />
        )}
        <Text style={styles.productName}>{product_name}</Text>
        <Text style={styles.productDesc}>{product_desc}</Text>
        <Text style={styles.productQty}>Quantity: { product_qty}</Text>
        <Text style={styles.productPrice}>Price: RM{ product_price}</Text>
        <Text style={styles.productType}>Type: { product_type}</Text> 
        <Image 
          source={getImageSource(product_img)}  
          style={styles.productImg}
        />
        
      </View>
  );
};

export default App;

// Add appropriate styles
const styles = StyleSheet.create({
   productPageContainer: {
    flex: 1,
    padding: 8,  // Adjusted padding
    backgroundColor: 'rgba(0, 0, 0, 0.1)',  // Semi-transparent black tint
  },
  productImg: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  productDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  productQty: {
    fontSize: 14,
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  productType: {
    fontSize: 14,
    color: '#666',
  },
});


