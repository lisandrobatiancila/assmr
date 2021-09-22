import * as React from 'react'
import { View, Text, Image, AsyncStorage, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native'
import { Context } from '../../../../hooks/context'
import { IMAGES } from '../../../../assets/assets'
import axios from 'axios'

const Messages = ({ navigation })=>{
    const userCredentials = React.useContext(Context)
    const [userMessages, setUserMessages] = React.useState([])
    const [trigger, setTrigger] = React.useState(false)
    const retrieveAsyncStorage = async()=>{
        const serverIp = await AsyncStorage.getItem("serverIp")

        return serverIp
    }
    React.useEffect(()=>{
        retrieveAsyncStorage()
            .then((serverIp)=>{
                axios.post(`http://${serverIp}:1010/messages/active_user_messages`,
                        userCredentials
                    )
                    .then((response)=>{
                        setUserMessages(response.data.response)
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
            })
            .catch((err)=>{
                console.log(err)
            })
    }, [trigger])
    return(
        <View style={{backgroundColor: "#fff", height: "100%"}}>
            <View style={{padding: 5, height: "85%"}}>
                <FlatList data={userMessages}
                    keyExtractor={(item)=> item.message_id}
                    renderItem={({item})=>
                    <TouchableOpacity key={item.message_id}
                        onPress={()=>{
                            navigation.navigate("Open Messages", 
                                {messagesender: item.account_email, userimage: item.user_image}
                            )
                        }}>
                        {/* <Text>{JSON.stringify(item)}</Text> */}
                        <View style={[{ flexDirection: "row", width: "100%"}, styles.card]}>
                            <View style={styles.imgCircle}>
                                <Image source={IMAGES.user} resizeMode="contain" style={{width: 60, height: 60}} />
                            </View>
                            <View style={{marginVertical: 3 , width: "100%", marginHorizontal: 5}}>
                                <View style={{flexDirection: "column", padding: 5}}>
                                    <View style={{flexDirection: "row", justifyContent: "space-evenly"}}>
                                        <Text style={[styles.userName,{position: "absolute", left: 0}]}>
                                            {item.user_lastname}, {item.user_firstname} {item.user_middlename[0]}.
                                        </Text>
                                        <Text style={{position: "absolute"}}>{item.dayname[0]}{item.dayname[1]}{item.dayname[2]}</Text>
                                        <Text></Text>
                                    </View>
                                    <View style={{marginVertical: 10}}>
                                        <Text>
                                            {(item.from === "you")?
                                            <Text>{item.from}: {item.message_text}</Text>
                                            :
                                            <Text>{item.message_text}</Text>
                                            }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    } />
            </View>
            <View style={styles.refreshView}>
                <TouchableOpacity style={styles.refreshOp}
                    onPress={()=> setTrigger(!trigger)}>
                    <Image source={IMAGES.refresh} 
                        style={{width: 20, height: 20, alignSelf: "center", tintColor: "#000"}} 
                        resizeMode="contain" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 3,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3,
        marginVertical: 3
    },
    imgCircle: {
        backgroundColor: "#ccc",
        borderRadius: 50,
        shadowOffset: {width: 0, height: 3},
        shadowColor: "#000",
        elevation: 3,
        padding: 5
    },
    userName:{
        textTransform: "capitalize",
        fontWeight: "bold",
        fontSize: 17
    },
    userMessage:{
        color: "#ccc",
        fontSize: 16
    },
    refreshView: {
        backgroundColor: "#ff8c00",//e91e63
        width: 50,
        height: 50,
        borderRadius: 50,
        shadowColor: "#000",
        elevation: 3,
        shadowOffset: { width: 2, height: 5},
        padding: 10,
        alignSelf: "flex-end",
        justifyContent: "center",
        flexDirection: "column"
    },
    refreshOp: {
        padding: 10
    }
})
export default Messages