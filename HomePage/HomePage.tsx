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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from '@react-navigation/native';

const windowHeight = Dimensions.get('window').height;

const App = ({route, navigation}: any) => {
  const [fanType, setFanType] = useState([
    { id: 1, Type: "All Fans" },
    { id: 2, Type: "Bladeless Fan" },
    { id: 3, Type: "Table Fan" },
    { id: 4, Type: "Ceiling Fan" }
  ]);

  const [products, setProducts] = useState<any[]>([
  ]);

  useEffect(() => {
    // Fetch product data from Flask server
    fetch('http://127.0.0.1:3000/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data.products);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    if (route?.params?.search !== undefined && route?.params?.search !== null) {
      setSearchQuery(route?.params?.search);
    }
  }, [route?.params?.search]);

  const filteredFans = products.filter(item =>
    (item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) || item.product_type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  //For rotating search bar text
  const [placeholderText, setPlaceHolderText] = useState('Search.....');
  useEffect(() => {
    // Can use flask to retrieve fan names to place here or hardcode it lol
    const placeHolderOptions = ['Bladeless fan.....', 'Over 9000 fan.....', 'I can not belive this exits fan....', 'Explore....'];

    let currentIndex = 0;

    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % placeHolderOptions.length;
      setPlaceHolderText(placeHolderOptions[currentIndex]);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  // Function to handle image data
  const getImageSource = (imgBase64: string) => {
    return { uri: `data:image/jpeg;base64,${imgBase64}` };
  };

  return (
    <SafeAreaView style={styles.allContainer}>
      {/* Top Navigation Bar */}
      <View style={styles.topNavContainer}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons  
            name="cloud-search-outline"
            style={{
              fontSize: 24,
              color: '#487df7',
            }}
          />
          <TouchableNativeFeedback 
            onPress={() => navigation.navigate('SearchPage')}
          >
            <Text style={styles.searchText}>{placeholderText}</Text>
          </TouchableNativeFeedback>
        </View>

        <View style={styles.headerRightContainer}>
          <TouchableNativeFeedback
            onPress={() => navigation.navigate('Home',{screen:'ShoppingCart'})}
          >
            <MaterialCommunityIcons name="cart-outline"
              style={{
                fontSize: 30,
                color: '#487df7',
              }}
            />
          </TouchableNativeFeedback>
        </View>
      </View>

      <View style={styles.fanContainer}>
        <FlatList 
          // keyExtractor={item => item.id.toString()}
          data={fanType}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <TouchableNativeFeedback onPress={() => setSearchQuery(item.Type)}>
                <View style={styles.fanTypeContainer}>
                  <Text style={styles.fanTypeText}>{item.Type}</Text>
                </View>
              </TouchableNativeFeedback>
            );
          }}
        />
      </View>

      <View style={styles.productContainer}>
        <FlatList
          // keyExtractor={item => item.id.toString()}
          data={searchQuery.toLowerCase() === 'all fans' ? products : filteredFans}
          showsVerticalScrollIndicator={false}
          horizontal={false}
          numColumns={2}
          renderItem={({ item }) => {
            return (
              <TouchableNativeFeedback onPress={() => navigation.navigate('Home',{
                screen:'ProductPage',
                params:{
                  product_name: item.product_name,
                  product_qty: item.product_qty,
                  product_desc: item.product_desc,
                  product_img: item.product_img,
                  product_price: item.product_price,
                  product_type: item.product_type,
                }})}>
                <View style={styles.individualProductContainer}>
                  <View style={styles.productImgContainer}>
                    <Image
                      source={getImageSource(item.product_img)} 
                      style={styles.productImg}
                    />
                  </View>
                  <View style={styles.productDetailContainer}>
                    <Text style={styles.productName}>{item.product_name}</Text>
                    <Text style={styles.productType}>{item.product_type}</Text>
                    <Text style={styles.productPrice}>RM {item.product_price}</Text>
                  </View>
                </View>
              </TouchableNativeFeedback>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  allContainer: {
    paddingBottom: windowHeight * 0.25,
  },
  topNavContainer: {
    flexDirection: 'row',
  },
  searchContainer: {
    flexDirection: 'row',
    flex: 0.9,
    marginTop: 12,
    padding: 12,
    margin: 25,
    marginLeft: 10,
    marginBottom: 10,
    borderRadius: 8,
    color: '#666',
    backgroundColor: '#e9e9e9',
  },
  searchText: {
    marginLeft: 15,
    fontSize: 16,
  },
  headerRightContainer: {
    flexDirection: 'row',
    flex: 0.1,
    marginTop: 12,
    marginRight: 25,
    paddingTop: 8,
  },
  fanContainer: {
    marginBottom: 10,
    color: 'black',
  },
  fanTypeContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 25,
    width: 150,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#7e7e7e',
    justifyContent: 'center',
  },
  fanTypeText: {
    fontSize: 16,
    color: 'black',
  },
  productContainer: {
    backgroundColor: '#ececec',
  },
  individualProductContainer: {
    flex: 0.5,
    flexDirection: 'column',
    height: 400,
    textAlign: 'center',
    margin: 5,
    backgroundColor: 'white', 
    elevation: 5  
  },
  productImgContainer: {
    alignItems: 'center',
    marginTop: 3,
    marginLeft:'auto',
    marginRight:'auto',
    width: '85%',
    height:'63%',
  },
  productImg: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    backgroundColor:'red'
  },
  productDetailContainer:{
    flex: 1
  },
  productName: {
    flex: 0.7,
    paddingTop:2,
    paddingLeft: 7,
    fontSize: 25,
    fontWeight: '900',
    color: 'black',
  },
  productPrice: {
    flex:0.2,
    fontSize: 25,
    marginTop: 'auto',
    fontWeight: '400',
    color: '#4b4b4b',
    textAlign: 'center',
    paddingBottom:5
  },
  productType:{
    flex:0.1,
    marginRight:'auto',
    marginLeft:'auto',
    alignContent:'center',
    color: '#4b4b4b',
    fontSize: 12,
  }
})

export default App;
