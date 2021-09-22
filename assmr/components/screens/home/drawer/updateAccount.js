import * as React from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity, 
    StyleSheet, TextInput, AsyncStorage, FlatList, Alert, Modal, TouchableWithoutFeedback, Keyboard, Button } from 'react-native'
import { Formik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import * as ImagePicker from 'react-native-image-picker'
import Loading from '../../loading/loading'
import { Context } from '../../../../hooks/context'
import { IMAGES } from '../../../../assets/assets'

const UpdateAccount = ()=>{
    const [userSpecifyModal, setUserSpecifyModal] = React.useState(false)
    const userCredentials = React.useContext(Context)
    const [userInformation, setUserInformation] = React.useState([])
    const [userImage, setUserImage] = React.useState("")
    //specificationVariables TextInput
    const [showSpecError, setShowSpecError] = React.useState([])//show if error if
    //Specification Added exceed to 3
    const [userSpecification, setUserSpecification] = React.useState([])
    const [reRender, setreRender] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true)
    const [ports, setPorts] = React.useState([])
    //end of specificationVariables TextInput
    const accountSchemaValidation = yup.object().shape({
        firstname: yup.string().min(2, "Too short").required("Required"),
        middlename: yup.string().min(2, "Too short").required("Required"),
        lastname: yup.string().min(2, "Too short").required("Required"),
        contactno: yup.string().min(11, "Phone no. hould be 11").max(11, "Phone no. Exceed to 11").required("Required"),
        province: yup.string().min(3, "Too short").required("Required"),
        municipality: yup.string().min(3, "Too short").required("Required"),
        barangay: yup.string().min(3, "Too short").required("Required"),
        password: yup.string().max(3, "Too short").required("Required")
    })
    const retrieveAsyncStorage = async()=>{
        const serverIp = await AsyncStorage.getItem("serverIp")
        const imagePort = await AsyncStorage.getItem("imagePort")

        return [serverIp, imagePort]
    }
    const specChange = (specText, specID) =>{
        var data = userSpecification.map((val)=> {
            if (parseInt(val.matching_id) === parseInt(specID)){
                val.newkey = specText
                val.isChange = true,
                val.userid = userCredentials.credentials.userid
            }
            else{
                val.isChange = false
                val.userid = userCredentials.credentials.userid
            }
            return val
        })
        setUserSpecification(data)
    }
    const saveSpecification = ()=>{
        retrieveAsyncStorage()
            .then((PORTS)=>{
                axios.post(`http://${PORTS[0]}:1010/credentials/create-retrieve-user-specification`,
                    userSpecification
                )
                .then((response)=>{
                    console.log(response.data.response)
                    if (response.data.response !== "no changes"){
                        Alert.alert(
                            "Message",
                            response.data.response
                        )
                        userSpecification.map((val)=>{
                            if (val.isChange === true)
                                val.specificationType = "update-specification"
                            return val
                        })
                        setreRender(!reRender)
                        setIsLoading(true)
                    }
                    else
                        Alert.alert(
                            "Message",
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
    }
    const removeSpecification = (matching_id)=>{
        Alert.alert(
            'Confirmation',
            'Are you sure you want to remove this?',
            [
                {text: 'no'},
                {text: 'yes', onPress: ()=>{
                    retrieveAsyncStorage()
                    .then((PORTS)=>{
                        axios.patch(`http://${PORTS[0]}:1010/credentials/user-remove-specification`,
                            {matchingID: matching_id, userID: userCredentials.credentials.userid}
                        )
                        .then((response)=>{
                            Alert.alert(
                                'Message',
                                response.data.response
                            )
                            setreRender(!reRender)
                            setIsLoading(true) //set to true so that it can be "false" next!
                        })
                        .catch((err)=>{
                            console.length('aP: '+err.message)
                        })
                    })
                    .catch((err)=>{
                        console.length('rAS: '+err.message)
                    })
                }}
            ],
            {cancelable: false}
        )
    }
    const add_updateUserImage = ()=>{
        const options = {
            selectionLimit: 1,
            mediaType: 'photo'
        }
        ImagePicker.launchImageLibrary(options, (response)=>{
            if (response.didCancel)
                console.log('userCancel')
            else if (response.assets.length > 0){
                setUserImage(response.assets)
            }
        })
    }
    React.useEffect(()=>{
        console.log('reRender')
        setTimeout(()=>{
            retrieveAsyncStorage()
                .then((PORTS)=>{
                    setPorts(PORTS)
                    axios.post(`http://${PORTS[0]}:1010/credentials/get-active-user-information`,
                        {userid: userCredentials.credentials.userid}
                    )
                    .then((response)=>{
                        setUserInformation(response.data) //setActiveUserInformation
                    })
                    .catch((err)=>{
                        console.log('aP1: '+err.message)
                    })
                    setUserSpecification([])

                    const getSpecifications = {
                        userid: userCredentials.credentials.userid,
                        specificationType: "get-specification"
                    }
                    axios.post(`http://${PORTS[0]}:1010/credentials/create-retrieve-user-specification`,
                        [getSpecifications]
                    )
                    .then((response)=>{
                        response = response.data.response
                        if (Object.keys(response).length > 0){
                            for (r in response){
                                response[r].specificationType = "update-specification"
                                response[r].isChange = false
                            }
                            if (Object.keys(response).length === 1)
                                setUserSpecification([...response, 
                                    {matching_id: 2, newkey: '', specificationType: 'create-specification',
                                        isChange: false},
                                    {matching_id: 3, newkey: '', specificationType: 'create-specification',
                                        isChange: false}])
                            else if (Object.keys(response).length === 2)
                                setUserSpecification([...response, {matching_id: 3, newkey: ''
                                    , specificationType: 'create-specification', isChange: false}])
                            else
                                setUserSpecification(response)
                        }
                        else
                            setUserSpecification([
                                {matching_id: 1, newkey: '', specificationType: 'create-specification', 
                                    isChange: false}, 
                                {matching_id: 2, newkey: '', specificationType: 'create-specification', 
                                    isChange: false}, 
                                {matching_id: 3, newkey: '', specificationType: 'create-specification', 
                                    isChange: false}
                            ])
                    })
                    .catch((err)=>{
                        console.log('aP2: '+err.message)
                    })
            })
            .catch((err)=>{
                console.log('rAS: '+err.message)
            })
            setIsLoading(false)
        }, 1000)
    }, [reRender])
    return(
        (isLoading)?
            <View style={{marginTop: 30}}>
                <Loading title="Please wait..." color="#ff8c00" />
            </View>
        :
            <View style={{backgroundColor: "#ff8c00"}}>
                <FlatList
                data={userInformation}
                keyExtractor={(item)=> item.user_id}
                renderItem={({item})=>
                <ScrollView key={item.user_id}>
                <View style={{padding: 5}}>
                        <View>
                            <View style={styles.card}>
                                <View style={{backgroundColor: "#ccc", borderRadius: 50,
                                    padding: 10, width: 90, height: 90, alignSelf: "center"}}>
                                    <TouchableOpacity
                                        onPress={()=> add_updateUserImage()}>
                                        <Image source={{uri: (userImage === "")?
                                            `http://${ports[0]}:${ports[1]}${item.user_image}`
                                            :
                                            userImage[0].uri
                                            }} resizeMode="contain"
                                            style={{width: undefined, height: 60}} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={[styles.margV, {alignSelf: "center"}]}>
                                    {item.user_lastname}, {item.user_firstname} {item.user_middlename[0]}.
                                </Text>
                                <View style={{width: "50%", height: 3, backgroundColor: "#ff7f50", marginVertical: 5,
                                    alignSelf: "center"}}></View>
                                <Text style={styles.margV}>Hello from ASSUMR. please help us know what property you really like, 
                                    so that we can help
                                </Text>
                                <TouchableOpacity style={[styles.specifyOP, styles.margV]}
                                    onPress={()=> setUserSpecifyModal(!userSpecifyModal) }>
                                    <View style={{flexDirection: "row", marginHorizontal: 5}}>
                                        <Image source={IMAGES.mic } style={{width: 20, height: 20}} />
                                        <Text style={{textAlign: "center", fontWeight: "bold", fontSize: 16, marginHorizontal: 5}}>
                                            Specify what you really want!
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {/*  */}
                            <View style={styles.card}>
                                {(Object.keys(item.userTotalProp).length === 0)?
                                <Text style={{fontWeight: "bold",
                                    textAlign: "center", fontSize: 16,
                                textTransform: "capitalize"}}>no posted properties</Text>
                                :
                                <FlatList data={item.userTotalProp}
                                    keyExtractor={(item)=> item.property_id}
                                    renderItem={({ item })=>
                                        <View style={{alignSelf: "center"}}
                                            key={(item)=> item.property_id}>
                                            <Text style={styles.postedTextsNo}>{item.total_pType}</Text>
                                            <Text style={styles.postedTextsTitle}>posted {item.property_type}</Text>
                                        </View>
                                    } />
                                }
                            </View>
                            {/*  */}
                            <Formik initialValues={{userid: item.user_id, firstname: item.user_firstname, middlename: item.user_middlename
                                , lastname: item.user_lastname, contactno: item.user_contactno,
                                province: item.province, municipality: item.municipality,
                                barangay: item.barangay, password: item.account_password, 
                                retypepassword: item.account_password}}
                                validationSchema = {accountSchemaValidation}
                                onSubmit={(values)=>{
                                    if (values.password === values.retypepassword){
                                        retrieveAsyncStorage()
                                        .then((PORTS)=>{
                                            var form = new FormData()
                                            
                                            for (v in values){
                                                form.append(v, values[v])
                                            }
                                            if (userImage !== ""){
                                                for (uimg in userImage){
                                                    form.append('user-image', {
                                                        uri: userImage[uimg].uri,
                                                        type: userImage[uimg].type,
                                                        name: userImage[uimg].fileName
                                                    })
                                                }
                                            }
                                            axios({
                                                method: "PATCH",
                                                url: `http://${PORTS[0]}:1010/credentials/update-active-user-information`,
                                                data: form,
                                                headers: {
                                                    "Accept": "application/json",
                                                    "Content-Type": "multipart/form-data"
                                                }
                                            })
                                            .then((response)=>{
                                               Alert.alert(
                                                   "Message",
                                                   response.data.response
                                               )
                                            })
                                            .catch((err)=>{
                                                console.log(`aP: ${err}`)
                                            })
                                        })
                                        .catch((err)=>{
                                            console.log(err)
                                        })
                                    }
                                }}>
                                {
                                    (props)=>
                                        <View style={styles.card}>
                                        <View
                                            style={{alignSelf: "center"}}>
                                                <Text 
                                                    style={{textTransform: "capitalize", 
                                                    fontWeight: "bold", fontSize: 17}}>
                                                        edit your information
                                                </Text>
                                            </View>
                                        <View style={{marginVertical: 10}}>
                                            <Text style={{textTransform: "capitalize", fontWeight: "bold", 
                                                fontSize: 15}}>
                                                basic information
                                            </Text>
                                            <View style={{width: 30, backgroundColor: "#ff7f50", 
                                                height: 2, marginVertical: 3}}></View>
                                            <View>
                                                <View style={{flexDirection: "row"}}>
                                                    <Text style={styles.capitalizeText}>
                                                        firstname
                                                    </Text>
                                                    <Text style={styles.textError}>
                                                        {props.touched.firstname && props.errors.firstname}
                                                    </Text>
                                                </View>
                                                <TextInput value={props.values.firstname} style={styles.textINPUT} placeholder="username" 
                                                    onChangeText={props.handleChange("firstname")}
                                                    onBlur={props.handleBlur("firstname")} />
                                                <View style={{flexDirection: "row"}}>
                                                    <Text style={styles.capitalizeText}>middlename</Text>
                                                    <Text style={styles.textError}>{props.touched.middlename && props.errors.middlename}</Text>
                                                </View>
                                                <TextInput value={props.values.middlename} 
                                                    style={styles.textINPUT} 
                                                    placeholder="middlename"
                                                    onChangeText={props.handleChange('middlename')}
                                                    onBlur={props.handleBlur("middlename")} />
                                                <View style={{flexDirection: "row"}}>
                                                    <Text style={styles.capitalizeText}>lastname</Text>
                                                    <Text style={styles.textError}>{props.touched.lastname && props.errors.lastname}</Text>
                                                </View>
                                                <TextInput value={props.values.lastname} 
                                                    style={styles.textINPUT} 
                                                    placeholder="lastname"
                                                    onChangeText={props.handleChange('lastname')}
                                                    onBlur={props.handleBlur("lastname")} />
                                                <View style={{flexDirection: "row"}}>
                                                    <Text style={styles.capitalizeText}>contactno</Text>
                                                    <Text style={styles.textError}>{props.touched.contactno && props.errors.contactno}</Text>
                                                </View>
                                                <TextInput value={props.values.contactno} 
                                                    style={styles.textINPUT} placeholder="contactno"
                                                    onChangeText={props.handleChange('contactno')}
                                                    keyboardType="phone-pad"
                                                    onBlur={props.handleBlur("contactno")} />
                                            </View>
                                        </View>
                                        {/* basic information */}
                                        <View>
                                            <Text style={{textTransform: "capitalize", fontWeight: "bold", 
                                                fontSize: 15}}>
                                                address information
                                            </Text>
                                            <View style={{width: 30, backgroundColor: "#ff7f50", 
                                                height: 2, marginVertical: 3}}></View>
                                            <View>
                                                <View style={{flexDirection: "row"}}>
                                                    <Text style={styles.capitalizeText}>province</Text>
                                                    <Text style={styles.textError}>{props.touched.province && props.errors.province}</Text>
                                                </View>
                                                <TextInput value={props.values.province} 
                                                    style={styles.textINPUT} placeholder="province"
                                                    onChangeText={props.handleChange("province")}
                                                    onBlur={props.handleBlur("province")} />
                                                <View style={{flexDirection: "row"}}>
                                                    <Text style={styles.capitalizeText}>municipality</Text>
                                                    <Text style={styles.textError}>{props.touched.municipality && props.errors.municipality}</Text>
                                                </View>
                                                <TextInput value={props.values.municipality} 
                                                    style={styles.textINPUT} placeholder="municipality"
                                                    onChangeText={props.handleChange("municipality")}
                                                    onBlur={props.handleBlur("municipality")} />
                                                <View style={{flexDirection: "row"}}>
                                                    <Text style={styles.capitalizeText}>barangay</Text>
                                                    <Text style={styles.textError}>{props.touched.barangay && props.errors.barangay}</Text>
                                                </View>
                                                <TextInput value={props.values.barangay} 
                                                    style={styles.textINPUT} placeholder="barangay"
                                                    onChangeText={props.handleChange("barangay")}
                                                    onBlur={props.handleBlur("barangay")} />
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={{textTransform: "capitalize", fontWeight: "bold", 
                                                fontSize: 15}}>
                                                account information
                                            </Text>
                                            <View style={{width: 30, backgroundColor: "#ff7f50", 
                                                height: 2, marginVertical: 3}}></View>
                                            <View>
                                                <View style={{flexDirection: "row"}}>
                                                    <Text style={styles.capitalizeText}>password</Text>
                                                    <Text style={styles.textError}>{props.touched.password && props.errors.password}</Text>
                                                </View>
                                                <TextInput value={props.values.password} 
                                                    style={styles.textINPUT} 
                                                    placeholder="password"
                                                    secureTextEntry={true}
                                                    onChangeText={props.handleChange('password')} />
                                                <Text style={styles.capitalizeText}>Retype password</Text>
                                                <TextInput value={props.values.retypepassword} 
                                                    style={styles.textINPUT} 
                                                    placeholder="Retype password"
                                                    secureTextEntry={true}
                                                    onChangeText={props.handleChange('retypepassword')} />
                                            </View>
                                            <TouchableOpacity style={styles.saveOP}
                                                onPress={props.handleSubmit}>
                                                <Text style={{textTransform: "capitalize", 
                                                    textAlign: "center", fontSize: 16, 
                                                    color: "#fff"}}>save</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                }
                            </Formik>
                        </View>
                </View>
                </ScrollView>
                } />
                {
                    (userSpecifyModal && 
                        <Modal style={{padding: 5}}>
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                <View style={styles.card}>
                                    <View style={styles.card}>
                                        {/* <Text>{JSON.stringify(specificationInformation)}</Text> */}
                                        <Text>Please specify what property you like</Text>
                                    </View>
                                    {(isLoading)?
                                        <Loading />
                                    :
                                    <FlatList data={userSpecification}
                                        keyExtractor={(item)=> item.matching_id}
                                        renderItem={({ item })=>
                                        <View key={item.matching_id} 
                                            style={{flexDirection: "row"}}>
                                            <TextInput value={item.newkey}
                                                onChangeText={(spec)=> specChange(spec, item.matching_id)}
                                                placeholder="add new specification"
                                                multiline={true}
                                                style={[styles.textINPUT, 
                                                {width: (item.newkey.length > 0)?"80%":"100%"}]} />
                                            {(item.newkey.length > 0 &&
                                                <TouchableOpacity style={[styles.removeOp,
                                                    {justifyContent: "center", width: "20%",
                                                    alignItems: "center"}]}
                                                    onPress={()=> removeSpecification(item.matching_id)}>
                                                    <Text style={{textTransform: "capitalize"}}>
                                                        remove</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                        } />
                                    }
                                    <View>
                                        <TouchableOpacity style={[styles.specifyOP, 
                                            {marginVertical: 10}]}
                                            onPress={()=> saveSpecification()}>
                                            <Text style={{textAlign: "center", 
                                                textTransform: "capitalize", fontSize: 16}}>
                                                    save
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.specifyClose}
                                            onPress={()=> setUserSpecifyModal(!userSpecifyModal)}>
                                            <Text style={{textAlign: "center", 
                                                textTransform: "capitalize", fontSize: 16}}>
                                                    close
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </Modal>
                    )
                }      
            </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 3,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3},
        elevation: 3,
        marginVertical: 5
    },
    margV: {
        marginVertical: 5
    },
    specifyOP: {
        backgroundColor: "#4ECDC4",
        padding: 10,
        borderRadius: 3,
    },
    specifyClose: {
        backgroundColor: "#ccc",
        padding: 10,
        borderRadius: 3
    },
    postedTextsNo: {
        textTransform: "capitalize",
        fontSize: 30,
        color: "#4ECDC4",
        alignSelf: "center",
        fontWeight: "bold"
    },
    postedTextsTitle: {
        textTransform: "capitalize", 
        fontWeight: "bold", 
        fontSize: 15,
        marginVertical: 3
    },
    capitalizeText: {
        textTransform: "capitalize"
    },
    saveOP: {
        backgroundColor: "#337ab7",
        padding: 10,
        borderRadius: 3,
        marginVertical: 5
    },
    textINPUT: {
        backgroundColor: "#ccc",
        marginVertical: 3,
        paddingLeft: 10
    },
    textError: {
        marginHorizontal: 20,
        color: "#ff471a"
    },
    specificationInput: {
        paddingLeft: 10,
        borderRadius: 3,
        backgroundColor: "#ccc"
    },
    textMV: {
        textTransform: "capitalize" ,
        marginVertical: 5
    },
    removeOp: {
        backgroundColor: "#ff8c10",
        borderRadius: 3
    }
})
export default UpdateAccount