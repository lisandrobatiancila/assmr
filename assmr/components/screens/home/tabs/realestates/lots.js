import * as React from 'react'
import { View, Text, Image, FlatList, AsyncStorage, StyleSheet, TextInput, 
    TouchableOpacity, ScrollView, Modal, Button, TouchableWithoutFeedback,
    Alert, ImageBackground } from 'react-native'
import { Badge } from 'react-native-elements'
import { SliderBox } from 'react-native-image-slider-box'
import axios from 'axios'
import * as yup from 'yup'
import { Formik } from 'formik'
import { IMAGES } from '../../../../../assets/assets'
import { Context } from '../../../../../hooks/context'

const Lots = ()=>{
    const { userCredentials } = React.useContext(Context)
    const setActiveRE = React.useContext(Context)
    const [lotData, setLotData] = React.useState(null)
    const [certainLot, setCertainLot] = React.useState(null)
    const [sliderLotImages, setSliderLotImages] = React.useState(null)
    const [openModal, setOpenModal] = React.useState(false)
    const [assumerModal, setAssumerModal] = React.useState(false)
    const [assumerInfo, setAssumerInfo] = React.useState(null)
    const [ports, setPorts] = React.useState(null)

    const lotSchema = yup.object().shape({
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
        setActiveRE.setActiveRE('lot')
        retrieveAsyncStorage()
            .then(async(PORTS)=>{
                setPorts(PORTS)
                const lotData = await axios.get(`http://${PORTS[0]}:1010/properties/get_lot_properties`)
                    .then((response)=>{
                        return response.data.response
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
                setLotData(lotData)
            })
            .catch((err)=>{
                console.log(err)
            })
            assumerData()
    }, [])
    const viewCertailLot = (lot)=>{
        setCertainLot(lot)
        setSliderLotImages([
            `http://${ports[0]}:${ports[1]}${lot.lotfirstimage}`,
            `http://${ports[0]}:${ports[1]}${lot.lotsecondimage}`,
            `http://${ports[0]}:${ports[1]}${lot.lotthirdimage}`,
            `http://${ports[0]}:${ports[1]}${lot.lotdocumentimage}`
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
                console.log(err)
            })
    }
    const userAssumedProperty = (LOT) =>{
        retrieveAsyncStorage()
            .then((PORTS)=>{
                userCredentials.credentials.propertyid = LOT.propertyid
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
                        setCertainLot(LOT)
                        setSliderLotImages([
                            `http://${ports[0]}:${ports[1]}${LOT.lotfirstimage}`,
                            `http://${ports[0]}:${ports[1]}${LOT.lotsecondimage}`,
                            `http://${ports[0]}:${ports[1]}${LOT.lotthirdimage}`,
                            `http://${ports[0]}:${ports[1]}${LOT.lotdocumentimage}`
                        ])
                        setAssumerModal(true)
                        setOpenModal(false)
                    }
                })
                .catch((err)=>{
                    console.log(err.message)
                })
            })
            .catch((err)=>{
                console.log(err.message)
            })
    }
    return(
        <View style={{padding: 5, flex: 1, flexDirection: "column", marginVertical: 3, 
            backgroundColor: "#fff"}}>
            <FlatList data={lotData}
                keyExtractor={(item)=> item.propertyid}
                renderItem={({item})=>
                    <ImageBackground source={IMAGES.assmer_logo}
                                style={{width: "100%", height: "100%"}} key={item.propertyid}>
                    <View key={item.propertyid} style={[styles.card, 
                        {backgroundColor: "#ff8c00", opacity: 0.9}]}>
                        <View style={styles.cardHead}>
                            <Image source={{uri: `http://${ports[0]}:${ports[1]}${item.lotfirstimage}`}} resizeMode="contain"
                                style={{width: undefined, height: 200}} resizeMode="stretch" />
                            <TouchableOpacity style={styles.lotAOP}
                                onPress={()=> userAssumedProperty(item)}>
                                <Text style={{textTransform: "capitalize", 
                                    color: "#fff", textAlign: "center"}}>assume</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{backgroundColor: "#66cdaa", padding: 5}}>
                            <Text style={{textTransform: "capitalize"}}>status : {item.propertystatus}</Text>
                        </View>
                        <ScrollView>
                            <View>
                                <Text style={styles.lotText}>property type : {item.propertytype}</Text>
                                <Text style={styles.lotText}>realestate type : {item.realestatetype}</Text>
                                <Text style={styles.lotText}>owner : {item.realestateowner}</Text>
                                <Text style={styles.lotText}>downpayment : {item.realestatedownpayment}</Text>
                                <Text style={styles.lotText}>total assumer : <Badge value={item.totalassumer} status="success"></Badge></Text>
                            </View>
                        </ScrollView>
                        <View>
                            <TouchableOpacity style={styles.lotVOP} onPress={()=> viewCertailLot(item)}>
                                <Text style={{textTransform: "capitalize", color: "#fff",
                                    textAlign: "center", fontSize: 16}}>view property</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    </ImageBackground>
                } />
            <View>
                {(
                    openModal &&
                    <Modal visible={openModal} animationType="slide">
                        <View style={{flex: 1, flexDirection: "column", padding: 5}}>
                            <View style={styles.cardHead}>
                                <SliderBox images={sliderLotImages} dotColor="#ff54cc" 
                                    inactiveDotColor="#000" />
                            </View>
                            <View style={{backgroundColor: "#66cdaa", padding: 5}}>
                                <Text style={styles.lotText}>status : {certainLot.propertystatus}</Text>
                            </View>
                            <ScrollView>
                                <View>
                                    <Text style={styles.lotText}>property type : {certainLot.propertytype}</Text>
                                    <Text style={styles.lotText}>realestate type : {certainLot.realestatetype}</Text>
                                    <Text style={styles.lotText}>developer : {certainLot.realestatedeveloper}</Text>
                                    <Text style={styles.lotText}>owner : {certainLot.realestateowner}</Text>
                                    <Text style={styles.lotText}>location : {certainLot.realestatelocation}</Text>
                                    <Text style={styles.lotText}>downpayment : {certainLot.realestatedownpayment}</Text>
                                    <Text style={styles.lotText}>installmentpaid : {certainLot.realestateinstallmentpaid}</Text>
                                    <Text style={styles.lotText}>installmentduration : {certainLot.realestateinstallmentduration}</Text>
                                    <Text style={styles.lotText}>delinquent : {certainLot.realestateinstallmentdelinquent}</Text>
                                    <Text style={styles.lotText}>description : {certainLot.realestatedescription}</Text>
                                </View>
                            </ScrollView>
                        </View>
                        <View>
                            <Button title="assume" color="#00fa9a"
                                onPress={()=> 
                                userAssumedProperty(certainLot)} />
                            <Button title="back" onPress={()=> setOpenModal(!openModal)} />
                        </View>
                    </Modal>
                )}
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
                                            validationSchema={lotSchema}
                                            onSubmit={(values)=>{
                                                retrieveAsyncStorage()
                                                    .then((PORTS)=>{
                                                        values.credentials = userCredentials.credentials
                                                        axios.post(`http://${PORTS[0]}:1010/assumedproperty/user-create-assumption`,
                                                            [values, certainLot]
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
    cardHead: {
        padding: 5,
        backgroundColor: "#fff",
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3,
        marginVertical: 3
    },
    lotAOP: {
        backgroundColor: "#ff4da6",
        padding: 10,
        borderRadius: 3
    },
    lotVOP:{
        backgroundColor: "#ff7f50",
        padding: 10,
        borderRadius: 3
    },
    lotText: {
        textTransform: "capitalize",
        marginVertical: 3
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
export default Lots