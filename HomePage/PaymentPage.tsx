import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, Image, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import io from 'socket.io-client';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const socket = io('http://127.0.0.1:3000');

const PaymentPage = ({ route, navigation }: any) => {
    const { checkoutData } = route.params;
    const [totalPrice, setTotalPrice] = useState(0);
    const [shippingName, setShippingName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [creditCardNumber, setCreditCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvv, setCvv] = useState('');

    useEffect(() => {
        calculateTotalPrice(checkoutData);
    }, [checkoutData]);

    const calculateTotalPrice = (items: any[]) => {
        const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
        setTotalPrice(total);
    };

    const handlePayment = () => {
        if (!shippingName || !address || !phoneNumber || !creditCardNumber || !expirationDate || !cvv) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        console.log('Processing payment...');
        console.log('Shipping Name:', shippingName);
        console.log('Address:', address);
        console.log('Phone Number:', phoneNumber);
        console.log('Credit Card Number:', creditCardNumber);
        console.log('Expiration Date:', expirationDate);
        console.log('CVV:', cvv);

        Alert.alert('Purchase Successful', 'Thank you for your purchase!', [
            { text: 'OK', onPress: () => navigation.navigate('HomePage') }
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Payment Page</Text>

            <FlatList
                data={checkoutData}
                ListHeaderComponent={
                    <>
                        <Text style={styles.sectionTitle}>Items</Text>
                    </>
                }
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.cartItemBox}>
                        {item.productImage && (
                            <Image
                                source={{ uri: `data:image/png;base64,${item.productImage}` }} 
                                style={styles.productImage}
                            />
                        )}
                        <View style={styles.itemDetails}>
                            <Text style={styles.cartItemText}>{item.productName}</Text>
                            <Text style={styles.cartItemText}>Price: ${item.totalPrice}</Text>
                            <Text style={styles.cartItemText}>Quantity: {item.cartQty}</Text>
                        </View>
                    </View>
                )}
                ListFooterComponent={
                    <>
                        <Text style={styles.totalPrice}>Total Price: ${totalPrice}</Text>

                        <Text style={styles.sectionTitle}>Shipping Information</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            value={shippingName}
                            onChangeText={setShippingName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Address"
                            value={address}
                            onChangeText={setAddress}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            keyboardType="phone-pad"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                        />

                        <Text style={styles.sectionTitle}>Payment Information</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Credit Card Number"
                            keyboardType="numeric"
                            value={creditCardNumber}
                            onChangeText={setCreditCardNumber}
                        />
                        <View style={styles.row}>
                            <TextInput
                                style={[styles.input, styles.halfInput]}
                                placeholder="MM/YY"
                                value={expirationDate}
                                onChangeText={setExpirationDate}
                            />
                            <TextInput
                                style={[styles.input, styles.halfInput]}
                                placeholder="CVV"
                                keyboardType="numeric"
                                value={cvv}
                                onChangeText={setCvv}
                            />
                        </View>

                        <Button title="Pay Now" onPress={handlePayment} />
                    </>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    cartItemBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 10,
    },
    cartItemText: {
        fontSize: 16,
    },
    productImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        flex: 1,
        marginHorizontal: 5,
    },
});

export default PaymentPage;