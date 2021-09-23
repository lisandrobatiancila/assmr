import * as React from 'react'
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity,
    TouchableWithoutFeedback, Keyboard, Alert, Modal, AsyncStorage,
    LogBox, ScrollView, ImageBackground } from 'react-native'
import { Link } from 'react-router-native'
import axios from 'axios'
import { Formik } from 'formik'
import { IMAGES } from '../../../assets/assets'
import { padding } from 'styled-system'

LogBox.ignoreAllLogs(true)
const Login = (props)=>{
    const [serverIp, setServerIp] = React.useState('192.168.1.154')//your, ip here
    const [imagePORT, setImagePORT] = React.useState('8887')//use google 200 Ok server
    const serveServer = async ()=>{
        try{
            props.setOpenModal(false)
            await AsyncStorage.setItem("serverIp", serverIp)
            await AsyncStorage.setItem("imagePort", imagePORT)
        }catch(err){
            console.log(err)
        }
        
    }
    const retrieveAsyncStorage = async()=>{
        return await new Promise((resolve, reject)=>{
            const PORTS = AsyncStorage.getItem('serverIp')
            resolve(PORTS)
        })
    }
    return(
        <View>
            {
                (props.openModal)?
                <Modal visible={props.openModal}
                    animationType="slide"
                    style={{backgroundColor: "#ccc"}}>
                    <ImageBackground source={IMAGES.assmer_logo} 
                        style={{width: "100%", height: "100%"}}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={{padding: 10, alignContent: "center", 
                            justifyContent: "center", flex: 1,
                            backgroundColor: "#ff8c00", opacity: 0.9}}>
                            <Text style={{textTransform: "capitalize", 
                                color: "#000", fontSize: 20, textAlign: "center",
                                marginBottom: 5}}>what is your server ip and Image port?</Text>
                            <TextInput placeholder="serverIP#?" value={serverIp}
                            style={styles.inptPORT}
                            keyboardType="numeric" onChangeText={
                                (serverIp)=> setServerIp(serverIp)
                                } />
                            <TextInput placeholder="imagePORT#?" value={imagePORT}
                            style={styles.inptPORT}
                            keyboardType="numeric" 
                            onChangeText={
                                (imagePORT)=> setImagePORT(imagePORT)
                                } />
                            <TouchableOpacity style={styles.touchOp}
                                onPress={()=> serveServer()}>
                                <Text style={styles.textOp}>try this ip !</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                    </ImageBackground>
                </Modal>
                :
                (<Formik initialValues={{username: "", password: ""}}
                    onSubmit={(values)=>{
                        retrieveAsyncStorage().then((serverIp)=>{
                            axios.post(`http://${serverIp}:1010/credentials/mobile_login`, 
                                values
                            )
                            .then((resp)=>{
                                const response = resp.data.resp
                                if (typeof(response) === 'object'){
                                    // props.setCredentials(response)
                                    const patt = /@super.*|.*admin/gi
                                    if (patt.test(values.username)){
                                        response.userType = 'admin'
                                        props.setCredentials(response)
                                    }
                                    else{
                                        response.userType = 'user'
                                        props.setCredentials(response)
                                    }
                                }
                                else if (typeof(response) === 'string'){
                                   Alert.alert(
                                       'Message',
                                       response
                                   )
                                }
                            })
                            .catch((err)=>{
                                console.log(err.message)
                                Alert.alert(err.message)
                            })
                        })
                    }}>
                    {
                        (props)=>(
                            <ImageBackground source={IMAGES.assmer_logo}
                                style={{width: "100%", height: "100%"}}>
                            <ScrollView style={{backgroundColor: "#ff8c00", opacity: 0.9, height: "100%"}}>
                            <View style={{flexDirection: "column",
                                backgroundColor: "#ff8c00", height: "100%"}}>
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                <View style={[styles.container, {padding: 10}]}>
                                    <Text style={styles.textHeader}>
                                        assumr account
                                    </Text>
                                    <View style={styles.form_container}>
                                        <Text style={styles.text}>username</Text>
                                        <TextInput style={styles.textinput} keyboardType="email-address"
                                            placeholder="Username" value={ props.values.username } 
                                            onChangeText={props.handleChange('username')} />
                                        <Text style={styles.text}>password</Text>
                                        <TextInput style={styles.textinput} placeholder="********"
                                            secureTextEntry={true} value={ props.values.password } 
                                            onChangeText={props.handleChange('password')} />
                                        <Button  title="login" onPress={props.handleSubmit} />
                                        <TouchableWithoutFeedback>
                                            <Link to="/signup">
                                                <Text style={styles.textSignup}>Don't have an account?</Text>
                                            </Link>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            </View>
                            </ScrollView>
                            </ImageBackground>
                        )
                    }
                </Formik>)
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        justifyContent: "center",
        alignContent: "center",
    },
    textHeader:{
        position: "relative",
        fontWeight: "bold",
        textAlign: "center",
        textTransform: "capitalize",
        fontSize: 23,
        top: 20
    },
    text:{
        fontSize: 18,
        textTransform: "capitalize",
    },
    textinput:{
        backgroundColor: "#fff",
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 3,
        paddingLeft: 10
    },
    form_container:{
        marginTop: 50
    },
    textSignup:{
        marginTop: 10,
        textAlign: "center",
        color: "teal",
        fontSize: 16
    },
    touchOp:{
        backgroundColor: "#00b8e6",
        padding: 10,
        borderRadius: 3,
        marginTop: 10,
    },
    textOp: {
        textAlign: "center",
        textTransform: "capitalize"
    },
    inptPORT: {
        backgroundColor: "#fff",
        marginTop: 5,
        borderRadius: 3,
        paddingLeft: 10
    }
})

export default Login