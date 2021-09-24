import * as React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image,
    ImageBackground } from 'react-native'
import { Context } from '../../../../hooks/context'
import { IMAGES } from '../../../../assets/assets'

export const AdminIndex = (props)=>{
    const userCredentials = React.useContext(Context)
    
    return(
        <ImageBackground source={IMAGES.assmer_logo} 
            style={{width: "100%", height: "100%", opacity: 0.9}}>
        <View style={[styles.container, {flex: 1, flexDirection: "column",
            justifyContent: "space-around"}]}>
            <View>
                <TouchableOpacity 
                    onPress={()=> props.navigation.navigate("Admin Reports")}>
                    <View style={[styles.card, styles.reportsColor]}>
                        <Text style={[styles.textCenter, styles.textFont,
                            styles.textCapitalize]}>view reports</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={()=> props.navigation.navigate("Admin Subscriptions")}>
                    <View style={[styles.card, styles.subscriptionsColor]}>
                        <Text style={[styles.textCenter, styles.textFont,
                            styles.textCapitalize]}>subscriptions</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={()=> props.navigation.navigate("Admin FeedBack")}>
                    <View style={[styles.card, styles.feedbacksColor]}>
                        <Text style={[styles.textCenter, styles.textFont,
                            styles.textCapitalize]}>feedbacks</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.logOutOp}
                onPress={()=> 
                    userCredentials.userCredentials.setCredentials({userType: '', userid: 0, useremail: ''})
                }>
                <View>
                    {/* <Text style={styles.textLogout}>logout</Text> */}
                    <Image source={IMAGES.logout} style={{width: 30, height: 30}} />
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
    },
    textLogout: {
        fontWeight: "bold",
        textTransform: "capitalize",
        letterSpacing: 1.5
    },
    logOutOp: {
        position: "absolute",
        bottom: 5,
        right: 10,
        backgroundColor: "#ff4da6",
        borderRadius: 50,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3,
        marginVertical: 3
    }
})

export default AdminIndex