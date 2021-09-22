import * as React from 'react'
import { View, Text, AsyncStorage, StyleSheet, FlatList, Image, 
    Button, Alert } from 'react-native'
import axios from 'axios'
import { Badge } from 'react-native-elements'
import { IMAGES } from '../../../../../assets/assets'
import { Context } from '../../../../../hooks/context'

const ShowAssumers = (props)=>{
    const params = props.route.params
    const userCredentials = React.useContext(Context)
    const [assumersLists, setAssumersLists] = React.useState([])
    const [shouldreRender, setShouldreRender] = React.useState(false)
    const retrieveAsyncStorage = async() =>{
        const serverIp = await AsyncStorage.getItem("serverIp")
        const imagePort = await AsyncStorage.getItem("imagePort")

        return [serverIp, imagePort]
    }
    React.useEffect(()=>{
        retrieveAsyncStorage()
            .then((PORTS)=>{
                var serverParams = {}
                serverParams = params
                axios.post(`http://${PORTS[0]}:1010/posted-property/user-view-property-assumers`,
                    serverParams
                )
                .then((response)=>{
                    response = response.data.response
                    setAssumersLists(response)
                })
                .catch((err)=>console.log('rAS: '+err.message))
            })
            .catch((err)=> console.log('rAS: '+err.message))
    }, [shouldreRender])
    return(
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={[styles.textCenter, styles.transform]}>
                    list of assumers</Text>
            </View>
            <View style={{padding: 5, height: "90%"}}>
            <FlatList data={assumersLists}
                renderItem={({ item })=>
                <View style={styles.card}>
                    {/* <Text>{JSON.stringify(item)}</Text> */}
                    <View style={styles.imageView}>
                        <Image source={IMAGES.user} style={{width: 100, height: 100, alignSelf: "center"}} />
                        <Text style={{
                            textAlign: "center",
                            letterSpacing: 1,
                            fontSize: 16,
                            fontWeight: "bold",
                            marginVertical: 3
                        }}>{item.assumer_lastname}, {item.assumer_firstname} {item.assumer_middlename[0]}.</Text>
                    <Text style={{textAlign: "center"}}>{item.account_email}</Text>
                    </View>
                    <View style={{width: "100%", height: 2, backgroundColor: "#ff8c00"}}></View>
                    <View>
                        <View style={{flexDirection: "row"}}>
                            <Text style={styles.textLabel}>contact # : </Text>
                            <Text style={{marginTop: 3, marginHorizontal: 3}}>{item.assumer_contactno}</Text>
                        </View>
                        <View style={{flexDirection: "row"}}>
                            <Text style={styles.textLabel}>
                                company-name : </Text>
                            <Text style={{marginTop: 3, marginHorizontal: 3, 
                                textTransform: "capitalize"}}>{item.assumer_company}</Text>
                        </View>
                        <View style={{flexDirection: "row"}}>
                            <Text style={styles.textLabel}>job-name : </Text>
                            <Text style={{marginTop: 3, marginHorizontal: 3,
                                textTransform: "capitalize"}}>{item.assumer_job}</Text>
                        </View>
                        <View style={{flexDirection: "row"}}>
                            <Text style={styles.textLabel}>salary : </Text>
                            <Text style={{marginTop: 3, marginHorizontal: 3}}>{item.assumer_income}</Text>
                        </View>
                        <View style={{flexDirection: "row"}}>
                            <Text style={styles.textLabel}>status : </Text>
                            <Badge value={item.assumer_status} status={(item.assumer_status === "active")?"success":"error"}>
                            </Badge>
                        </View>
                    </View>
                    <View>
                            <View>
                                {
                                    (item.assumer_status === "active")?
                                    <View>
                                        <Button title="accept assumption" color="#47d147" 
                                            onPress={()=>{
                                                Alert.alert(
                                                    'Message',
                                                    `Are you sure you want to accept ${item.assumer_lastname}, ${item.assumer_firstname} assumptions`,
                                                    [
                                                        {text: "no"},
                                                        {text: "yes", onPress: ()=>{
                                                            retrieveAsyncStorage()
                                                                .then((PORTS)=>{
                                                                    var values = {
                                                                        assumerID: item.assumer_id,
                                                                        propertyID: item.property_id,
                                                                        assumerUSERID: item.user_id,
                                                                        assumerEmail: item.account_email
                                                                    }
                                                                    axios.post(`http://${PORTS[0]}:1010/notifications/owner-accept-assumptions`,
                                                                        [values, userCredentials.credentials, assumersLists]
                                                                    )
                                                                    .then((response)=>{
                                                                        Alert.alert(
                                                                            'Message',
                                                                            response.data.response
                                                                        )
                                                                        setShouldreRender(!shouldreRender)
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
                                                    `Are you sure you want to cancel ${item.assumer_lastname}, ${item.assumer_firstname} assumptions`,
                                                    [
                                                        {text: "no"},
                                                        {text: "yes", onPress: ()=>{
                                                            retrieveAsyncStorage()
                                                                .then((PORTS)=>{
                                                                    var values = {
                                                                        assumer_id: item.assumer_id,
                                                                        user_id: item.user_id,
                                                                        assumerEmail: item.account_email
                                                                    }
                                                                    axios.post(`http://${PORTS[0]}:1010/notifications/cancel-user-assumptions`,
                                                                        [values, userCredentials.credentials]
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
                                    onPress={()=>{
                                        var params = {
                                            messagesender: item.account_email,
                                            userimage: item.user_image
                                        }//it's said "messagesender" but they are really the
                                        //message receiver :)
                                        props.navigation.navigate("Messages",
                                            {
                                                screen: "Open Messages",
                                                initial: false,
                                                params: params
                                            },
                                        )
                                    }}/>
                            </View>
                    </View>
                </View>
                } />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#fff",
        height: "100%"
    },
    card: {
        padding: 10,
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3,
        marginVertical: 3
    },
    textCenter: {
        textAlign: "center"
    },
    transform: {
        textTransform: "capitalize"
    },
    textLabel: {
        textTransform: "capitalize", 
        fontWeight: "bold",
        marginVertical: 3
    },
})

export default ShowAssumers