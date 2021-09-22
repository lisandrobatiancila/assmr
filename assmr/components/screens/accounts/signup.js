import * as React from 'react'
import { View, Text, Image, StyleSheet, TextInput, TouchableWithoutFeedback,
    Keyboard, ScrollView, Button, Picker, Alert, AsyncStorage } from 'react-native'
import { Link } from 'react-router-native'
import axios from 'axios'
import { NativeBaseProvider, Radio } from 'native-base'
import { Formik } from 'formik'
import { IMAGES  } from '../../../assets/assets'
import { provinceLists, addressLists } from './address'

const Signup = ()=>{
    // const [firstname, setFirstname] = React.useState('')
    // const [middlename, setMiddlename] = React.useState('')
    // const [lastname, setLastname] = React.useState('')
    // const [gender, setGender] = React.useState('male')
    // const [contact, setContact] = React.useState('')

    const [province, setProvince] = React.useState('aklan')
    const [municipality, setMunicipality] = React.useState('')
    const [municipalityLists, setMunicipalityLists] = React.useState(addressLists[0].aklan.municipality)
    const [barangay, setBarangay] = React.useState('Select barangay')
    const [barangayLists, setBarangayLists] = React.useState()

    // const [username, setUsername] = React.useState('')
    // const [password, setPassword] = React.useState('')
    // const [retypePassword, setRetypePassword] = React.useState('')

    const [validationError, setValidationError] = React.useState({
        firstname: false,
        middlename: false,
        lastname: false,
        contact: false,
        municipality: false,
        barangay: false,
        userCredentials: false
    })
    React.useLayoutEffect(()=>{
        if (province === 'aklan'){
            // console.log(addressLists[0].aklan)
            setMunicipalityLists(addressLists[0].aklan.municipality)
            setBarangayLists([{id: 1, name: "Select barangay"}])
            if (municipality === "balete"){
                setBarangayLists(municipalityLists[1].barangay)
                setBarangay(municipalityLists[1].barangay[0].name)
            }
            if (municipality === "batan"){
                setBarangayLists(municipalityLists[2].barangay)
                setBarangay(municipalityLists[2].barangay[0].name)
            }
            if (municipality === "buruanga"){
                setBarangayLists(municipalityLists[3].barangay)
                setBarangay(municipalityLists[3].barangay[0].name)
            }
            if (municipality === "kalibo"){
                setBarangayLists(municipalityLists[4].barangay)
                setBarangay(municipalityLists[4].barangay[0].name)
            }
            if (municipality === "malay"){
                setBarangayLists(municipalityLists[5].barangay)
                setBarangay(municipalityLists[5].barangay[0].name)
            }
        }
        else if (province === "antique"){
            // console.log(province)
            setMunicipalityLists(addressLists[1].antique.municipality)
            if (municipality === "belison"){
                setBarangayLists(municipalityLists[1].barangay)
                setBarangay(municipalityLists[1].barangay[0].name)
            }
            if (municipality === "caluya"){
                setBarangayLists(municipalityLists[2].barangay)
                setBarangay(municipalityLists[2].barangay[0].name)
            }
            if (municipality === "libertad"){
                setBarangayLists(municipalityLists[3].barangay)
                setBarangay(municipalityLists[3].barangay[0].name)
            }
            if (municipality === "sebaste"){
                setBarangayLists(municipalityLists[4].barangay)
                setBarangay(municipalityLists[4].barangay[0].name)
            }
            if (municipality === "valderama"){
                setBarangayLists(municipalityLists[5].barangay)
                setBarangay(municipalityLists[5].barangay[0].name)
            }
        }
        else if (province === "bohol"){
            setMunicipalityLists(addressLists[2].bohol.municipality)
            if (municipality === "alborquerque"){
                setBarangayLists(municipalityLists[1].barangay)
                setBarangay("claiming")
            }
            if (municipality === "loboc"){
                setBarangayLists(municipalityLists[2].barangay)
                setBarangay("claiming")
            }
            if (municipality === "san miguel"){
                setBarangayLists(municipalityLists[3].barangay)
                setBarangay("claiming")
            }
            if (municipality === "sikatuna"){
                setBarangayLists(municipalityLists[4].barangay)
                setBarangay("claiming")
            }
            if (municipality === "tagbilaran city"){
                setBarangayLists(municipalityLists[5].barangay)
                setBarangay("claiming")
            }
        }
        else if (province === "capiz"){
            setMunicipalityLists(addressLists[3].capiz.municipality)
            if (municipality === "dumalag"){
                setBarangayLists(municipalityLists[1].barangay)
                setBarangay("claiming")
            }
            if (municipality === "ivisan"){
                setBarangayLists(municipalityLists[2].barangay)
                setBarangay("claiming")
            }
            if (municipality === "panay"){
                setBarangayLists(municipalityLists[3].barangay)
                setBarangay("claiming")
            }
            if (municipality === "pilar"){
                setBarangayLists(municipalityLists[4].barangay)
                setBarangay("claiming")
            }
            if (municipality === "sigma"){
                setBarangayLists(municipalityLists[5].barangay)
                setBarangay("claiming")
            }
        }
        else if (province === "cebu");
        else if (province === "guimaras"){
            setMunicipalityLists(addressLists[5].guimaras.municipality)
            if (municipality === "jordan"){
                setBarangayLists(municipalityLists[1].barangay)
                setBarangay("claiming")
            }
            if (municipality === "nueva valencia"){
                setBarangayLists(municipalityLists[2].barangay)
                setBarangay("claiming")
            }
            if (municipality === "san lorenzo"){
                setBarangayLists(municipalityLists[3].barangay)
                setBarangay("claiming")
            }
            if (municipality === "sibunag"){
                setBarangayLists(municipalityLists[4].barangay)
                setBarangay("claiming")
            }
        }
    }, [province, municipality])
    
    const retrieveAsyncStorage = async()=>{
        return new Promise((resolve, reject)=>{
            const serverIp = AsyncStorage.getItem("serverIp")
            if (serverIp)
                resolve(serverIp)
            else
                reject({message: "error in retrieveAsyncStorage"})
        })
    }
    return(
        <ScrollView>
            <NativeBaseProvider accessibilityLabel="signup">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Formik
                        initialValues={{firstname: "", middlename: "", lastname: "",
                            gender: "male", contact: "", username: "", password: "", retypePassword: ""}}
                            onSubmit={(values)=>{
                                retrieveAsyncStorage()
                                .then((serverIp)=>{
                                    var validationPassed = false
                                    const payLoads = {
                                        firstname: values.firstname,
                                        middlename: values.middlename,
                                        lastname: values.lastname,
                                        gender: values.gender,
                                        contact: values.contact,
                                        province: province,
                                        municipality: municipality,
                                        barangay: barangay,
                                        username: values.username,
                                        password: values.password
                                    }
                                    
                                    if (values.firstname.length > 3 && values.middlename.length > 2 && values.lastname.length > 3){
                                        setValidationError({firstname: false, middlename: false, lastname: false})
                                        if (values.contact.length > 10 && values.contact.length < 12){
                                            setValidationError({contact: false})
                                            if (municipality !== "Select municipality" && barangay !== "Select barangay"){
                                                setValidationError({municipality: false, barangay: false})
                                                if (values.username.length > 3){
                                                    setValidationError({userCredentials: false})
                                                    if (values.password.length > 3 && values.retypePassword.length > 3){
                                                        if (values.password === values.retypePassword){
                                                            validationPassed = true
                                                            setValidationError({userCredentials: false})
                                                        }
                                                        else{
                                                            setValidationError({userCredentials: true})
                                                            Alert.alert(
                                                                "Oops",
                                                                "Passwords does not match"
                                                            )
                                                        }
                                                    }
                                                    else{
                                                        setValidationError({userCredentials: true})
                                                        Alert.alert(
                                                            "Oops",
                                                            "Account information has failed in validation"
                                                        )
                                                    }
                                                }
                                                else{
                                                    setValidationError({userCredentials: true})
                                                    Alert.alert(
                                                        "Oops",
                                                        "Account information has failed in validation!"
                                                    )
                                                }
                                           }
                                            else{
                                                if (municipality === "Select municipality")
                                                    setValidationError({municipality: true})
                                                else if (barangay === "Select barangay")
                                                    setValidationError({barangay: true})
                                                Alert.alert(
                                                    "Oops",
                                                    "Address information has failed in validation!"
                                                )
                                            }//end of address validation
                                        }
                                        else{
                                            setValidationError({contact: true})
                                            Alert.alert(
                                                "Oops",
                                                "Contact validation has failed!"
                                            )
                                        }//end of contact validation
                                    }
                                    else{
                                        if (values.firstname.length < 4)
                                            setValidationError({firstname: true})
                                        else if (values.middlename.length < 4)
                                            setValidationError({middlename: true})
                                        else if (values.lastname.length < 4)
                                            setValidationError({lastname: true})
                                        Alert.alert(
                                            "Oops",
                                            "Basic information has failed in validation!"
                                        )
                                    }//end of basic information validation

                                    if (validationPassed){
                                        retrieveAsyncStorage()
                                            .then((serverIp)=>{
                                                axios.post(`http://${serverIp}:1010/credentials/mobile_signup`, payLoads)
                                                    .then((resp)=>{
                                                       Alert.alert(
                                                            'Message',
                                                            resp.data.response
                                                        )
                                                    })
                                                    .catch((err)=>{
                                                        console.log(err)
                                                    })
                                            })
                                            .catch((err)=>{
                                                console.log(err)
                                            })
                                    }
                                })
                                .catch((err)=>{
                                    console.log(err)
                                })
                            }}>
                        {
                            (props)=>(
                                <View style={styles.container}>
                                <View style={styles.dividerContainer}>
                                    <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                                        <View style={styles.divider}></View>
                                        <Image source={ IMAGES.user } resizeMode="contain"
                                        style={styles.img} />
                                        <View style={{backgroundColor: "#ff8c00", padding: 5,
                                            width: "90%"}}>
                                            <Text style={{textTransform: "capitalize"}}>basic information</Text>
                                        </View>
                                    </View>
                                    <View style={styles.formDiv}>
                                        <Text style={{ textTransform: "capitalize" }}>
                                            firstname {
                                                (validationError.firstname)?
                                                <Text style={{color: "#cd143c", textTransform: "lowercase"}}>validation fail</Text>
                                                :
                                                ""
                                            }
                                        </Text>
                                        <TextInput value={props.values.firstname}
                                            onChangeText={props.handleChange('firstname')}
                                            style={styles.form}  placeholder="firstname" />
                                    </View>
                                    <View style={styles.formDiv}>
                                        <Text style={{ textTransform: "capitalize" }}>
                                            middlename {
                                                (validationError.middlename)?
                                                <Text style={{color: "#cd143c", textTransform: "lowercase"}}>validation fail</Text>
                                                :
                                                ""
                                            }
                                        </Text>
                                        <TextInput value={props.values.middlename}
                                            onChangeText={props.handleChange('middlename')}
                                            style={styles.form}  placeholder="middlename" />
                                    </View>
                                    <View style={styles.formDiv}>
                                        <Text style={{ textTransform: "capitalize" }}>
                                            Lastname {
                                                (validationError.lastname)?
                                                <Text style={{color: "#cd143c", textTransform: "lowercase"}}>validation fail</Text>
                                                :
                                                ""
                                            }
                                        </Text>
                                        <TextInput value={props.values.lastname}
                                            onChangeText={props.handleChange('lastname')}
                                            style={styles.form } placeholder="lastname" />
                                    </View>
                                    <View style={styles.formDiv, {marginTop: 3}}>
                                        <Text style={{textTransform: "capitalize", fontSize: 18}}>gender</Text>
                                        <Radio.Group value={props.values.gender} onChange={props.handleChange('gender')} accessibilityLabel="gender">
                                            <Radio value="male" accessibilityLabel="male"
                                                style={{marginBottom: 3, marginTop: 3}}>
                                                <Text style={{marginLeft: 3, textTransform: "capitalize"}}>male</Text>
                                            </Radio>
                                            <Radio value="female" accessibilityLabel="female"
                                                style={{marginBottom: 3}}>
                                                <Text style={{marginLeft: 3, textTransform: "capitalize"}}>female</Text>
                                            </Radio>
                                        </Radio.Group>
                                    </View>
                                    <View style={styles.formDiv}>
                                        <Text style={{textTransform: "capitalize"}}>
                                            contact no.{
                                                (validationError.contact)?
                                                <Text style={{color: "#cd143c", textTransform: "lowercase"}}>validation fail</Text>
                                                :
                                                ""
                                            }
                                        </Text>
                                        <TextInput value={props.values.contact}
                                            onChangeText={props.handleChange('contact')}
                                            keyboardType="phone-pad" placeholder="+63" 
                                            style={styles.form}/>
                                    </View>
                                </View>
                                {/* end of user */}
                                <View style={styles.dividerContainer}>
                                    <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                                        <View style={styles.divider}></View>
                                        <Image source={IMAGES.address} style={styles.img} 
                                            resizeMode="contain" />
                                        <View style={{backgroundColor: "#ff8c00", padding: 5,
                                            width: "90%"}}>
                                            <Text style={{textTransform: "capitalize",
                                                marginLeft: 20}}>address</Text>
                                        </View>
                                    </View>
                                    <View style={{backgroundColor: "#fff"}}>
                                        <Text style={{ textTransform: "capitalize", paddingLeft: 5 }}>
                                            province
                                        </Text>
                                        {/* <TextInput style={ styles.form } placeholder="city" /> */}
                                        <Picker selectedValue={province} onValueChange={(province, id)=> 
                                            setProvince(province) }
                                            prompt="Select">
                                            {
                                                provinceLists.map((val)=>
                                                    <Picker.Item key={val.id} label={val.name} value={val.name} />
                                                )
                                            }
                                        </Picker>
                                    </View>
                                    <View style={{backgroundColor: "#fff"}}>
                                        <Text style={{ textTransform: "capitalize", paddingLeft: 5 }}>
                                            municipality {
                                                (validationError.municipality)?
                                                <Text style={{color: "#cd143c", textTransform: "lowercase"}}>validation fail</Text>
                                                :
                                                ""
                                            }
                                        </Text>
                                        {/* <TextInput style={styles.form } placeholder="municipality" /> */}
                                        <Picker selectedValue={municipality}
                                            onValueChange={(municipality)=> setMunicipality(municipality)}>
                                            {
                                                municipalityLists.map((val)=>
                                                    <Picker.Item key={val.id} label={val.name} value={val.name} />
                                                )
                                            }
                                        </Picker>
                                    </View>
                                    <View style={{backgroundColor: "#fff"}}>
                                        <Text style={{ textTransform: "capitalize", paddingLeft: 5 }}>
                                            barangay {
                                                (validationError.barangay)?
                                                <Text style={{color: "#cd143c", textTransform: "lowercase"}}>validation fail</Text>
                                                :
                                                ""
                                            }
                                        </Text>
                                        {/* <TextInput style={styles.form } placeholder="barangay" /> */}
                                        <Picker selectedValue={barangay} onValueChange={(barangay)=> setBarangay(barangay)} >
                                            {
                                                (barangay === "Select barangay")?<Picker.Item key={1} label="Select barangay" value="Select barangay"/>
                                                :(
                                                    barangayLists.map((val)=>
                                                        <Picker.Item key={val.id} label={val.name} value={val.name} />
                                                    )
                                                )
                                            }
                                        </Picker>
                                    </View>
                                </View>
                                {/* end of address */}

                                <View style={ styles.dividerContainer }>
                                    <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                                        <View style={ styles.divider }></View>
                                        <Image source={ IMAGES.lock } resizeMode="contain"
                                            style={ styles.img } />
                                        <View style={{backgroundColor: "#ff8c00", padding: 5,
                                            width: "90%"}}>
                                            <Text style={{textTransform: "capitalize",
                                                marginLeft: 20}}>account information</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <Text style={{ textTransform: "capitalize" }}>
                                            username {
                                                (validationError.userCredentials)?
                                                <Text style={{color: "#cd143c", textTransform: "lowercase"}}>check your username and passwords if they are the same</Text>
                                                :
                                                ""
                                            }
                                        </Text>
                                        <TextInput value={props.values.username}
                                            onChangeText={props.handleChange('username')}
                                            style={styles.form} placeholder="username" />
                                    </View>
                                    <View>
                                        <Text style={{textTransform: "capitalize" }}>password</Text>
                                        <TextInput value={props.values.password}
                                            onChangeText={props.handleChange('password')}
                                            style={styles.form} secureTextEntry={true} placeholder="********" />
                                    </View>
                                    <View>
                                        <Text style={{ textTransform: "capitalize" }}>retype-password</Text>
                                        <TextInput value={props.values.retypePassword}
                                            onChangeText={props.handleChange('retypePassword')}
                                            style={styles.form} secureTextEntry={ true }
                                            placeholder="********" />
                                    </View>
                                </View>
                                {/* end of accounts */}

                                <View>
                                    <View style={{marginTop: 5}}></View>
                                    <Button title="create account" onPress={()=> props.handleSubmit()} />
                                    <Link to="/">
                                        <Text style={{ textAlign: "center", marginTop: 5,
                                            color: "teal" }}>Already have an account?</Text>
                                    </Link>
                                </View>

                            </View>
                            )
                        }
                    </Formik>
                </TouchableWithoutFeedback>
            </NativeBaseProvider>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        padding: 5,
        backgroundColor: "#ddd"
    },
    dividerContainer: {
        display: "flex",
        flexDirection: "column"
    },
    divider:{
        width: "100%",
        height: 2,
        backgroundColor: "#000",
        marginLeft: 30,
    },
    img:{
        width: 30,
        height: 30,
        justifyContent: "flex-start"
    },
    formDiv:{
        display: "flex"
    },
    form:{
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 3,
        paddingLeft: 10
    },
    pickerStyle:{
        backgroundColor: "#ccc",
        textTransform: "capitalize",
        color: "#ccc"
    }
})
export default Signup