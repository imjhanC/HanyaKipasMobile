import React, { useState, useEffect } from 'react';
import { 
    View, 
    StyleSheet, 
    TextInput, 
    Text, 
    TouchableNativeFeedback,
    FlatList,
    Dimensions,
    SafeAreaView
} from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// npm install react-native-parallax-scroll-view --save

let numColumns = 4;

let testData = [
  {
    key: '100',
    name: 'F1',
  },
  {
    key: '200',
    name: 'F2',
  },
  {
    key: '300',
    name: 'F3',
  },
  {
    key: '400',
    name: 'F4',
  },
];

const App = ({router, navigation}: any) =>{
    const [fanType, setFanType] = useState([
      {
        id: 1,
        Type: "All",
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

    useEffect(() => {
      
    })

    return(
        <SafeAreaView>
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
                onPress={() => navigation.navigate('SearchPage')}
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
              numColumns={numColumns}
              keyExtractor={item => item.id.toString()}
              data = {fanType}
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
    flexDirection: 'row',
    color: 'black',
  },
  fanTypeContainer: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'flex-start',
  },
  fanTypeText: {
    fontSize: 16,
    color: 'black',
  },
})
export default App;