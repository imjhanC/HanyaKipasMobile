import React, { useState, useEffect } from 'react';
import { 
    View, 
    StyleSheet, 
    TextInput, 
    Text, 
    TouchableNativeFeedback,
    FlatList,
    Dimensions,
    SafeAreaView,
    Image,
} from 'react-native';
import io from 'socket.io-client';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const socket = io('http://127.0.0.1:3000');

const App = () =>{

}