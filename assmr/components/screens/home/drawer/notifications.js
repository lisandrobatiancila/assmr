import * as React from 'react'
import { View, Text, Image, AsyncStorage, StyleSheet, 
    FlatList, TouchableOpacity } from 'react-native'
import axios from 'axios'
import { Notification } from '../../../../notifications/notificationManager'
import { Context } from '../../../../hooks/context'
import { IMAGES } from '../../../../assets/assets'

const Notifications = ({ navigation })=>{
    const userCredentials = React.useContext(Context)
    const [notificationsList, setNotificationsList] = React.useState([])
    const [isRendered, setIsRendered] = React.useState(false)

    const retrieveAsyncStorage = async()=>{
        const serverIp = await AsyncStorage.getItem("serverIp")
        const imagePort = await AsyncStorage.getItem("imagePort")

        return [serverIp, imagePort]
    }
    React.useEffect(()=>{
        retrieveAsyncStorage()
            .then((PORTS)=>{
                axios.post(`http://${PORTS[0]}:1010/notifications/get-user-notifications`,
                    userCredentials.credentials
                )
                .then((response)=>{
                    if (Object.keys(response.data).length > 0)
                        setNotificationsList(response.data)
                })
                .catch((err)=>{
                    console.log(err.message)
                })
            })
            .catch((err)=>{
                console.log(err.message)
            })
    }, [])
    return(
            (Object.keys(notificationsList).length > 0)?
            <View style={styles.container}>
            {/* {(isRendered)?<Text>rendered</Text>:<Text>not rendered</Text>} */}
            <FlatList data={notificationsList}
                keyExtractor={(item)=> item.notification_id}
                renderItem={({ item })=>
                <TouchableOpacity key={item.notification_id}
                    onPress={()=> navigation.navigate("Notification Details", {item, setIsRendered})}>
                    <View style={styles.card}>
                        <View>
                            <View style={styles.flexView}>
                                <Image source={IMAGES.user} style={{width: 50, height: 50}} />
                                <View style={{flexDirection: "column"}}>
                                    <View style={styles.flexView}>
                                        <Text style={styles.textName}>{item.user_firstname}</Text>
                                        <Text style={styles.textName}>{item.user_middlename[0]}.</Text>
                                        <Text style={styles.textName}>{item.user_lastname}</Text>
                                    </View>
                                    <Text>{item.notification_type}</Text>
                                    <Text>{item.monthname} {item.day}, {item.year}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            } />
            </View>
            :
            <View style={styles.containerErr}>
                <View style={styles.card}>
                    <Text style={styles.notificationTextErr}>you have no notifications currently!</Text>
                </View>
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
        backgroundColor: "#fff",
        height: "100%",
    },
    containerErr: {
        padding: 5,
        backgroundColor: "#fff",
        height: "100%",
        flex: 1,
        flexDirection: "column",
        justifyContent: "center"
    },
    notificationTextErr: {
        textAlign: "center",
        fontSize: 20,
        textTransform: "capitalize"
    },
    card: {
        padding: 10,
        borderRadius: 3,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3,
        marginVertical: 3
    },
    flexView: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    textName: {
        fontWeight: "bold",
        letterSpacing: 1,
        marginHorizontal: 3
    }
})

export default Notifications