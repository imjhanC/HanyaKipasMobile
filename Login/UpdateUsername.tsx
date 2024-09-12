import React from "react";
import { View, TouchableNativeFeedback, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const UpdateUsername = ({navigation}:any) =>{
    return(
        <View>
            <TouchableNativeFeedback
            onPress={() => navigation.navigate('Profile',{screen: 'ProfilePage'})}
            >
            <MaterialCommunityIcons
                name="arrow-left"
                style={{
                fontSize: 45,
                paddingLeft: 5,
                color: '#487df7',
                marginBottom:'auto'
                }}
            />
            </TouchableNativeFeedback>
            <Text>Update Username</Text>
        </View>
    );
}

export default UpdateUsername;