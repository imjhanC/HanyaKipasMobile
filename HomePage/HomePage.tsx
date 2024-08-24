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
// npm install react-native-parallax-scroll-view --save

const windowHeight = Dimensions.get('window').height;

// for imgSrc the require() tag is required!!!!!
let testData = [
  {
    key: '100',
    Type: 'bf',
    name: 'F1',
    desc: 'F1213',
    imgSrc: require('./chicken.jpg'),
  },
  {
    key: '200',
    Type: 'bf',
    name: 'F2',
    desc: 'F213',
    imgSrc: require('./chicken.jpg'),
  },
  {
    key: '300',
    Type: 'cf',
    name: 'F3',
    desc: 'F3213',
    imgSrc: require('./chicken.jpg'),
  },
  {
    key: '400',
    Type: 'tf',
    name: 'F4',
    desc: 'F4213',
    imgSrc: require('./chicken.jpg'),
  },
  {
    key: '500',
    Type: 'cf',
    name: 'F3',
    desc: 'F3213',
    imgSrc: require('./chicken.jpg'),
  },
  {
    key: '600',
    Type: 'cf',
    name: 'F3',
    desc: 'F3213',
    imgSrc: require('./chicken.jpg'),
  },
  {
    key: '700',
    Type: 'cf',
    name: 'F3',
    desc: 'F3213',
    imgSrc: require('./chicken.jpg'),
  },
];

const App = ({router, navigation}: any) =>{
  const [fanType, setFanType] = useState([
  {
    id: 1,
    Type: "All Fans",
  },
  {
    id: 2,
    Type: "Bladeless Fan",
  },
  {
    id: 3,
    Type: "Table Fan",
  },
  {
    id: 4,
    Type: "Ceiling Fan"
  }
  ]);

  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    setProducts(testData);
  },[]);

  return(
    <SafeAreaView style={styles.allContainer}>
      {/* Top Navigation Bar*/}
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
            onPress={() => navigation.navigate("SearchPage")}
          >
            <Text style={styles.searchText}>CLIC ME BISH</Text>
          </TouchableNativeFeedback>
        </View>

        <View style={styles.headerRightContainer}>
          <TouchableNativeFeedback
            onPress={() => navigation.navigate('Shoppingcart')}
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
          keyExtractor={item => item.id.toString()}
          data = {fanType}
          horizontal
          showsHorizontalScrollIndicator = {false}
          renderItem = {({ item }) => {
            return(
              <TouchableNativeFeedback>
                <View style={styles.fanTypeContainer}>
                  <Text style={styles.fanTypeText}>{item.Type}</Text>
                </View>
              </TouchableNativeFeedback>
            )}}
          />
      </View>

      <View style={styles.productContainer}>
        <FlatList
          keyExtractor = {item => item.key.toString()}
          data = {products}
          showsVerticalScrollIndicator = {false}
          horizontal = {false}
          numColumns = {2}
          renderItem = {({ item }) => {
            return(
              <TouchableNativeFeedback>
                <View style={styles.individualProductContainer}>
                  <View style={styles.productImgContainer}>
                    <Image source={item.imgSrc} style={styles.productImg}/>
                  </View>
                  <Text style={styles.productName}>{item.name}</Text>
                  {/* <Text style={styles.productDesc}>{item.desc}</Text> */}
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
    paddingBottom: windowHeight * 0.25,
  },

  topNavContainer: {
    flexDirection: 'row',
  },

  searchContainer:{
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

  searchText:{
    marginLeft: 15,
    fontSize: 16,
  },

  headerRightContainer: {
    flexDirection: 'row',
    flex: 0.1,
    marginTop: 12,
    marginRight: 25,
    paddingTop: 8,
    // borderRadius: 8,
    // color: '#666',
    // backgroundColor: '#eaeaea',
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
    flex: 1,
    flexDirection: 'column',
    height: 400,
    width: '50%',
    // borderRadius: 10,
    // borderWidth: 2,
    // borderColor: '#aabfff',
    textAlign: 'center',
    margin: 5,
  },

  productImgContainer: {
    alignItems: 'center',
    paddingTop: 5,
  },

  productImg: {
    height: '80%',
    width: '95%',
  },

  productName: {
    marginTop: -50,
    fontSize: 35,
    fontWeight: '700',
    color: 'black',
    textAlign: 'center',
  },

  // productDesc: {
  //   fontSize: 25,
  //   fontWeight: '400',
  //   color: '#4b4b4b',
  //   textAlign: 'center',
  // },
})
export default App;