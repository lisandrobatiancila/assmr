import * as React from 'react'
import { View, Text, TextInput, Button, AsyncStorage, StyleSheet, Keyboard, 
    ImageBackground, Alert} from 'react-native'
import * as yup from 'yup'
import { Formik } from 'formik'
import axios from 'axios'
import { Context } from '../../../../../hooks/context'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { IMAGES } from '../../../../../assets/assets'

const TemporaryForm = (props)=>{
    const userCredentials = React.useContext(Context)
    const formScheme = yup.object().shape({
        firstname: yup.string().min(2, "Too short").required("Required"),
        middlename: yup.string().min(2, "Too short").required("Required"),
        lastname: yup.string().min(2, "Too short").required("Required"),
        contactno: yup.string().min(3, "Too short").required("Required"),
        address: yup.string().min(3, "Too short").required("Required"),
        company: yup.string().min(3, "Too short").required("Required"),
        job: yup.string().min(3, "Too short").required("Required"),
        salary: yup.string().min(3, "Too short").required("Required")
    })
    const assumerInfo = props.route.params.params.assumerInfo
    const itemInfo = props.route.params.params.itemInfo
    const retrieveAsyncStorage = async()=>{
        const serverIp = await AsyncStorage.getItem("serverIp")
        const imagePort = await AsyncStorage.getItem("imagePort")

        return [serverIp, imagePort]
    }
    return(
        <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss}>
        <ImageBackground source={IMAGES.assmer_logo}
            style={{width: "100%", height: "100%", opacity: 0.9}}>
        <View>
            <View>
            <View>
                {/* <Text>{JSON.stringify(assumerInfo)}</Text> */}
                <Formik initialValues={{firstname: assumerInfo.user_firstname, middlename: assumerInfo.user_middlename, lastname: assumerInfo.user_lastname, 
                    contactno: assumerInfo.user_contactno, address: assumerInfo.user_address, company: "", job: "", salary: ""}}
                    validationSchema={formScheme}
                    onSubmit={(values)=>{
                        console.log(props)
                        retrieveAsyncStorage()
                            .then((PORTS)=>{
                                values.credentials = userCredentials.credentials
                                axios.post(`http://${PORTS[0]}:1010/assumedproperty/user-create-assumption`,
                                    [values, itemInfo]
                                )
                                .then((response)=>{
                                    response = response.data.response
                                    Alert.alert(
                                        'Message',
                                        response
                                    )
                                    props.navigation.navigate("Posted")
                                })
                                .catch((err)=>{
                                    console.log(err.message)
                                })
                            })
                            .catch((err)=>{
                                console.log(err.message)
                            })
                            }}>
                            {
                                (props)=>(
                                    <ScrollView>
                                    <View>
                                        <View style={[styles.card, {padding: 5, marginVertical: 3}]}>
                                            <Text style={{textTransform: "capitalize", fontWeight: "bold"}}>assumption form</Text>
                                            <Text style={{alignSelf: "center", marginVertical: 5, textAlign: "center"}}>Please fill out the form below to assume a property</Text>
                                        </View>
                                        <View style={{padding: 5, marginVertical: 3}}>
                                        <View style={{flexDirection: "row"}}>
                                            <Text style={styles.textAssume}>firstname</Text>
                                            <Text style={styles.textError}>{props.touched.firstname && props.errors.firstname}</Text>
                                        </View>
                                        <TextInput value={props.values.firstname}
                                            value={props.values.firstname} 
                                            onBlur={props.handleBlur("firstname")}
                                            onChangeText={props.handleChange("firstname")}
                                            style={styles.textinputAssume} placeholder="firstname" />
                                        <View style={{flexDirection: "row"}}>
                                            <Text style={styles.textAssume}>middlename</Text>
                                            <Text style={styles.textError}>{props.touched.middlename && props.errors.middlename}</Text>
                                        </View>
                                            <TextInput value={props.values.middlename} 
                                                onBlur={props.handleBlur("middlename")}
                                                onChangeText={props.handleChange("middlename")}
                                                style={styles.textinputAssume} placeholder="middlename" />
                                        <View style={{flexDirection: "row"}}>
                                            <Text style={styles.textAssume}>lastname</Text>
                                            <Text style={styles.textError}>{props.touched.lastname && props.errors.lastname}</Text>
                                        </View>
                                            <TextInput value={props.values.lastname} 
                                                onBlur={props.handleBlur("lastname")}
                                                onChangeText={props.handleChange("lastname")}
                                                style={styles.textinputAssume} placeholder="lastname" />
                                        <View style={{flexDirection: "row"}}>
                                            <Text style={styles.textAssume}>contactno</Text>
                                            <Text style={styles.textError}>{props.touched.contactno && props.errors.contactno}</Text>
                                        </View>
                                        <TextInput keyboardType="phone-pad"
                                            value={props.values.contactno} 
                                            onBlur={props.handleBlur("contactno")}
                                            onChangeText={props.handleChange("contactno")}
                                            style={styles.textinputAssume} placeholder="contactno" />
                                        <View style={{flexDirection: "row"}}>
                                            <Text style={styles.textAssume}>address</Text>
                                            <Text style={styles.textError}>{props.touched.address && props.errors.address}</Text>
                                        </View>
                                            <TextInput value={props.values.address} 
                                                onBlur={props.handleBlur("address")}
                                                onChangeText={props.handleChange("address")}
                                                style={styles.textinputAssume} placeholder="address"/>
                                            <View style={{flexDirection: "row"}}>
                                                <Text style={styles.textAssume}>company</Text>
                                                 <Text style={styles.textError}>{props.touched.company && props.errors.company}</Text>
                                            </View>
                                                <TextInput value={props.values.company}
                                                    onBlur={props.handleBlur("company")}
                                                    onChangeText={props.handleChange("company")}
                                                    style={styles.textinputAssume}
                                                    placeholder="company" />
                                            <View style={{flexDirection: "row"}}>
                                                <Text style={styles.textAssume}>job</Text>
                                                 <Text style={styles.textError}>{props.touched.job && props.errors.job}</Text>
                                            </View>
                                                <TextInput value={props.values.job}
                                                    onBlur={props.handleBlur("job")}
                                                    onChangeText={props.handleChange("job")}
                                                    style={styles.textinputAssume} placeholder="job" />
                                            <View style={{flexDirection: "row"}}>
                                                <Text style={styles.textAssume}>salary</Text>
                                                <Text style={styles.textError}>{props.touched.salary && props.errors.salary}</Text>
                                            </View>
                                                <TextInput value={props.values.salary}
                                                    onBlur={props.handleBlur("salary")}
                                                    onChangeText={props.handleChange("salary")}
                                                    keyboardType="numeric"
                                                    style={styles.textinputAssume} placeholder="salary" />
                                             </View>
                                            <View>
                                                <Button title="submit form" color="#ff7f50" 
                                                    onPress={props.handleSubmit} />
                                        </View>
                                    </View>
                                    </ScrollView>
                                )
                            }
                </Formik>
            </View>
            </View>
        </View>
        </ImageBackground>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    modalContainer:{
        flex: 1,
        flexDirection: "column",
        padding: 5,
    },
    card:{
        borderStyle: "solid",
        backgroundColor: "#fff",
        borderRadius: 3,
        padding: 10,
        marginVertical: 3,
        shadowOffset: {width: 0, height: 3},
        shadowColor: "#000",
        elevation: 3
    },
    property_img:{
        padding: 5,
        borderStyle: "solid",
        backgroundColor: "#f5fffa",
        borderRadius: 3,
        marginVertical: 3,
        shadowOffset: {width: 3, height: 5},
        shadowColor: "#000",
        shadowOpacity: 0.3,
        elevation: 3,
    },
    buttonVPOp: {
        backgroundColor: "#ff7f50",
        padding: 10,
        borderRadius: 3,
        elevation: 3,
        shadowOffset: {width: 2, height: 2}
    },
    textModal: {
        textTransform: "capitalize",
        marginVertical: 5,
    },
    buttonAOP: {
        color: "#fff",
        backgroundColor: "#ff4da6",
        borderRadius: 3,
        padding: 10
    },
    textJ: {
        textTransform: "capitalize",
        marginVertical: 5
    },
    textAssume: {
        textTransform: "capitalize",
        fontWeight: "bold",
        marginVertical: 5,
    },
    textinputAssume: {
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderRadius: 3,
    },
    textError: {
        marginHorizontal: 20,
        marginTop: 5,
        color: "#ff471a"
    }
})
export default TemporaryForm