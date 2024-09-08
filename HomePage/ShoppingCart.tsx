import React, { useState, useEffect } from 'react';
import { 
    View, 
    StyleSheet, 
    Text, 
    TouchableOpacity,
    FlatList,
    Alert,
    Image,  // Import Image
    TouchableNativeFeedback,
} from 'react-native';
import io from 'socket.io-client';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const socket = io('http://127.0.0.1:3000');

const ShoppingCart = ({ navigation }: any) => {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<string | null>(null);

    // Fetch current user
    useEffect(() => {
        fetch('http://127.0.0.1:3000/current_user')
            .then(response => response.json())
            .then(data => {
                if (data.username) {
                    setCurrentUser(data.username);
                    fetchCartItems(data.username);
                } else {
                    Alert.alert('Error', 'No user logged in');
                }
            })
            .catch(error => Alert.alert('Error', error.toString()));
    }, []);

    // Fetch cart items for the current user
    const fetchCartItems = (username: string) => {
        fetch(`http://127.0.0.1:3000/cart/${username}`)
            .then(response => response.json())
            .then(data => setCartItems(data.cartItems))
            .catch(error => Alert.alert('Error', error.toString()));
    };

    return (
        <View style={styles.productPageContainer}>
            <TouchableNativeFeedback onPress={() => navigation.navigate('HomePage')}>
                <MaterialCommunityIcons
                    name="arrow-left"
                    style={styles.backIcon}
                />
            </TouchableNativeFeedback>
            <Text style={styles.headerText}>Shopping Cart</Text>

            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.cartItemBox}>
                        {/* Display product image */}
                        {item.product_img && (
                            <Image
                                source={{ uri: `data:image/png;base64,${item.product_img}` }}  // Render base64 image
                                style={styles.productImage}
                            />
                        )}
                        <Text style={styles.cartItemText}>
                            {item.productname} - {item.cartqty} pcs
                        </Text>
                        <Text style={styles.cartItemText}>Total Price: ${item.totalprice}</Text>
                    </View>
                )}
            />
        </View>
    );
};

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
    headerText: {
        position: 'absolute',
        left: '50%',
        transform: [{ translateX: -80 }],
        fontSize: 30,
        fontWeight: 'bold',
        color: '#487df7',
        paddingTop: 21,
    },
    cartItemBox: {
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    cartItemText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    productImage: {
        width: 100,  // Set appropriate size for the image
        height: 100,
        resizeMode: 'contain',
        marginBottom: 10,
    },
});

export default ShoppingCart;
