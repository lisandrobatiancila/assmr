import * as React from 'react'
import { View, Text, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native'
import { IMAGES } from '../../../assets/assets'

const Loading = ({ title, color })=>{
    return(
        <ImageBackground source={IMAGES.assmer_logo}
            style={{width: "100%", height: "100%"}}>
        <View style={styles.container}>
            <ActivityIndicator size="large" color={color} />
            <Text style={styles.loadingText}>{title}</Text>
        </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    loadingText: {
        fontSize: 20,
        fontWeight: "bold",
    }
})
export default Loading