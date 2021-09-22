import * as React from 'react'
import { View, Text, Image, AsyncStorage, StyleSheet, FlatList, 
    TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Alert, TouchableWithoutFeedback } from 'react-native'
import axios from 'axios'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Context } from '../../../../../hooks/context'
import { IMAGES } from '../../../../../assets/assets'

const OpenMessage = (props)=>{
    const userCredentials = React.useContext(Context)
    const [userMessages, setUserMessages] = React.useState([])
    const [reRender, setreRender] = React.useState(false)//trigger re-Render
    const messageScheme = yup.object().shape({
        message: yup.string().min(0, "Too short").required("Required")
    })
    const [heights, setHeights] = React.useState("90%")
    const retrieveAsyncStorage = async()=>{
        const serverIp = await AsyncStorage.getItem("serverIp")
        const imagePort = await AsyncStorage.getItem("imagePort")

        return [serverIp, imagePort]
    }
    React.useEffect(()=>{
        retrieveAsyncStorage()
            .then((PORTS)=>{
                axios.post(`http://${PORTS[0]}:1010/messages/open-user-chatbox`,
                    [userCredentials.credentials, props.route.params]
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
    }, [reRender])
    return(
        <View style={{padding: 5, backgroundColor: "#fff", height: "100%"}}>
            <View style={{flexDirection: "column", height: heights}}>
                <FlatList 
                    data={userMessages}
                    keyExtractor={(item)=> item.messageid}
                    renderItem={({ item })=>
                        // active user
                        (item.messagesender === userCredentials.credentials.useremail)?
                        <View style={styles.userPullLeft}>
                            <View style={{flexDirection: "row", marginVertical: 5}}>
                                <Text style={[styles.textMessages, 
                                    styles.cardMSSG, {paddingLeft: 15}]}>
                                        {item.messagetext}</Text>
                                <Image source={IMAGES.user} style={{width: 60, 
                                    height: 60, marginHorizontal: 5}} />
                            </View>
                        </View>
                        :
                        
                        <View style={styles.userPullRight}>
                            <View style={{flex: 1, flexDirection: "row", marginVertical: 5}}>
                                <Image source={IMAGES.user} style={{width: 60, 
                                    height: 60, marginHorizontal: 5}} />
                                <Text style={[styles.textMessages, 
                                    styles.cardMSSG, {paddingLeft: 15}]}>{item.messagetext}</Text>
                            </View>
                        </View>
                    } />
                <View style={{height: 20}}></View>
            </View>
            <Formik initialValues={{message: ""}}
                validationSchema={messageScheme}
                onSubmit={(values, { resetForm })=>{
                    retrieveAsyncStorage()
                        .then((PORTS)=>{
                            axios.post(`http://${PORTS[0]}:1010/messages/send-other-user-messages`,
                                [userCredentials.credentials, props.route.params, values]
                            )
                            .then((response)=>{
                                setreRender(!reRender)
                            })
                            .catch((err)=>{
                                console.log(err)
                            })
                            resetForm()
                        })
                        .catch((err)=>{
                            console.log(err.message)
                        })
                }}>
                {
                    (props)=>
                    <View>
                        <View style={styles.chatInput}>
                            <TextInput value={props.values.message}
                                onChangeText={props.handleChange("message")}
                                multiline={true}
                                style={styles.textInputMSSG} placeholder="Type here..."
                                onFocus={()=> setHeights("80%")}
                                onBlur={()=> setHeights("90%")} />
                            <TouchableOpacity
                                onPress={props.handleSubmit}>
                                <Image source={IMAGES.send_arrow} 
                                    style={{width: 35, height: 35, backgroundColor: "#fff",
                                        marginTop: 10, tintColor: "teal"}} 
                                    resizeMode="contain" />
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </Formik>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        padding: 10,
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3
    },
    userPullRight: {
        flexDirection: "column"
    },
    userPullLeft: {
        flex: 1,
        flexDirection: "column",
        alignItems: "flex-end",
    },
    cardMSSG: {
        width: 100,
        height: 50,
        borderRadius: 50,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3,
        marginVertical: 2,
        padding: 5,
    },
    textMessages: {
        flex: 1,
        flexDirection: "row",
        fontSize: 16,
        paddingLeft: 10,
        paddingTop: 12
    },
    chatInput: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    textInputMSSG: {
        width: "90%",
        backgroundColor: "#ccc",
        borderRadius: 5,
        paddingLeft: 10
    }
})

export default OpenMessage