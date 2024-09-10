import React, { useState, useEffect } from 'react';
import { 
    View, 
    StyleSheet, 
    TextInput, 
    Text, 
    TouchableNativeFeedback,
    FlatList,
    SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const App = ({navigation}: any) =>{
  const [recommendationName, setReccomendationName] = useState([]);
  
  useEffect(() => {
    // Request reccomendations names
    fetch('http://127.0.0.1:3000/products/random')
        .then(response => response.json())
        .then(data => {
            setReccomendationName(data.products);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        })
  }, [])

  const [querySearch, setQuerySearch] = useState('');

  //For rotating search bar text
  const [placeholderText, setPlaceHolderText] = useState('Search.....');
  useEffect(() => {
    // Can use flask to retrieve fan names to place here or hardcode it lol
    const placeHolderOptions = ['Bladeless fan....', 'Over 9000 fans available....', 'Type here to search for fans....', 'Explore our fans....'];

    let currentIndex = 0;

    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % placeHolderOptions.length;
      setPlaceHolderText(placeHolderOptions[currentIndex]);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return(
    <SafeAreaView style={styles.allContainer}>
        <View style={styles.topNavContainer}>
            <TouchableNativeFeedback
                onPress={() => navigation.navigate('HomePage')}
            >
                <MaterialCommunityIcons
                    name="arrow-left"
                    style={{
                        fontSize: 45,
                        paddingTop: 15,
                        paddingLeft: 5,
                        color: '#487df7',
                    }}
                />
            </TouchableNativeFeedback>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    value={querySearch}
                    onChangeText={(text) => setQuerySearch(text)}
                    onSubmitEditing={() => navigation.navigate('HomePage', {
                        screen: 'Home',
                        params: {
                            search: querySearch
                        }
                    })}
                    placeholder={placeholderText}
                />
                <TouchableNativeFeedback onPress={() => navigation.navigate('HomePage', { 
                        screen: 'Home',
                        params: {
                            search: querySearch
                        }
                    })}
                >
                    <MaterialCommunityIcons  
                        name="cloud-search-outline"
                        style={{
                            fontSize: 24,
                            color: '#487df7',
                            paddingTop: 12,
                            marginHorizontal: 15,
                        }}
                    />
                </TouchableNativeFeedback>
            </View>
        </View>
        <View style={styles.recoContainer}>
            <FlatList
                keyExtractor={item => item.id.toString()}
                data = {recommendationName}
                renderItem={({ item }) => {
                    return(
                        <TouchableNativeFeedback onPress={() => {
                            navigation.navigate('ProductPage',
                                {
                                  product_name: item.product_name,
                                  product_qty: item.product_qty,
                                  product_desc: item.product_desc,
                                  product_img: item.product_img,
                                  product_price: item.product_price,
                                  product_type: item.product_type,
                                })}}>
                            <View style={styles.recoView}>
                                <Text style={styles.recoText}>{item.product_name}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    )
                }}
            />
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    allContainer: {
        flex: 1,
    },
    topNavContainer: {
        flex: 0.0325,
        flexDirection: 'row',
        minHeight: 50,
    },
    searchContainer: {
        flexDirection: 'row',
        flex: 0.9,
        marginTop: 12,
        margin: 25,
        marginLeft: 10,
        marginBottom: 10,
        marginRight: -25,
        borderRadius: 8,
        maxHeight: 50,
        color: '#666',
        backgroundColor: '#e9e9e9',
    },
    input: {
        flex: 1,  
    },
    recoContainer:{
        flex: 0.5,
    },
    recoView: {
        borderBottomWidth: 2,
        borderColor: '#d1d1d1',
    },
    recoText: {
        padding: 15,
        fontSize: 25,
        color: '#3D3D3D',
    },
})
export default App;