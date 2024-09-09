import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableNativeFeedback, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AnimatedButton from './AnimatedButton'; // Import the AnimatedButton component
import io from 'socket.io-client';
import axios from 'axios';

const windowHeight = Dimensions.get('window').height;

const socket = io('http://127.0.0.1:3000'); // Adjust the URL if needed

const ProductPage = ({ route, navigation }: any) => {
  const [recommendations, setRecommendations] = useState([]);
  const [quantity, setQuantity] = useState(1); // Start with quantity of 1
  const [cusname, setCusname] = useState(''); // Placeholder for customer name

  const { 
    product_name, product_qty, product_desc,
    product_img, product_price, product_type 
  } = route.params;

  useEffect(() => {
    // Fetch customer name
    const fetchUserName = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/current_user');
        if (response.status === 200) {
          setCusname(response.data.username);
          console.log(response.data.username);
        } else {
          console.error('Failed to fetch user name');
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    fetchUserName();

    // Request recommendations
    socket.emit('get_recommendations', { current_product_name: product_name });

    socket.on('recommendations', (data) => {
      setRecommendations(data);
    });

    return () => {
      socket.off('recommendations');
    };
  }, [product_name]);

  const getImageSource = (imgBase64: string) => {
    return { uri: `data:image/jpeg;base64,${imgBase64}` };
  };

  const handleAddToCart = async () => {
    if (quantity > 0) {
      try {
        await axios.post('http://127.0.0.1:3000/add_to_cart', {
          cusname,
          productname: product_name,
          cartqty: quantity,
          totalprice: quantity * product_price,
          producttype: product_type
        });
        console.log('Added to cart!', quantity);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  };

  const handleRecommendationPress = (item: any) => {
    // Reset quantity to 1 and navigate to the selected product page
    setQuantity(1);
    navigation.navigate('ProductPage', {
      product_name: item.product_name,
      product_qty: item.product_qty,
      product_desc: item.product_desc,
      product_img: item.product_img,
      product_price: item.product_price,
      product_type: item.product_type,
    });
  };

  const renderRecommendation = ({ item }: any) => (
    <TouchableOpacity onPress={() => handleRecommendationPress(item)} style={styles.recommendationBox}>
      { item.product_img && (
        <Image
          source={getImageSource(item.product_img)}
          style={styles.recommendationImg}
        />
      )}
      <Text style={styles.recommendationName}>{item.product_name}</Text>
      <Text style={styles.recommendationPrice}>RM{item.product_price}</Text>
    </TouchableOpacity>
  );

  const incrementQuantity = () => {
    if (quantity < product_qty) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) { // Minimum quantity is 1
      setQuantity(quantity - 1);
    }
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
          <Text style={styles.productQty}>Available Quantity: {product_qty}</Text>
        </View>
        <Text style={styles.productType}>Type: {product_type}</Text>

        {/* Container for quantity selector and add to cart button */}
        <View style={styles.quantityAndButtonContainer}>
          <View style={styles.quantitySelectorContainer}>
            <TouchableOpacity onPress={decrementQuantity} style={styles.quantityButton}>
              <Text style={styles.quantityText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityDisplay}>{quantity}</Text>
            <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
              <Text style={styles.quantityText}>+</Text>
            </TouchableOpacity>
          </View>
          <AnimatedButton onPress={handleAddToCart}/>
        </View>

        <View style={styles.separator} />
        <Text style={styles.productDesc}>Description: {product_desc}</Text>

        <View style={styles.recommendationsContainer}>
          <Text style={styles.recommendationsTitle}>You might also like:</Text>
          <FlatList
            data={recommendations}
            renderItem={renderRecommendation}
            keyExtractor={(item: any) => item.product_name}
            horizontal
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductPage;

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
    marginBottom: 16,
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
  recommendationsContainer: {
    marginTop: 16,
  },
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'red',
  },
  recommendationBox: {
    width: 150,
    marginRight: 10,
    alignItems: 'center',
  },
  recommendationImg: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  recommendationName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 4,
  },
  recommendationPrice: {
    fontSize: 14,
    color: '#60d2f7',
  },
  // Styles for Quantity Selector and Add to Cart Button
  quantityAndButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  quantitySelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Take up the remaining space
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: '#60d2f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 20,
    color: 'white',
  },
  quantityDisplay: {
    fontSize: 20,
    marginHorizontal: 10,
    color: '#000',
  },
  addToCartButton: {
    width: 120, // Adjust the width as needed
  },
});
