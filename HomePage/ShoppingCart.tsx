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
    SafeAreaView,
    Dimensions,
    ScrollView,
    TouchableNativeFeedback,
} from 'react-native';
import io from 'socket.io-client';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const windowHeight = Dimensions.get('window').height;
const socket = io('http://127.0.0.1:3000');

const ShoppingCart = ({ route, navigation }: any) => {
    const [cartItems, setCartItems] = useState<any[]>([]);

    return (
        <ScrollView style={styles.productPageContainer}>
            <TouchableNativeFeedback onPress={() => navigation.navigate('HomePage')}>
                <MaterialCommunityIcons
                    name="arrow-left"
                    style={styles.backIcon}
                />
            </TouchableNativeFeedback>
            <Text style={styles.headerText}>Shopping Cart</Text>
        </ScrollView>
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
        left: '50%',    // Move to center of the screen
        transform: [{ translateX: -80 }], // Adjust for proper centering
        fontSize: 30,
        fontWeight: 'bold',
        color: '#487df7',
        paddingTop: 17,
    }
});

export default ShoppingCart;
