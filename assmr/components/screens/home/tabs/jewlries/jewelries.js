import * as React from 'react'
import { View, Text, Image, AsyncStorage, FlatList, StyleSheet, 
    TouchableOpacity, Modal, Button, Alert, ScrollView, TextInput, 
    TouchableWithoutFeedback, ImageBackground } from 'react-native'
import { Badge } from 'react-native-elements'
import { Formik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import { SliderBox } from 'react-native-image-slider-box'
import Loading from '../../../loading/loading'
import { IMAGES } from '../../../../../assets/assets'
import { Context } from '../../../../../hooks/context'

const Jewelries = (props)=>{
    const userCredentials = React.useContext(Context)//pass to axios
    const [jewelries, setJewelries] = React.useState(null)
    const [openModal, setOpenModal] = React.useState(false)
    const [certainJewelry, setCertainJewelry] = React.useState(null)
    const [slideJewelryImages, setSlideJewelryImages] = React.useState(null)
    const [assumerModal, setAssumerModal] = React.useState(false)
    const [assumerInfo, setAssumerInfo] = React.useState(null)
    const [loading, setLoading] = React.useState('true')
    const [ports, setPorts] = React.useState(null)

    const jewelrySchema = yup.object().shape({
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
        const allProperties = await AsyncStorage.getItem("allProperties")
        return [serverIp, imagePort, allProperties]
    }
    React.useLayoutEffect(()=>{
        setTimeout(()=>{
            retrieveAsyncStorage()
            .then(async(PORTS)=>{
                setPorts(PORTS)
                var data = await axios.get(`http://${PORTS[0]}:1010/properties/get_jewelries_properties`)
                .then((response)=>{
                    return response.data.response
                })
                .catch((err)=>{
                    console.log("fc: "+err)
                })
                setJewelries(data)
            })
            .catch((err)=>{
                console.log('e: '+err)
            })
            assumerData()
            setLoading(!loading)
        }, 1000)
    }, [])
    const viewCertainJewelry = (jewelry)=>{
        setCertainJewelry(jewelry)
        setSlideJewelryImages([
            `http://${ports[0]}:${ports[1]}${jewelry.firstimage}`, 
            `http://${ports[0]}:${ports[1]}${jewelry.jsecondimage}`, 
            `http://${ports[0]}:${ports[1]}${jewelry.thirdimage}`,
            `http://${ports[0]}:${ports[1]}${jewelry.documentimage}`
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
                    console.log('rA: '+err)
                })
                setAssumerInfo(assumerInfo)
            })
            .catch((err)=>{
                console.log('aD: '+err)
            })
    }
    const userAssumedProperty = (jewelry)=>{
        retrieveAsyncStorage()
            .then((PORTS)=>{
                setPorts(PORTS)
                userCredentials.credentials.propertyid = jewelry.propertyid
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
                        setCertainJewelry(jewelry)
                        setSlideJewelryImages([
                            `http://${ports[0]}:${ports[1]}${jewelry.firstimage}`, 
                            `http://${ports[0]}:${ports[1]}${jewelry.jsecondimage}`, 
                            `http://${ports[0]}:${ports[1]}${jewelry.thirdimage}`,
                            `http://${ports[0]}:${ports[1]}${jewelry.documentimage}`
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
        
            (loading)?
            <Loading title="Please wait..." color= "#ff8c10"/>
            :
            <View style={{padding: 5, backgroundColor: "#fff"}}>
                <FlatList data={jewelries}
                keyExtractor={(item)=> item.jewelryid}
                renderItem={({item})=>
                (
                    <ImageBackground source={IMAGES.assmer_logo}
                        style={{width: "100%", height: "100%"}}>
                    <View style={[styles.card, {backgroundColor: "#ff8c00", opacity: 0.9}]}>
                        {/* <Text>{JSON.stringify(item)}</Text> */}
                        <View style={styles.property_img}>
                            <View>
                                <Image source={{uri: `http://${ports[0]}:${ports[1]}${item.firstimage}`}} 
                                    style={{width: undefined, height: 200}} resizeMode="stretch" />
                            </View>
                            <TouchableOpacity style={styles.buttonAOP}
                                onPress={()=> userAssumedProperty(item)}>
                                <Text style={{textTransform: "capitalize", color: "#fff",
                                    fontSize: 16, textAlign: "center"}}>assume</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <View style={{backgroundColor: "#66cdaa",padding: 5}}>
                                <Text style={{textTransform: "capitalize"}}>status : 
                                    <Text style={{textTransform: "none"}}> {item.propertystatus}</Text>
                                </Text>
                            </View>
                            <Text style={styles.textJ}>property type : {item.propertytype}</Text>
                            <Text style={styles.textJ}>jewelry name : {item.jewelryname}</Text>
                            <Text style={styles.textJ}>owner : {item.jewelryowner}</Text>
                            <Text style={styles.textJ}>downpayment : {item.jewelrydownpayment}</Text>
                            <Text style={styles.textJ}>total assumer : <Badge value={item.totalassumer} status="success" ></Badge>
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.buttonVPOp} onPress={()=> viewCertainJewelry(item)}>
                            <Text style={{textAlign: "center", textTransform: "capitalize",
                                fontSize: 16, color: "#fff"}}>view property</Text>
                        </TouchableOpacity>
                    </View>
                    </ImageBackground>
                )
                } />
                {
                    (openModal &&
                        <Modal animationType="slide">
                            <View style={styles.modalContainer}>
                                <View style={styles.card}>
                                    <SliderBox images={slideJewelryImages} dotColor="#ff54cc"
                                        inactiveDotColor="#000" />
                                </View>
                                <Text style={{backgroundColor: "#66cdaa", padding: 5, textTransform: "capitalize"}}>status: {certainJewelry.propertystatus}</Text>
                                <ScrollView>
                                <View style={{padding: 5}}>
                                    <Text style={styles.textModal}>property type : {certainJewelry.propertytype}
                                    </Text>
                                    <Text style={styles.textModal}>jewelry name : {certainJewelry.jewelryname}</Text>
                                    <Text style={styles.textModal}>owner : {certainJewelry.jewelryowner}</Text>
                                    <Text style={styles.textModal}>location : {certainJewelry.jewelrylocation}</Text>
                                    <Text style={styles.textModal}>downpayment : {certainJewelry.jewelrydownpayment}</Text>
                                    <Text style={styles.textModal}>installmentpaid : {certainJewelry.jewelryinstallmentpaid}</Text>
                                    <Text style={styles.textModal}>installmentduration : {certainJewelry.jewelryinstallmentduration}</Text>
                                    <Text style={styles.textModal}>delinquent : {certainJewelry.jewelrydelinquent}</Text>
                                    <Text style={styles.textModal}>description : {certainJewelry.jewelrydescription}</Text>
                                </View>
                                </ScrollView>
                            </View>
                            <View>
                                <Button title="assume" color="#00fa9a" onPress={()=> {
                                    userAssumedProperty(certainJewelry)
                                }} />
                                <Button title="back" onPress={()=> setOpenModal(!openModal)} />
                            </View>
                        </Modal>
                        )
                }
                {
                    (assumerModal &&
                        <Modal visible={assumerModal} animationType="slide">
                            <View>
                                <ImageBackground source={IMAGES.assmer_logo}
                                    style={{width: "100%", height: "100%",
                                       opacity: 0.9 }}>
                                <TouchableWithoutFeedback>
                                    <ScrollView>
                                        <View style={[styles.card, {padding: 5, marginVertical: 3}]}>
                                            <Text style={{textTransform: "capitalize", fontWeight: "bold"}}>assumption form</Text>
                                            <Text style={{alignSelf: "center", marginVertical: 5, textAlign: "center"}}>Please fill out the form below to assume a property</Text>
                                        </View>
                                        <Formik initialValues={{firstname: assumerInfo.user_firstname, middlename: assumerInfo.user_middlename, lastname: assumerInfo.user_lastname, 
                                            contactno: assumerInfo.user_contactno, address: assumerInfo.user_address, company: "", job: "", salary: ""}}
                                            validationSchema={jewelrySchema}
                                            onSubmit={(values)=>{
                                                retrieveAsyncStorage()
                                                    .then((PORTS)=>{
                                                        values.credentials = userCredentials.credentials
                                                        axios.post(`http://${PORTS[0]}:1010/assumedproperty/user-create-assumption`,
                                                            [values, certainJewelry]
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
                                </ImageBackground>
                            </View>
                        </Modal>
                    )
                }
            </View>
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
export default Jewelries