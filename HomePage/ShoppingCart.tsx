import React, { useState, useEffect } from 'react';
import { 
    View, 
    StyleSheet, 
    Text, 
    TouchableOpacity,
    FlatList,
    TextInput,
    Button,
    Alert,
    SafeAreaView
} from 'react-native';
import io from 'socket.io-client';

const socket = io('http://127.0.0.1:3000');

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState<any[]>([]);

    useEffect(() => {
        // Fetch cart items when the component mounts
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const response = await fetch('http://127.0.0.1:3000/cart/count');
            const data = await response.json();
            // You can use the count to display items or fetch detailed cart items if needed
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const handleRemoveItem = (id: number) => {
        Alert.alert(
            "Remove Item",
            "Are you sure you want to remove this item?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { 
                    text: "OK", 
                    onPress: async () => {
                        // Handle removal of item
                        try {
                            await fetch(`http://127.0.0.1:3000/remove_from_cart/${id}`, {
                                method: 'DELETE'
                            });
                            fetchCartItems(); // Refresh cart items
                        } catch (error) {
                            console.error('Error removing item:', error);
                        }
                    }
                }
            ]
        );
    };

    const handleQuantityChange = async (id: number, newQty: number) => {
        try {
            await fetch(`http://127.0.0.1:3000/update_cart/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cartqty: newQty })
            });
            fetchCartItems(); // Refresh cart items
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemDetails}>
                <Text style={styles.productName}>{item.productname}</Text>
                <Text style={styles.productType}>Type: {item.producttype}</Text>
                <Text style={styles.productQty}>Quantity: {item.cartqty}</Text>
                <Text style={styles.productPrice}>Price: ${item.totalprice}</Text>
            </View>
            <View style={styles.itemActions}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => handleRemoveItem(item.id)}
                >
                    <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                        style={styles.quantityButton} 
                        onPress={() => handleQuantityChange(item.id, item.cartqty - 1)}
                        disabled={item.cartqty <= 1}
                    >
                        <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.quantityInput}
                        value={item.cartqty.toString()}
                        keyboardType="numeric"
                        onChangeText={(text) => handleQuantityChange(item.id, parseInt(text))}
                    />
                    <TouchableOpacity 
                        style={styles.quantityButton} 
                        onPress={() => handleQuantityChange(item.id, item.cartqty + 1)}
                    >
                        <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    itemContainer: {
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productType: {
        fontSize: 14,
        color: '#555',
    },
    productQty: {
        fontSize: 14,
    },
    productPrice: {
        fontSize: 14,
        color: '#888',
    },
    itemActions: {
        alignItems: 'flex-end',
    },
    button: {
        backgroundColor: '#d9534f',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        backgroundColor: '#5bc0de',
        padding: 10,
        borderRadius: 5,
    },
    quantityButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    quantityInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 5,
        width: 50,
        textAlign: 'center',
    },
});

export default ShoppingCart;
