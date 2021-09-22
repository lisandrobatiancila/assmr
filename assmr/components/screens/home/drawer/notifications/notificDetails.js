import * as React from 'react'
import { View, Text, StyleSheet, Image, ScrollView, Button, 
    AsyncStorage, Alert, LogBox, FlatList } from 'react-native'
import { Badge } from 'react-native-elements'
import axios from 'axios'
import { IMAGES } from '../../../../../assets/assets'
import { Context, Credentials } from '../../../../../hooks/context'

const NotificationDetails = (props)=>{
    // props.route.params
    const userCredentials = React.useContext(Context)
    const notificationDetails = props.route.params
    const [assumerDetails, setAssumerDetails] = React.useState([])
    const [cancelAssumpChange, setCancelAssumpChange] = React.useState(false)
    //[cancelAssumpChange, setCancelAssumpChange] was used to trigger re-render
    const retrieveAsyncStorage = async()=>{
        const serverIp = await AsyncStorage.getItem("serverIp")
        const imagePort = await AsyncStorage.getItem("imagePort")

        return [serverIp, imagePort]
    }
    React.useEffect(()=>{
        retrieveAsyncStorage()
            .then((PORTS)=>{
                axios.post(`http://${PORTS[0]}:1010/notifications/get-assumer-info`,
                [
                    {assumerID: notificationDetails.item.assumer_id},
                    userCredentials.credentials
                ]
                )
                .then((response)=>{
                    setAssumerDetails(response.data.response)
                })
                .catch((err)=>{
                    console.log('ap: '+err.message)
                })
            })
            .catch((err)=>{
                console.log('rAS: '+err.message)
            })
    }, [cancelAssumpChange])
    notificationDetails.setIsRendered(true)
    return(
        <ScrollView>
            <FlatList data={assumerDetails}
                keyExtractor={(item)=> item.info.assumer_id}
                renderItem={({ item })=>
                    (item.propOwner === "true")?
                    <View style={styles.container} key={item.info.assumer_id}>
                       <View style={styles.card}>
                           {/* <Text>{JSON.stringify(assumerDetails)}</Text> */}
                        <View style={styles.imgCirlceView}>
                                {/* notificationDetails.item.user_image the image */}
                                <Image source={IMAGES.user} style={{width: 100, height: 100}} />
                            </View>
                            <Text style={{textAlign: "center"}}>{item.assumerEmail}</Text>
                            <View style={styles.divider}></View>
                            <View style={{flex: 1, flexDirection: "row", marginVertical: 3}}>
                                <Text style={styles.textLabel}>name: </Text>
                                <Text style={styles.textInfo}>{item.info.assumer_firstname}</Text>
                                <Text style={styles.textInfo}>{item.info.assumer_middlename[0]}.</Text>
                                <Text style={styles.textInfo}>{item.info.assumer_lastname}</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: "row", marginVertical: 3}}>
                                <Text style={styles.textLabel}>contact #: </Text>
                                <Text style={styles.textInfo}>{item.info.assumer_contactno}</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: "row", marginVertical: 3}}>
                                <Text style={styles.textLabel}>company-name: </Text>
                                <Text style={styles.textInfo}>{item.info.assumer_company}</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: "row", marginVertical: 3}}>
                                <Text style={styles.textLabel}>job-name: </Text>
                                <Text style={styles.textInfo}>{item.info.assumer_job}</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: "row", marginVertical: 3}}>
                                <Text style={styles.textLabel}>salary: </Text>
                                <Text style={styles.textInfo}>{item.info.assumer_income}</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: "row", marginVertical: 3}}>
                                <Text style={styles.textLabel}>status: </Text>
                                <Badge value={item.info.assumer_status} status={(item.info.assumer_status === "active")?"success":"error"}></Badge>
                            </View>
                            <View>
                                {
                                    (item.info.assumer_status === "active")?
                                    <View>
                                        <Button title="accept assumption" color="#47d147" 
                                            onPress={()=>{
                                                Alert.alert(
                                                    'Message',
                                                    `Are you sure you want to accept ${item.info.assumer_lastname}, ${item.info.assumer_firstname} assumptions`,
                                                    [
                                                        {text: "no"},
                                                        {text: "yes", onPress: ()=>{
                                                            retrieveAsyncStorage()
                                                                .then((PORTS)=>{
                                                                    const values = {
                                                                        assumerID: item.info.assumer_id,
                                                                        assumerUSERID: item.info.user_id,
                                                                        assumerEmail: item.assumerEmail
                                                                    }
                                                                    axios.post(`http://${PORTS[0]}:1010/notifications/owner-accept-assumptions`,
                                                                        [values, userCredentials.credentials, [item.info]]
                                                                    )
                                                                    .then((response)=>{
                                                                        Alert.alert(
                                                                            'Message',
                                                                            response.data.response
                                                                        )
                                                                    })
                                                                    .catch((err)=>{
                                                                        console.log('aP: '+err.message)
                                                                    })
                                                                })
                                                                .catch((err)=>{
                                                                    console.log('rAS: '+err.message)
                                                                })
                                                        }}
                                                    ],
                                                    {cancelable: false}
                                                )
                                            }} />
                                        <View style={{height: 5}}></View>
                                        <Button title="cancel assumption" color="#ff9900"
                                            onPress={()=>{
                                                Alert.alert(
                                                    'Message',
                                                    `Are you sure you want to cancel ${item.info.assumer_lastname}, ${item.info.assumer_firstname} assumptions`,
                                                    [
                                                        {text: "no"},
                                                        {text: "yes", onPress: ()=>{
                                                            retrieveAsyncStorage()
                                                                .then((PORTS)=>{
                                                                    item.info.assumerEmail = notificationDetails.item.notification_sender
                                                                    axios.post(`http://${PORTS[0]}:1010/notifications/cancel-user-assumptions`,
                                                                        [item.info, userCredentials.credentials]
                                                                    )
                                                                    .then((response)=>{
                                                                        Alert.alert(
                                                                            'Message',
                                                                            response.data.response
                                                                        )
                                                                    })
                                                                    .catch((err)=>{
                                                                        console.log('aP: '+err.message)
                                                                    })
                                                                })
                                                                .catch((err)=>{
                                                                    console.log('rAS: '+ err.message)
                                                                })
                                                            setCancelAssumpChange(!cancelAssumpChange)
                                                        }}
                                                    ],
                                                    {cancelable: false}
                                                )
                                            }} />
                                        <View style={{height: 5}}></View>
                                    </View>
                                    :
                                    <View>
                                        <Button title="revert action" color="#ff3300"
                                            onPress={()=>{
                                                Alert.alert(
                                                    'Message',
                                                    `Are you sure you want to revert this action? `,
                                                    [
                                                        {text: "no"},
                                                        {text: "yes", onPress: ()=>{
                                                            retrieveAsyncStorage()
                                                                .then((PORTS)=>{
                                                                    axios.patch(`http://${PORTS[0]}:1010/notifications/owner-revert-actions`,
                                                                        {
                                                                            assumerID: item.info.assumer_id,
                                                                            receiverEmail: notificationDetails.item.notification_sender,
                                                                            senderEmail: userCredentials.credentials.useremail
                                                                        }
                                                                    )
                                                                    .then((response)=>{
                                                                        Alert.alert(
                                                                            'Message',
                                                                            response.data.response
                                                                        )
                                                                        setCancelAssumpChange(!cancelAssumpChange)
                                                                    })
                                                                    .catch((err)=>{
                                                                        console.log('aP: '+err.message)
                                                                    })
                                                                })
                                                                .catch((err)=>{
                                                                    console.log('rAS: '+err.message)
                                                                })
                                                        }}
                                                    ],
                                                    {cancelable: false}
                                                )
                                            }} />
                                    </View>
                                }
                                <Button title="send message" color="#ff4da6"
                                    onPress={()=> {
                                        var params = {
                                            messagesender: item.assumerEmail,
                                            userimage: notificationDetails.item.user_image
                                        }// it's said "messagesender" but they are really the
                                        //message receiver
                                        props.navigation.navigate("Messages", 
                                            {
                                                screen: "Open Messages",
                                                initial: false,
                                                params: params
                                            }
                                        )
                                    }} />
                            </View>
                        </View>
                    </View>
                    :
                    <View style={styles.container}>
                        {/* <Text>{JSON.stringify(notificationDetails)}</Text>
                        <Text>{JSON.stringify(assumerDetails)}</Text> */}
                        <FlatList data={assumerDetails}
                            keyExtractor={(item)=> item.info.assumer_id}
                            renderItem={({ item })=>
                            <View style={styles.card} key={item.info.assumer_id}>
                                {/* <Text>{JSON.stringify(item)}</Text> */}
                                <View style={styles.imgCirlceView}>
                                    {/* item.info.user_image the image */}
                                    <Image source={IMAGES.user} style={{width: 100, height: 100}} />
                                </View>
                                <View style={styles.divider}></View>
                                <View style={{flex: 1, flexDirection: "row", marginVertical: 3}}>
                                    <Text style={styles.textLabel}>name: </Text>
                                    <Text style={styles.textInfo}>{item.info.user_firstname}</Text>
                                    <Text style={styles.textInfo}>{item.info.user_middlename[0]}.</Text>
                                    <Text style={styles.textInfo}>{item.info.user_lastname}</Text>
                                </View>
                                <View style={{flex: 1, flexDirection: "row", marginVertical: 3}}>
                                    <Text style={styles.textLabel}>contactno: </Text>
                                    <Text style={styles.textInfo}>{item.info.user_contactno}</Text>
                                </View>
                                <View style={{flex: 1, flexDirection: "row", marginVertical: 3}}>
                                    <Text style={styles.textLabel}>address: </Text>
                                    <Text style={styles.textInfo}>{item.info.user_address}</Text>
                                </View>
                                <View style={{flex: 1, flexDirection: "row", marginVertical: 3}}>
                                    <Text style={styles.textLabel}>status: </Text>
                                    <Text >
                                        {
                                            (notificationDetails.item.notification_type === "Has cancelled your assumption" &&
                                                <Badge value="cancelled" status="error"></Badge>
                                            )
                                        }
                                        {
                                            (notificationDetails.item.notification_type === "Owner cancelled your assumption" &&
                                                <Badge value="cancelled" status="error"></Badge>
                                            )
                                        }
                                        {
                                            (notificationDetails.item.notification_type === "Has revert your assumption" &&
                                                <Badge value="pending" status="success"></Badge>
                                            )
                                        }
                                        {
                                            (notificationDetails.item.notification_type === "Owner accepts your assumption" &&
                                                <Badge value="assumed" status="success"></Badge>
                                            )
                                        }
                                    </Text>
                                </View>
                                <View>
                                    <Button title="send message" color="#ff4da6" 
                                       onPress={()=> {
                                        var params = {
                                            messagesender: item.info.account_email,
                                            userimage: item.info.user_image
                                        }// it's said "messagesender" but they are really the
                                        //message receiver
                                        props.navigation.navigate("Messages", 
                                            {
                                                screen: "Open Messages",
                                                initial: false,
                                                params: params
                                            }
                                        )
                                    }}/>
                                </View>
                            </View>
                            } />
                    </View>
                } />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
        backgroundColor: "#fff",
        height: "100%"
    },
    card: {
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3,
        marginVertical: 3
    },
    imgCirlceView: {
        flexDirection: "row",
        width: 100,
        height: 100,
        borderRadius: 100,
        backgroundColor: "#ccc",
        padding: 10,
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "center",
    },
    divider: {
        width: "100%",
        height: 3,
        backgroundColor: "#ff8c00",
        marginVertical: 5
    },
    textLabel: {
        textTransform: "capitalize", 
        fontWeight: "bold"
    },
    textInfo: {
        textTransform: "capitalize",
        marginHorizontal: 3
    }
})
export default NotificationDetails