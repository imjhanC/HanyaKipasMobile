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

    const updateCartQty = (itemId: number, qtyChange: number) => {
        socket.emit('update_cart_qty', { itemId, qtyChange });
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
                                source={{ uri: `data:image/png;base64,${item.product_img}` }} 
                                style={styles.productImage}
                            />
                        )}
                        <View style={styles.itemDetails}>
                            <Text style={styles.cartItemText}>{item.productname}</Text>
                            <Text style={styles.cartItemText}>Total Price: ${item.totalprice}</Text>

                            <View style={styles.qtyControl}>
                                <TouchableOpacity onPress={() => updateCartQty(item.id, -1)}>
                                    <Text style={styles.qtyButton}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.qtyText}>{item.cartqty}</Text>
                                <TouchableOpacity onPress={() => updateCartQty(item.id, 1)}>
                                    <Text style={styles.qtyButton}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
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
        flexDirection: 'row', 
        alignItems: 'center',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 10,
    },
    cartItemText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    productImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    qtyControl: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qtyButton: {
        fontSize: 24,
        fontWeight: 'bold',
        marginHorizontal: 10,
        padding: 5,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
    },
    qtyText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ShoppingCart;
