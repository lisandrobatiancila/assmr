/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import { createDrawerNavigator } from '@react-navigation/drawer';

import Index from './components/screens/accounts/index'
import HomeIndex from './components/screens/home/homeindex';

const App = (props)=>{
  const [credentials, setCredentials] = React.useState({userid: 0, useremail: "", userType: ""})

  return(
    // (credentials && <Index credentials={credentials} />)
    // (<HomeIndex/>)
    
      (credentials.useremail === "" )? <Index credentials={credentials} setCredentials={setCredentials} />: <HomeIndex credentials={credentials} setCredentials={setCredentials} />
   
  )
}

export default App