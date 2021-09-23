import * as React from 'react'
import { View, Text, Image, AsyncStorage, FlatList, StyleSheet, TextInput,
    TouchableOpacity, Modal, Button, ScrollView, Alert, TouchableWithoutFeedback,
    ImageBackground } from 'react-native'
import { SliderBox } from 'react-native-image-slider-box'
import { Badge } from 'react-native-elements'
import axios from 'axios'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Context } from '../../../../../hooks/context'
import { IMAGES } from '../../../../../assets/assets'

const House = ()=>{
    const { userCredentials } = React.useContext(Context)
    const setActiveRE = React.useContext(Context)
    const [openModal, setOpenModal] = React.useState(false)
    const [assumerModal, setAssumerModal] = React.useState(false)
    const [houseData, setHouseData] = React.useState(null)
    const [slideHouseImages, setSlideHouseImages] = React.useState(null)
    const [certainHouse, setCertainHouse] = React.useState(null)
    const [assumerInfo, setAssumerInfo] = React.useState(null)
    const [ports, setPorts] = React.useState(null)

    const houseSchema = yup.object().shape({
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
        setActiveRE.setActiveRE('house')
        retrieveAsyncStorage()
            .then(async(PORTS)=>{
                setPorts(PORTS)
                const housesData = await axios.get(`http://${PORTS[0]}:1010/properties/get_house_properties`)
                    .then((response)=>{
                        return response.data.response
                    })
                    .catch((err)=>{
                        console.log('ue-ra: '+err)
                    })
                setHouseData(housesData)
            })
            .catch((err)=>{
                console.log('ue: '+err)
            })
            assumerData()
    }, [])
    const viewCertainHouse = (house)=>{
        setCertainHouse(house)
        setSlideHouseImages([
            `http://${ports[0]}:${ports[1]}${house.housefrontimage}`,
            `http://${ports[0]}:${ports[1]}${house.houserightimage}`,
            `http://${ports[0]}:${ports[1]}${house.houseleftimage}`,
            `http://${ports[0]}:${ports[1]}${house.housebackimage}`,
            `http://${ports[0]}:${ports[1]}${house.housedocumentimage}`
        ])
        setOpenModal(!openModal)
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
                console.log('aD: '+err)
            })
    }
    const userAssumedProperty = (HOUSE) =>{
        retrieveAsyncStorage()
            .then((PORTS)=>{
                userCredentials.credentials.propertyid = HOUSE.propertyid
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
                        setCertainHouse(HOUSE)
                        setSlideHouseImages([
                            `http://${ports[0]}:${ports[1]}${HOUSE.housefrontimage}`,
                            `http://${ports[0]}:${ports[1]}${HOUSE.houserightimage}`,
                            `http://${ports[0]}:${ports[1]}${HOUSE.houseleftimage}`,
                            `http://${ports[0]}:${ports[1]}${HOUSE.housebackimage}`,
                            `http://${ports[0]}:${ports[1]}${HOUSE.housedocumentimage}`
                        ])
                        setAssumerModal(true)
                        setOpenModal(false)
                    }
                })
                .catch((err)=>{
                    console.log('ra-uap: '+err.message)
                })
            })
            .catch((err)=>{
                console.log('uap: '+err.message)
            })
    }
    return(
        <View style={{padding: 5, backgroundColor: "#fff", flex: 1, flexDirection: "column"}}>
            <FlatList 
               data={houseData}
               keyExtractor={(item)=> item.propertyid}
               renderItem={({item})=>
                <View key={item.propertyid} style={{flex: 1, flexDirection: "column",
                    }}>
                    <ImageBackground source={IMAGES.assmer_logo}
                            style={{width: "100%", height: "100%"}}>
                    <View style={[styles.card, {backgroundColor: "#ff8c00", opacity: 0.9}]}>
                        <View style={styles.cardHead}>
                            <Image source={{uri: `http://${ports[0]}:${ports[1]}${item.housefrontimage}`}}
                                style={{width: undefined, height: 200}} resizeMode="stretch" />
                            <TouchableOpacity style={styles.houseAOP}
                                onPress={()=>{
                                    userAssumedProperty(item)
                                }}>
                                <Text style={{textTransform: "capitalize",
                                    textAlign: "center", color: "#fff", fontSize: 16}}>
                                        assume</Text>
                            </TouchableOpacity>    
                        </View>
                        <View>
                            <View style={{backgroundColor: "#66cdaa", padding: 5}}>
                                <Text style={{textTransform: "capitalize"}}>status : {item.propertystatus}</Text>    
                            </View>
                            <Text style={styles.houseText}>property type : {item.propertytype}</Text>
                            <Text style={styles.houseText}>realestate type : {item.realestatetype}</Text>
                            <Text style={styles.houseText}>owner : {item.realestateowner}</Text>
                            <Text style={styles.houseText}>downpayment : {item.realestatedownpayment}</Text>
                            <Text style={styles.houseText}>total assumer : <Badge value={item.totalassumer} status="success"></Badge></Text>
                            <TouchableOpacity style={styles.houseVP} onPress={()=> viewCertainHouse(item)}>
                                <Text style={{textTransform: "capitalize", 
                                    color: "#fff", fontSize: 16, textAlign: "center"}}>
                                        view property
                                    </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    </ImageBackground>
                </View>
                } />
                {
                    (openModal && 
                        (<Modal>
                            <View style={{padding: 5, flex: 1, flexDirection: "column"}}>
                                <View style={styles.card}>
                                    <SliderBox images={slideHouseImages} dotColor="#ff54cc" 
                                        inactiveDotColor="#000" />
                                </View>
                                <View style={{backgroundColor: "#66cdaa", padding: 5}}>
                                    <Text style={styles.houseModalText}>status : {certainHouse.propertystatus}</Text>
                                </View>
                                <ScrollView>
                                <View>
                                    <Text style={styles.houseModalText}>property type : {certainHouse.propertytype}</Text>
                                    <Text style={styles.houseModalText}>realestate type : {certainHouse.realestatetype}</Text>
                                    <Text style={styles.houseModalText}>developer : {certainHouse.realestatedeveloper}</Text>
                                    <Text style={styles.houseModalText}>owner : {certainHouse.realestateowner}</Text>
                                    <Text style={styles.houseModalText}>location : {certainHouse.realestatelocation}</Text>
                                    <Text style={styles.houseModalText}>downpayment : {certainHouse.realestatedownpayment}</Text>
                                    <Text style={styles.houseModalText}>installmentpaid : {certainHouse.realestateinstallmentpaid}</Text>
                                    <Text style={styles.houseModalText}>installmentduration : {certainHouse.realestateinstallmentduration}</Text>
                                    <Text style={styles.houseModalText}>delinquent : {certainHouse.realestateinstallmentdelinquent}</Text>
                                    <Text style={styles.houseModalText}>description : {certainHouse.realestatedescription}</Text>
                                </View>
                                </ScrollView>
                            </View>
                            <View>
                                <Button title="assume" color="#00fa9a"
                                    onPress={()=> 
                                    userAssumedProperty(certainHouse)} />
                                <Button title="back" onPress={()=> setOpenModal(!openModal)} />
                            </View>
                        </Modal>)
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
                                            validationSchema={houseSchema}
                                            onSubmit={(values)=>{
                                                retrieveAsyncStorage()
                                                    .then((PORTS)=>{
                                                        values.credentials = userCredentials.credentials
                                                        axios.post(`http://${PORTS[0]}:1010/assumedproperty/user-create-assumption`,
                                                            [values, certainHouse]
                                                        )
                                                        .then((response)=>{
                                                            response = response.data.response
                                                            Alert.alert(
                                                                'Message',
                                                                response
                                                            )
                                                            setAssumerModal(!assumerModal)
                                                        })
                                                    })
                                                    .catch((err)=>{
                                                        console.log(err)
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
        backgroundColor: "#fff",
        borderStyle: "solid",
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3,
        marginVertical: 3
    },
    cardHead: {
        padding: 5,
        borderRadius: 3,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3,
        marginVertical: 3
    },
    houseAOP: {
        backgroundColor: "#ff4da6",
        padding: 10,
        borderRadius: 3
    },
    houseText:{
        textTransform: "capitalize",
        marginVertical: 5
    },
    houseVP: {
        backgroundColor: "#ff7f50",
        padding: 10,
        borderRadius: 3,
    },
    houseModalText: {
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
        borderRadius: 3,
    },
    textError: {
        marginHorizontal: 20,
        marginTop: 5,
        color: "#ff471a"
    }
})
export default House