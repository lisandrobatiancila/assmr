import * as React from 'react'
import { View, Text, TextInput, StyleSheet, Image, AsyncStorage, FlatList, TouchableOpacity,
    Modal,  Button, ScrollView, TouchableWithoutFeedback, Alert,
    ImageBackground } from 'react-native'
import { Badge } from 'react-native-elements'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Context } from '../../../../../hooks/context'
import axios from 'axios'
import { SliderBox } from 'react-native-image-slider-box'
import { IMAGES} from '../../../../../assets/assets'

const Vehicles = ()=>{
    const userCredentials = React.useContext(Context)//pass to axios
    const [vehicles, setVehicles] = React.useState(null)
    const [openModal, setOpenModal] = React.useState(false)
    const [certainVehicle, setCertainVehicle] = React.useState(null)
    const [slideVehicleImages, setSlideVehicleImages] = React.useState(null)
    const [assumerModal, setAssumerModal] = React.useState(false)
    const [assumerInfo, setAssumerInfo] = React.useState(null)
    const [ports, setPorts] = React.useState(null)
    const vehicleSchema = yup.object().shape({
        firstname: yup.string().min(2, "Too short").required("Required"),
        middlename: yup.string().min(2, "Too short").required("Required"),
        lastname: yup.string().min(2, "Too short").required("Required"),
        contactno: yup.string().min(3, "Too short").required("Required"),
        address: yup.string().min(3, "Too short").required("Required"),
        company: yup.string().min(3, "Too short").required("Required"),
        job: yup.string().min(3, "Too short").required("Required"),
        salary: yup.string().min(3, "Too short").required("Required")
    })
    const retrieveAsyncStorage = async()=>{
        const serverIp = await AsyncStorage.getItem("serverIp")
        const imagePort = await AsyncStorage.getItem("imagePort")

        return [serverIp, imagePort]
    }
    
    React.useEffect(()=>{
        retrieveAsyncStorage()
        .then(async(PORTS)=>{
            setPorts(PORTS)
            const response = await axios.get(`http://${PORTS[0]}:1010/properties/get_vehicles_properties`)
                .then((resp)=>{
                    return resp.data.response
                })
                .catch((err)=>{
                    console.log('rs: '+err)
                })
            setVehicles(response)
        })
        .catch((error)=>{
            console.log('dd: '+error)
        })
        assumerData()
    }, [])
    const viewCertailVehicle = (vehicle)=>{
        setCertainVehicle(vehicle)
        setSlideVehicleImages([
            // vehicle.vehicleid,
            `http://${ports[0]}:${ports[1]}${vehicle.vehiclefrontimage}`,
            `http://${ports[0]}:${ports[1]}${vehicle.vehiclerightimage}`,
            `http://${ports[0]}:${ports[1]}${vehicle.vehicleleftimage}`,
            `http://${ports[0]}:${ports[1]}${vehicle.vehiclebackimage}`,
            `http://${ports[0]}:${ports[1]}${vehicle.vehiclecrimage}`,
            `http://${ports[0]}:${ports[1]}${vehicle.vehicleorimage}`
        ])
        setOpenModal(!openModal)
    }
    const userAssumedProperty = (VEHICLE)=>{
        retrieveAsyncStorage()
            .then((PORTS)=>{
                userCredentials.credentials.propertyid = VEHICLE.propertyid
                axios.post(`http://${PORTS[0]}:1010/assumedproperty/check-assumer-validity`,
                    userCredentials.credentials
                )
                .then((response)=>{
                    if (response.data.response === "assumer-is-owner")
                        Alert.alert(
                            'Message',
                            'You can not assume your own property!'
                        )
                    else if (response.data.response === "user-assumed-already")
                        Alert.alert(
                            'Message',
                            'You assumed this property already!'
                        )
                    else{
                        setCertainVehicle(VEHICLE)
                        setSlideVehicleImages([
                            // vehicle.vehicleid,
                            `http://${ports[0]}:${ports[1]}${VEHICLE.vehiclefrontimage}`,
                            `http://${ports[0]}:${ports[1]}${VEHICLE.vehiclerightimage}`,
                            `http://${ports[0]}:${ports[1]}${VEHICLE.vehicleleftimage}`,
                            `http://${ports[0]}:${ports[1]}${VEHICLE.vehiclebackimage}`,
                            `http://${ports[0]}:${ports[1]}${VEHICLE.vehiclecrimage}`,
                            `http://${ports[0]}:${ports[1]}${VEHICLE.vehicleorimage}`
                        ])
                        setAssumerModal(true)
                        setOpenModal(false)
                    }
                })
                .catch((err)=>{
                    console.log('rs: '+err.message)
                })
            })
            .catch((err)=>{
                console.log('up: '+err.message)
            })
    }
    const assumerData = ()=>{
        retrieveAsyncStorage()
            .then(async(PORTS)=>{
                const assumerInfo = await axios.post(`http://${PORTS[0]}:1010/assumedproperty/assume`,
                    userCredentials
                )
                .then((response)=>{
                    return response.data.response
                })
                .catch((err)=>{
                    console.log(err)
                })
                setAssumerInfo(assumerInfo)
            })
            .catch((err)=>{
                console.log('ad: '+err)
            })
    }
    return(
        <View style={{padding: 5, backgroundColor: "#fff"}}>
            <FlatList 
                data={vehicles}
                keyExtractor={(item)=> item.propertyid}
                renderItem={({item})=>
                    <ImageBackground source={IMAGES.assmer_logo}
                        style={{width: "100%", height: "100%", opacity: 0.9}}>
                    <View key={item.propertyid} style={[styles.card, 
                        {backgroundColor: "#ff8c00", opacity: 0.9}]}>
                        <View style={styles.cardIMG}>
                            <View>
                                <Image source={{uri: `http://${ports[0]}:${ports[1]}${item.vehiclefrontimage}`}} 
                                    style={{width: undefined, height: 200}} resizeMode="stretch" />
                            </View>
                            <TouchableOpacity style={styles.buttonOp}
                                onPress={()=> userAssumedProperty(item)}>
                                <Text style={{textTransform: "capitalize",
                                    textAlign: "center", color: "#fff",
                                    fontSize: 16}}>assume</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{backgroundColor: "#66cdaa", padding: 5}}>
                            <Text style={{textTransform: "capitalize"}}>status :
                                <Text> {item.propertystatus}</Text>
                            </Text>
                        </View>
                        <View style={{marginTop: 3, marginBottom: 3}}>
                            <Text style={styles.textV}>property type : {item.propertytype}</Text>
                            <Text style={styles.textV}>vehicle name : {item.vehiclename}</Text>
                            <Text style={styles.textV}>owner : {item.vehicleowner}</Text>
                            <Text style={styles.textV}>downpayment : {item.vehicledownpayment}</Text>
                            <Text style={styles.textV}>total assumer : <Badge value={item.totalassumer} status="success"></Badge></Text>
                            <TouchableOpacity style={styles.buttonVOP}
                                onPress={()=> viewCertailVehicle(item)}>
                                <Text style={{textAlign: "center", textTransform: "capitalize",
                                    fontSize: 16, color: "#fff"}}>view property</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    </ImageBackground>
                } />
                {
                    (openModal &&
                        <Modal
                            visible={openModal} animationType="slide">
                            <View style={{flex:1, flexDirection: "column", padding: 5}}>
                                <View style={styles.cardIMG}>
                                    {/* <Image source={IMAGES.land} resizeMode="contain"
                                        style={{width: 100, height: 100, alignSelf: "center"}}/> */}
                                    <SliderBox images={slideVehicleImages} dotColor="#ff54cc"
                                        inactiveDotColor="#000" />
                                </View>
                                <View style={{backgroundColor: "#66cdaa", padding: 5}}>
                                    <Text style={styles.textV}>status : {certainVehicle.propertystatus}</Text>
                                </View>
                                <ScrollView>
                                    <View>
                                        <Text style={styles.textV}>property type : {certainVehicle.propertytype}</Text>
                                        <Text style={styles.textV}>property name : {certainVehicle.vehiclename}</Text>
                                        <Text style={styles.textV}>model : {certainVehicle.vehiclemodel}</Text>
                                        <Text style={styles.textV}>owner : {certainVehicle.vehicleowner}</Text>
                                        <Text style={styles.textV}>downpayment : {certainVehicle.vehicledownpayment}</Text>
                                        <Text style={styles.textV}>location : {certainVehicle.vehiclelocation}</Text>
                                        <Text style={styles.textV}>installmentpaid : {certainVehicle.vehicleinstallmentpaid}</Text>
                                        <Text style={styles.textV}>installmentduration : {certainVehicle.vehicleinstallmentduration}</Text>
                                        <Text style={styles.textV}>delinquent : {certainVehicle.vehicledelinquent}</Text>
                                    </View>
                                </ScrollView>
                            </View>
                            <View>
                                <Button title="assume" color="#00fa9a" onPress={()=>{
                                    userAssumedProperty(certainVehicle)
                                }} />
                                <Button title="back" onPress={()=> setOpenModal(!openModal)}  />
                            </View>
                        </Modal>
                    )
                }
                {
                    (assumerModal && 
                        <Modal visible={assumerModal} animationType="slide">
                            <ImageBackground source={IMAGES.assmer_logo}
                                style={{width: "100%", height: "100%", opacity: 0.9}}>
                            <View>
                                <TouchableWithoutFeedback>
                                    <ScrollView>
                                        <View style={[styles.card, {padding: 5, marginVertical: 3}]}>
                                            <Text style={{textTransform: "capitalize", fontWeight: "bold"}}>assumption form</Text>
                                            <Text style={{alignSelf: "center", marginVertical: 5, textAlign: "center"}}>Please fill out the form below to assume a property</Text>
                                        </View>
                                        <Formik initialValues={{firstname: assumerInfo.user_firstname, middlename: assumerInfo.user_middlename, lastname: assumerInfo.user_lastname, 
                                            contactno: assumerInfo.user_contactno, address: assumerInfo.user_address, company: "", job: "", salary: ""}}
                                           validationSchema = {vehicleSchema}
                                            onSubmit={(values)=>{
                                                retrieveAsyncStorage()
                                                    .then((PORTS)=>{
                                                        values.credentials = userCredentials.credentials
                                                        axios.post(`http://${PORTS[0]}:1010/assumedproperty/user-create-assumption`,
                                                            [values, certainVehicle]
                                                        )
                                                        .then((response)=>{
                                                            response = response.data.response
                                                            Alert.alert(
                                                                'Message',
                                                                response
                                                            )
                                                            setAssumerModal(!assumerModal)
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
                                                    <View>
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
                                                            <Button title="cancel" onPress={()=> {
                                                                setAssumerModal(!assumerModal)
                                                                setOpenModal(!openModal)
                                                            }} />
                                                        </View>
                                                    </View>
                                                )
                                            }
                                        </Formik>
                                    </ScrollView>
                                </TouchableWithoutFeedback>
                            </View>
                            </ImageBackground>
                        </Modal>
                    )
                }
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        padding: 10,
        borderStyle: "solid",
        backgroundColor: "#fff",
        borderRadius: 3,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {width: 3, height: 5},
        shadowOpacity: 1,
        marginVertical: 3
    },
    cardIMG: {
        padding: 5,
        borderStyle: "solid",
        backgroundColor: "#fff",
        borderRadius: 3,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {width: 3, height: 5},
        shadowOpacity: 1,
        marginVertical: 3,
    },
    buttonOp: {
        backgroundColor: "#ff4da6",
        padding: 10,
        borderRadius: 3
    },
    buttonVOP: {
        backgroundColor: "#ff7f50",
        padding: 10,
        borderRadius:3
    },
    textV:{
        textTransform: "capitalize",
        marginVertical: 5
    },
    textAssume: {
        textTransform: "capitalize",
        fontWeight: "bold",
        marginVertical: 3
    },
    textinputAssume: {
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderRadius: 3
    },
    textError: {
        marginHorizontal: 20,
        marginTop: 5,
        color: "#ff471a"
    }
})
export default Vehicles