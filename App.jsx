import {StyleSheet, AppState, Text, View} from 'react-native';
import React, {Component, useEffect} from 'react';

// import LoginScreen from "./components/screens/LoginScreen";
// import HomeScreen from "./components/screens/HomeScreen";
// import RegisterScreen from "./components/screens/RegisterScreen";
// import { Provider } from "react-native/Libraries/Text/TextAncestor";
import store from './components/store';
import {Provider} from 'react-redux';
// import { createDrawerNavigator } from '@react-navigation/drawer';

import Nav from './components/navigations/Nav';
import 'react-native-gesture-handler';
// const Stack = createNativeStackNavigator();
// const Drawer = createDrawerNavigator();
// const Tab = createBottomTabNavigator();

// function Feed() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Feed Screen</Text>
//     </View>
//   );
// }

// function Article() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Article Screen</Text>
//     </View>
//   );
// }

// function MyDrawer() {
//   return (
//     <Drawer.Navigator>
//       <Drawer.Screen name="Feed" component={Feed} />
//       <Drawer.Screen name="Article" component={Article} />
//     </Drawer.Navigator>
//   );
// }

class App extends Component {
  // componentDidMount(){
  //   useEffect(() => {
  //     console.log()
  //     setTimeout(async() => {
  //       // setIsLoading(false);
  //       console.log("not foung")
  //       let userToken;
  //       userToken = null;
  //       try {
  //         userToken = await SecureStore.getItemAsync("token");
  //         console.log(userToken)
  //       } catch(e) {
  //         console.log("not foung");
  //       }
  //       // console.log('user token: ', userToken);
  //       store.dispatch({ type: 'RETRIEVE_TOKEN', payload: userToken });
  //       this.props.loadUser2(userToken)
  //     }, 1000);
  //   }, []);
  // }
  render() {
    return (
      <Provider store={store}>
        <Nav />
      </Provider>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
