import * as React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

const AdminReports = (props)=>{
    return(
        <View style={[styles.container,  {flex: 1, flexDirection: "column",
            justifyContent: "center"}]}>
            <TouchableOpacity style={{}}
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
        marginVertical: 6
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