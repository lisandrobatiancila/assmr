import * as React from 'react'
import { View, Text, Image, StyleSheet, AsyncStorage, ImageBackground, 
    FlatList, TouchableOpacity } from 'react-native'
import axios from 'axios'
import { IMAGES } from '../../../../assets/assets'
const AdminFeedBack = ()=>{
    const [userFeedBacks, setUserFeedBacks] = React.useState([])
    const [ports, setPorts] = React.useState([])
    const retrieveAsyncStorage = async()=>{
        const serverIp = await AsyncStorage.getItem("serverIp")
        const imagePort = await AsyncStorage.getItem("imagePort")
        
        return [serverIp, imagePort]
    }
    React.useEffect(()=>{
        retrieveAsyncStorage()
            .then((PORTS)=>{
                setPorts(PORTS)
                axios.get(`http://${PORTS[0]}:1010/admin/feedbacks/get-users-feedbacks`
                )
                .then((response)=>{
                    setUserFeedBacks(response.data.response)
                })
                .catch((err)=>{
                    console.log(`aP: ${res.message}`)
                })
            })
            .catch((err)=>{
                console.log(`rAS: ${err.message}`)
            })
    }, [])
    return(
        <ImageBackground source={IMAGES.assmer_logo} 
            style={{width: "100%", height: "100%", opacity: 0.9}}>
        <View>
            <View>
                <FlatList data={ userFeedBacks }
                    keyExtractor={( item )=> item.feedback_id} 
                    renderItem={( { item })=>
                    <View key={item.feedback_id}>
                        <TouchableOpacity>
                                    <View key={item.feedbackid} style={{padding: 3}}>
                                        <View style={[styles.card, {padding: 10}]}>
                                            <View style={{flexDirection: "row", marginVertical: 3}}>
                                                <Image source={{uri: `http://${ports[0]}:${ports[1]}${item.user_image}`}} 
                                                    style={{width: 60, height: 60, borderRadius: 50}} /> 
                                                    <View style={{flexDirection: "column", marginHorizontal: 10}}>
                                                        <Text style={{fontSize: 18, fontWeight: "bold"}}>{item.user_lastname}, {item.user_firstname}</Text>
                                                        <Text style={{fontSize: 16}}>{item.feedback_comment}</Text>
                                                        <View style={{flexDirection: "row", marginVertical: 10}}>
                                                            <Image source={(item.feedback_rating > 0)?IMAGES.starcolor:IMAGES.stardefault} 
                                                                style={styles.starSize} />  
                                                            <Image source={(item.feedback_rating > 1)?IMAGES.starcolor:IMAGES.stardefault} 
                                                                style={styles.starSize} />  
                                                            <Image source={(item.feedback_rating > 2)?IMAGES.starcolor:IMAGES.stardefault} 
                                                                style={styles.starSize} />  
                                                            <Image source={(item.feedback_rating > 3)?IMAGES.starcolor:IMAGES.stardefault} 
                                                                style={styles.starSize} />  
                                                            <Image source={(item.feedback_rating > 4)?IMAGES.starcolor:IMAGES.stardefault} 
                                                                style={styles.starSize} /> 
                                                        </View>
                                                        <Text
                                                            style={{textTransform: "capitalize", fontSize: 12}}>
                                                                date: {item.date}
                                                        </Text>
                                                    </View>
                                            </View> 
                                        </View>
                                    </View>
                                </TouchableOpacity>
                    </View>
                    } />
            </View>
        </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    card:{
        backgroundColor: "#fff",
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3,
        marginVertical: 3,
    },
    fbTextInput:{
        backgroundColor: "#ccc",
        borderRadius: 3,
        paddingLeft: 5
    },
    fbText:{
        textTransform: "capitalize",
        fontSize: 22
    },
    fbTextCenter: {
        textAlign: "center",
        color: "#fff",
        fontSize: 16
    },
    giveFB: {
        backgroundColor: "#ccc",
        padding: 10
    },
    starFB: {
        marginHorizontal: 5
    },
    fbButtonOP: {
        padding: 10,
        borderRadius: 3,
    },
    starSize: {
        width: 25,
        height: 25,
        marginHorizontal: 3
    },
    addButtonFB: {
        backgroundColor: "#e91e63",
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
    }
})

export default AdminFeedBack
