import * as React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { IMAGES } from '../../../../assets/assets'

export const NavIcon = ({navigation, title})=>{
    return(
        <View style={styles.navContainer}>
            <TouchableOpacity onPress={()=> navigation.toggleDrawer()}>
                <Image source={IMAGES.menu2} style={{width: 20, height: 20}} />
            </TouchableOpacity>
            <View style={styles.navTitle}>
                <Text style={{textTransform: "capitalize",
                    fontSize: 22}}>{title}</Text>
            </View>
        </View>
    )
}

export const LeftArrow = ({navigation, title})=>{
    return(
        <View style={styles.navContainer}>
            <TouchableOpacity onPress={()=> navigation.goBack()}>
                <Image source={IMAGES.left_arr} style={{width: 20, height: 20 }} />
            </TouchableOpacity>
            <View style={styles.navTitle}>
                <Text style={{textTransform: "capitalize",
                    fontSize: 22}}>{title}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    navContainer: {
        flexDirection: "row",
    },
    navTitle: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
    }
})
