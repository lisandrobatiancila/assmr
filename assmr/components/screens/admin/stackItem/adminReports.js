import * as React from 'react'
import { View, Text, StyleSheet, TouchableOpacity,
    ImageBackground } from 'react-native'
import { IMAGES } from '../../../../assets/assets'

const AdminReports = (props)=>{
    return(
        <ImageBackground source={IMAGES.assmer_logo} 
            style={{width: "100%", height: "100%", opacity: 0.9}}>
        <View style={[styles.container,  {flex: 1, flexDirection: "column",
            justifyContent: "center"}]}>
            <TouchableOpacity
                onPress = {()=> props.navigation.navigate("Admin Histories")}>
                <View style={styles.card}>
                    <Text style={[styles.textCapitalize, styles.textFont, 
                        styles.textCenter]}>history</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={()=> props.navigation.navigate("Admin Transactions")}>
                <View style={styles.card}>
                    <Text style={[styles.textCapitalize, styles.textFont, 
                        styles.textCenter]}>transactions activities</Text>
                </View>
            </TouchableOpacity>
        </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
    },
    card: {
        padding: 15,
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3,
        marginVertical: 6,
        backgroundColor: "#fff"
    },
    textCenter: {
        textAlign: "center",
    },
    textFont: {
        fontSize: 18
    },
    textCapitalize: {
        textTransform: "capitalize"
    },
    reportsColor: {
        backgroundColor: "#ff8c00"
    },
    subscriptionsColor: {
        backgroundColor: "#00e68a"
    },
    feedbacksColor: {
        backgroundColor: "#33adff"
    }
})

export default AdminReports