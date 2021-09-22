import * as React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'

const Loading = ({ title, color })=>{
    return(
        <View style={styles.container}>
            <ActivityIndicator size="large" color={color} />
            <Text style={styles.loadingText}>{title}</Text>
        </View>
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