import React, { useState, useEffect } from 'react';
import { 
    View, 
    StyleSheet, 
    Text, 
    FlatList,
    Alert,
    Image, 
    TouchableNativeFeedback,
    TouchableOpacity
} from 'react-native';
import io from 'socket.io-client';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const socket = io('http://127.0.0.1:3000');

const ShoppingCart = ({ navigation }: any) => {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<string | null>(null);

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

        socket.on('cart_update', (updatedCart) => {
            setCartItems(updatedCart);
        });

        return () => {
            socket.off('cart_update');
        };
    }, []);

    const fetchCartItems = (username: string) => {
        fetch(`http://127.0.0.1:3000/cart/${username}`)
            .then(response => response.json())
            .then(data => setCartItems(data.cartItems))
            .catch(error => Alert.alert('Error', error.toString()));
    };

    const deleteCartItem = (productname: string) => {
        fetch(`http://127.0.0.1:3000/cart/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: currentUser, productname }),
        })
        .then(response => {
            if (response.ok) {
                Alert.alert('Success', 'Item removed from cart');
                fetchCartItems(currentUser as string);
            } else {
                response.json().then(data => {
                    Alert.alert('Error', data.error);
                });
            }
        })
        .catch(error => Alert.alert('Error', error.toString()));
    };

    const handleCheckout = () => {
        const checkoutData = cartItems.map(item => ({
            productImage: item.product_img,
            productName: item.productname,
            cartQty: item.cartqty,
            totalPrice: item.totalprice,
        }));
        
        navigation.navigate('PaymentPage', { checkoutData });
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
                        <MaterialCommunityIcons 
                            name="bucket-outline" 
                            style={styles.removeIcon}
                            onPress={() => deleteCartItem(item.productname)}
                        />
                        {/* Display product image */}
                        {item.product_img && (
                            <Image
                                source={{ uri: `data:image/png;base64,${item.product_img}` }} 
                                style={styles.productImage}
                            />
                        )}
                        <View style={styles.itemDetails}>
                            <Text style={styles.cartItemText}>{item.productname}</Text>
                            <Text style={styles.cartItemTextsub}>Quantity : {item.cartqty}</Text>
                            <Text style={styles.cartItemTextsub}>Total Price: ${item.totalprice}</Text>
                        </View>
                    </View>
                )}
            />

            {/* Checkout Button */}
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
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
        flexDirection: 'row', 
        alignItems: 'center',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 10,
    },
    cartItemText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#487df7',
    },
    cartItemTextsub:{
        fontWeight: 'bold',
        fontSize: 16,
    },
    productImage: {
        width: 80,   // Fixed width
        height: 120,  // Fixed height
        resizeMode: 'contain', // Adjust image fitting
        borderRadius: 8, // Optional: for rounded corners
    },
    removeIcon: {
        fontSize: 30,
        color: 'red',
        paddingRight: 10,
    },
    checkoutButton: {
        marginTop: 20,
        backgroundColor: '#487df7',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ShoppingCart;
