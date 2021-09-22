import * as React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import {
    DrawerItem,
    DrawerContentScrollView,
  } from '@react-navigation/drawer';
import { IMAGES } from '../../../../assets/assets'

const UserInfo = ()=>{
    return(
        <DrawerContentScrollView>
            <View><Text>qweqweeeeesss</Text></View>
        </DrawerContentScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        padding: 5,
        flex: 1,
        flexDirection: "column",
        height: 30
    },
    content:{
        backgroundColor: "teal",
        width: 80,
        height: 80,
        borderRadius: 50,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    text:{
        alignItems: "center",
        justifyContent: "center",
        alignItems: "center"
    },
    img: {
        width: 30,
        height: 30,
    }
})

export default UserInfo