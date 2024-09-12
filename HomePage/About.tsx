import React from "react";
import { View, TouchableNativeFeedback, Text, StyleSheet, ScrollView, Image } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const aboutApp = ({navigation}:any) => {
    return (
        <View style={styles.container}>
            <TouchableNativeFeedback
                onPress={() => navigation.navigate('Profile', {screen: 'ProfilePage'})}
            >
                <MaterialCommunityIcons
                    name="arrow-left"
                    style={styles.backIcon}
                />
            </TouchableNativeFeedback>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.heading}>About Hanya Kipas</Text>
                <Text style={styles.paragraph}>
                    Welcome to Hanya Kipas, your number one source for high-quality fans.
                    We are dedicated to giving you the very best of cooling solutions,
                    with a focus on reliability, comfort, and customer satisfaction.
                </Text>

                <Text style={styles.paragraph}>
                    Founded in 2023, Hanya Kipas has come a long way from its beginnings.
                    When we first started out, our passion for providing eco-friendly
                    and energy-efficient fans drove us to conduct intense research, so
                    that we can offer you the best fans in the market. We now serve
                    customers all over the country and are thrilled to be a part of
                    the cooling industry.
                </Text>

                <Text style={styles.paragraph}>
                    We hope you enjoy our products as much as we enjoy offering them to you.
                    If you have any questions or comments, please don't hesitate to
                    contact us.
                </Text>
                <Image source={require('./Fan.gif')} style={styles.gif}/>
                <Text style={styles.signature}>Sincerely,</Text>
                <Text style={styles.signature}>The Hanya Kipas Team</Text>
            </ScrollView>
        </View>
    );
};

export default aboutApp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    backIcon: {
        fontSize: 45,
        paddingLeft: 5,
        color: '#487df7',
        marginBottom: 20,
    },
    contentContainer: {
        alignItems: 'center',
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    paragraph: {
        fontSize: 16,
        color: '#666',
        textAlign: 'justify',
        marginBottom: 15,
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    signature: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
    gif:{
    width: 180,
    height: 180,
    resizeMode: 'contain',
    }
});
