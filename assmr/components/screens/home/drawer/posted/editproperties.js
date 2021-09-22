import React, {} from 'react'
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, 
    AsyncStorage, 
    Alert } from 'react-native'
import { Badge } from 'react-native-elements'
import axios from 'axios'
import { Formik } from 'formik'
import * as yup from 'yup'
const EditProperties = (props)=>{
    const whatProperty = props.route.params
    const jewelryValidationSchema = yup.object().shape({
        ownername: yup.string().min(3, "Length should be greater 2").required("Required"),
        jewelryname: yup.string().min(3, "Length should be greater 2").required("Required"),
        location: yup.string().min(3, "Length should be greater 2").required("Required"),
        downpayment: yup.string().min(2, "").required("Required"),
        installmentpaid: yup.string().min(2, "").required("Required"),
        installmentduration: yup.string().min(2, "").required("Required"),
        delinquent: yup.string().min(2, "").required("Required")
    })
    const realestateValidationSchema = yup.object().shape({
        ownername: yup.string().min(3, "Length should be greater 2").required("Required"),
        location: yup.string().min(3, "Length should be greater 2").required("Required"),
        downpayment: yup.string().min(2, "").required("Required"),
        installmentpaid: yup.string().min(2, "").required("Required"),
        installmentduration: yup.string().min(2, "").required("Required"),
        delinquent: yup.string().min(2, "").required("Required")
    })
    const vehicleValidationSchema = yup.object().shape({
        ownername: yup.string().min(3, "Length should be greater 2").required("Required"),
        vehiclename: yup.string().min(3, "Length should be greater 2").required("Required"),
        model: yup.string().min(3, "Length should be greater 2").required("Required"),
        location: yup.string().min(3, "Length should be greater 2").required("Required"),
        downpayment: yup.string().min(2, "").required("Required"),
        installmentpaid: yup.string().min(2, "").required("Required"),
        installmentduration: yup.string().min(2, "").required("Required"),
    })
    const retrieveAsyncStorage = async()=>{
        const serverIp = await AsyncStorage.getItem("serverIp")
        const imagePort = await AsyncStorage.getItem("imagePort")
        
        return [serverIp, imagePort]
    }

    return(
        <ScrollView>
        <View style={{padding: 5}}>
            {
                (whatProperty.item.propertytype === "jewelry" &&
                <View style={styles.card}>
                    <Text style={[styles.card, styles.textCenter, 
                        styles.textCapitalize]}>{whatProperty.item.propertytype}</Text>
                    <View style={[styles.card, {marginVertical: 5}]}>
                        <Image source={{uri: `http://${whatProperty.ports[0]}:${whatProperty.ports[1]}${whatProperty.item.firstimage}`}} 
                            style={{width: undefined, height: 200}} resizeMode="stretch" />
                    </View>
                    <View>
                        <View style={{backgroundColor: "#66cdaa", padding: 5}}>
                            <Text style={styles.textCapitalize}>
                                property status : {whatProperty.item.propertystatus}
                            </Text>
                        </View>
                        <Text style={[styles.textCapitalize, styles.textMV]}>total assumer : 
                            <Badge value={whatProperty.item.totalassumer} status="success"></Badge>
                        </Text>
                        <Formik initialValues={{propertyid: whatProperty.item.propertyid, ownername: whatProperty.item.jewelryowner, jewelryname: whatProperty.item.jewelryname, 
                            location: whatProperty.item.jewelrylocation, downpayment: whatProperty.item.jewelrydownpayment, 
                            installmentpaid: whatProperty.item.jewelry_installmentpaid,installmentduration: whatProperty.item.jewelryinstallmentduration,
                            delinquent: whatProperty.item.jewelrydelinquent, description: whatProperty.item.jewelrydescription}}
                            validationSchema={jewelryValidationSchema}
                            onSubmit={(values)=>{
                                values.propertytype = "jewelry"
                                retrieveAsyncStorage()
                                    .then((PORTS)=>{
                                        axios.post(`http://${PORTS[0]}:1010/posted-property/user-update-certain-properties`,
                                            values
                                        )
                                        .then((response)=>{
                                            Alert.alert(
                                                'Message',
                                                response.data.response,
                                                [
                                                    {title: "okay"}
                                                ],
                                                {cancelable: false}
                                            )
                                        })
                                        .catch((err)=>{
                                            console.log(err)
                                        })
                                    })
                                    .catch((err)=>{
                                        console.log(err)
                                    })
                            }}>
                            {
                                (props)=>
                                <View>
                                    <View style={{flexDirection: "row"}}>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>owner</Text>
                                        <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.ownername && props.errors.ownername}</Text>
                                    </View>
                                    <TextInput value={props.values.ownername} placeholder="owner name" 
                                        style={styles.textInput} 
                                        onChangeText={props.handleChange("ownername")}
                                        onBlur={props.handleBlur("ownername")} />
                                    <View style={{flexDirection: "row"}}>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>jewelry name</Text>
                                        <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.jewelryname && props.errors.jewelryname}</Text>
                                    </View>
                                    <TextInput value={props.values.jewelryname} placeholder="jewelry name" 
                                        style={styles.textInput} 
                                        onChangeText={props.handleChange("jewelryname")}
                                        onBlur={props.handleBlur("jewelryname")} />
                                    <View style={{flexDirection: "row"}}>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>location</Text>
                                        <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.location && props.errors.location}</Text>
                                    </View>
                                    <TextInput value={props.values.location} placeholder="location" 
                                        style={styles.textInput} 
                                        onChangeText={props.handleChange("location")}
                                        onBlur={props.handleBlur("location")} />
                                    <View style={{flexDirection: "row"}}>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>downpayment</Text>
                                        <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.downpayment && props.errors.downpayment}</Text>
                                    </View>
                                    <TextInput value={props.values.downpayment} placeholder="downpayment" 
                                        style={styles.textInput} 
                                        onChangeText={props.handleChange("downpayment")}
                                        onBlur={props.handleBlur("downpayment")}
                                        keyboardType="numeric" />
                                    <View style={{flexDirection: "row"}}>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>installmentpaid</Text>
                                        <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.installmentpaid && props.errors.installmentpaid}</Text>
                                    </View>
                                    <TextInput value={props.values.installmentpaid} placeholder="installmentpaid" 
                                        style={styles.textInput}
                                        onChangeText={props.handleChange("installmentpaid")}
                                        onBlur={props.handleBlur("installmentpaid")}
                                        keyboardType="numeric" />
                                    <View style={{flexDirection: "row"}}>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>installmentduration</Text>
                                        <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.installmentduration && props.errors.installmentduration}</Text>
                                    </View>
                                    <TextInput value={props.values.installmentduration} placeholder="installmentduration" 
                                        style={styles.textInput}
                                        onChangeText={props.handleChange("installmentduration")}
                                        onBlur={props.handleBlur("installmentduration")} />
                                    <View style={{flexDirection: "row"}}>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>delinquent</Text>
                                        <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.delinquent && props.errors.delinquent}</Text>
                                    </View>
                                    <TextInput value={props.values.delinquent}
                                        onChangeText={props.handleChange("delinquent")} 
                                        onBlur={props.handleBlur("delinquent")}
                                        placeholder="delinquent"
                                        style={styles.textInput} />
                                    <Text style={[styles.textCapitalize, styles.textMV]}>description</Text>
                                    <TextInput value={props.values.description} placeholder="description" 
                                        style={styles.textInput}
                                        onChangeText={props.handleChange("description")}
                                        onBlur={props.handleBlur("description")} />
                                    <View>
                                        <TouchableOpacity style={styles.saveUpdateTO}
                                            onPress={props.handleSubmit}>
                                            <Text style={[styles.textCapitalize, styles.textCenter,
                                                {fontSize: 16}]}>save update</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }
                        </Formik>
                    </View>
                </View>
                )
            }
            {
                (whatProperty.item.propertytype === "vehicle" &&
                <View>
                    <View style={styles.card}>
                        <Text style={[styles.card, styles.textCapitalize,
                             styles.textCenter]}>{whatProperty.item.propertytype}</Text>
                        <View style={styles.card}>
                            <Image source={{uri: `http://${whatProperty.ports[0]}:${whatProperty.ports[1]}${whatProperty.item.vehiclefrontimage}`}}
                                style={{width: undefined, height: 200}} resizeMode="stretch" />
                        </View>
                        <View>
                            <View style={{backgroundColor: "#66cdaa", padding: 5}}>
                                <Text style={styles.textCapitalize}>property status : {whatProperty.item.propertystatus}</Text>
                            </View>
                            <Formik initialValues={{propertyid: whatProperty.item.propertyid, ownername: whatProperty.item.vehicleowner, vehiclename: whatProperty.item.vehiclename, model: whatProperty.item.vehiclemodel,
                                location: whatProperty.item.vehiclelocation, downpayment: whatProperty.item.vehicledownpayment, installmentpaid: whatProperty.item.vehicleinstallmentpaid,
                                installmentduration: whatProperty.item.vehicleinstallmentduration,
                                delinquent: whatProperty.item.vehicledelinquent , description: whatProperty.item.vehicledescription}}
                                validationSchema={vehicleValidationSchema}
                                onSubmit={(values)=>{
                                    values.propertytype = "vehicle"
                                    retrieveAsyncStorage()
                                        .then((PORTS)=>{
                                            console.log('tests')
                                            axios.post(`http://${PORTS[0]}:1010/posted-property/user-update-certain-properties`,
                                                values
                                            )
                                            .then((response)=>{
                                                Alert.alert(
                                                    'Message',
                                                    response.data.response,
                                                    [
                                                        {title: "ok"}
                                                    ],
                                                    {cancelable: false}
                                                )
                                            })
                                            .catch((err)=>{
                                                console.log(err)
                                            })
                                        })
                                        .catch((err)=>{
                                            console.log(err)
                                        })
                                }}>
                                {
                                    (props)=>
                                        <View>
                                            <Text style={[styles.textCapitalize, styles.textMV]}>total assumer : 
                                                <Badge value={whatProperty.item.totalassumer} status="success"></Badge>
                                            </Text>
                                            <View style={{flexDirection: "row"}}>
                                                <Text style={[styles.textCapitalize, styles.textMV]}>owner</Text>
                                                <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.ownername && props.errors.ownername}</Text>
                                            </View>
                                            <TextInput value={props.values.ownername} placeholder="owner" 
                                                style={styles.textInput} 
                                                onChangeText={props.handleChange("ownername")}
                                                onBlur={props.handleBlur("ownername")} />
                                            <View style={{flexDirection: "row"}}>
                                                <Text style={[styles.textCapitalize, styles.textMV]}>vehicle name</Text>
                                                <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.vehiclename && props.errors.vehiclename}</Text>
                                            </View>
                                            <TextInput value={props.values.vehiclename} placeholder="vehicle name" 
                                                style={styles.textInput}
                                                onChangeText={props.handleChange("vehiclename")}
                                                onBlur={props.handleBlur("vehiclename")} />
                                            <View style={{flexDirection: "row"}}>
                                                <Text style={[styles.textCapitalize, styles.textMV]}>model</Text>
                                                <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.model && props.errors.model}</Text>
                                            </View>
                                            <TextInput value={props.values.model} placeholder="model" 
                                                onChangeText={props.handleChange("model")}
                                                onBlur={props.handleBlur("model")}
                                                style={styles.textInput} />
                                            <View style={{flexDirection: "row"}}>
                                                <Text style={[styles.textCapitalize, styles.textMV]}>location</Text>
                                                <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.location && props.errors.location}</Text>
                                            </View>
                                            <TextInput value={props.values.location} placeholder="location" 
                                                onChangeText={props.handleChange("location")}
                                                onBlur={props.handleBlur("location")}
                                                style={styles.textInput} />
                                            <View style={{flexDirection: "row"}}>
                                                <Text style={[styles.textCapitalize, styles.textMV]}>downpayment</Text>
                                                <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.downpayment && props.errors.downpayment}</Text>
                                            </View>
                                            <TextInput value={props.values.downpayment} placeholder="downpayment" 
                                                style={styles.textInput}
                                                onChangeText={props.handleChange("downpayment")}
                                                onBlur={props.handleBlur("downpayment")}
                                                keyboardType="numeric" />
                                            <View style={{flexDirection: "row"}}>
                                                <Text style={[styles.textCapitalize, styles.textMV]}>installmentpaid</Text>
                                                <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.installmentpaid && props.errors.installmentpaid}</Text>
                                            </View>
                                            <TextInput value={props.values.installmentpaid} placeholder="installmentpaid" 
                                                style={styles.textInput}
                                                onChangeText={props.handleChange("installmentpaid")}
                                                onBlur={props.handleBlur("installmentpaid")}
                                                keyboardType="numeric" />
                                            <View style={{flexDirection: "row"}}>
                                                <Text style={[styles.textCapitalize, styles.textMV]}>installmentduration</Text>
                                                <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.installmentduration && props.errors.installmentduration}</Text>
                                            </View>
                                            <TextInput value={props.values.installmentduration} placeholder="installmentduration" 
                                                onChangeText={props.handleChange("installmentduration")}
                                                onBlur={props.handleBlur("installmentduration")}
                                                style={styles.textInput} />
                                            <View style={{flexDirection: "row"}}>
                                                <Text style={[styles.textCapitalize, styles.textMV]}>delinquent</Text>
                                                <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.delinquent && props.errors.delinquent}</Text>
                                            </View>
                                            <TextInput value={props.values.delinquent}
                                                style={styles.textInput}
                                                onChangeText={props.handleChange("delinquent")}
                                                placeholder="delinquent" />
                                            <View style={{flexDirection: "row"}}>
                                                <Text style={[styles.textCapitalize, styles.textMV]}>description</Text>
                                                <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.description && props.errors.description}</Text>
                                            </View>
                                            <TextInput value={props.values.description} placeholder="description" 
                                                onChangeText={props.handleChange("description")}
                                                onBlur={props.handleBlur("description")}
                                                style={styles.textInput} />
                                            <View>
                                                <TouchableOpacity style={styles.saveUpdateTO}
                                                    onPress={props.handleSubmit}>
                                                    <Text style={[styles.textCapitalize, styles.textCenter,
                                                        {fontSize: 16}]}>save updates</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                }
                            </Formik>
                        </View>
                    </View>
                </View>
                )
            }
            {
                (whatProperty.item.propertytype === "realestate" &&
                <View>
                    <Text style={[styles.card, styles.textCenter, 
                        styles.textCapitalize]}>{whatProperty.item.propertytype}</Text>
                    <View style={[styles.card, {marginVertical: 5}]}>
                        <Image source={{ uri: `http://${whatProperty.ports[0]}:${whatProperty.ports[1]}${whatProperty.item.image}`}} 
                            style={{width: undefined, height: 200}} resizeMode="stretch" />
                    </View>
                    <View>
                        <View style={{backgroundColor: "#66cdaa", padding: 5}}>
                            <Text style={styles.textCapitalize}>
                                property status : {whatProperty.item.propertystatus}
                            </Text>
                        </View>
                        <Text style={[styles.textCapitalize, styles.textMV]}>total assumer : 
                            <Badge value={whatProperty.item.totalassumer} status="success"></Badge>
                        </Text>
                        <Formik initialValues={{propertyid: whatProperty.item.propertyid, realestateid: whatProperty.item.realestateid, 
                            ownername: whatProperty.item.realestateowner, location: whatProperty.item.realestatelocation
                            , downpayment: whatProperty.item.realestatedownpayment, installmentpaid: whatProperty.item.realestateinstallmentpaid,
                            installmentduration: whatProperty.item.realestateinstallmentduration, 
                            developer: whatProperty.item.developer, delinquent: whatProperty.item.realestateinstallmentdelinquent,
                            description: whatProperty.item.realestatedescription,
                            type: whatProperty.item.type}}
                            validationSchema={realestateValidationSchema}
                            onSubmit={(values)=>{
                                values.propertytype = "realestate"
                                values.realestatetype = whatProperty.item.realestatetype
                                if (values.developer === "")
                                    values.developer = "N/A"
                                retrieveAsyncStorage()
                                .then((PORTS)=>{
                                    axios.post(`http://${PORTS[0]}:1010/posted-property/user-update-certain-properties`,
                                        values
                                    )
                                    .then((response)=>{
                                        Alert.alert(
                                            'Message',
                                            response.data.response,
                                            [
                                                {text: "ok"}
                                            ],
                                            {cancelable: false}
                                        )
                                    })
                                    .catch((err)=>{
                                        console.log(err)
                                    })
                                })
                                .catch((err)=>{
                                    console.log(err)
                                })
                            }}>
                            {
                                (props)=>
                                <View>
                                    <Text style={[styles.textCapitalize, styles.textMV]}>realestate type : {whatProperty.item.realestatetype}</Text>
                                    <Text style={[styles.textCapitalize, styles.textMV]}>type : {whatProperty.item.type}</Text>
                                    <View style={{flexDirection: "row"}}>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>owner</Text>
                                        <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.ownername && props.errors.ownername}</Text>
                                    </View>
                                    <TextInput value={props.values.ownername} placeholder="owner name" 
                                        style={styles.textInput} 
                                        onChangeText={props.handleChange("ownername")}
                                        onBlur={props.handleBlur("ownername")} />
                                    <View style={{flexDirection: "row"}}>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>location</Text>
                                        <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.location && props.errors.location}</Text>
                                    </View>
                                    <TextInput value={props.values.location} placeholder="location" 
                                        style={styles.textInput} 
                                        onChangeText={props.handleChange("location")}
                                        onBlur={props.handleBlur("location")} />
                                    <View style={{flexDirection: "row"}}>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>downpayment</Text>
                                        <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.downpayment && props.errors.downpayment}</Text>
                                    </View>
                                    <TextInput value={props.values.downpayment} placeholder="downpayment" 
                                        style={styles.textInput} 
                                        onChangeText={props.handleChange("downpayment")}
                                        onBlur={props.handleBlur("downpayment")}
                                        keyboardType="numeric" />
                                    <View style={{flexDirection: "row"}}>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>installmentpaid</Text>
                                        <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.installmentpaid && props.errors.installmentpaid}</Text>
                                    </View>
                                    <TextInput value={props.values.installmentpaid} placeholder="installmentpaid" 
                                        style={styles.textInput}
                                        onChangeText={props.handleChange("installmentpaid")}
                                        onBlur={props.handleBlur("installmentpaid")}
                                        keyboardType="numeric" />
                                    <View style={{flexDirection: "row"}}>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>installmentduration</Text>
                                        <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.installmentduration && props.errors.installmentduration}</Text>
                                    </View>
                                    <TextInput value={props.values.installmentduration} placeholder="installmentduration" 
                                        style={styles.textInput}
                                        onChangeText={props.handleChange("installmentduration")}
                                        onBlur={props.handleBlur("installmentduration")} />
                                    <View style={{flexDirection: "row"}}>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>delinquent</Text>
                                        <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.delinquent && props.errors.delinquent}</Text>
                                    </View>
                                    <TextInput value={props.values.delinquent} placeholder="delinquent" 
                                        style={styles.textInput}
                                        onChangeText={props.handleChange("delinquent")}
                                        onBlur={props.handleBlur("delinquent")} />
                                    <Text style={[styles.textCapitalize, styles.textMV]}>developer (optional)</Text>
                                    <TextInput value={props.values.developer} placeholder="developer" 
                                        style={styles.textInput}
                                        onChangeText={props.handleChange("developer")} />
                                    <View style={{flexDirection: "row"}}>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>description</Text>
                                        <Text style={{marginHorizontal: 20, marginTop: 5}}>{props.touched.description && props.errors.description}</Text>
                                    </View>
                                    <TextInput value={props.values.description} placeholder="description" 
                                        style={styles.textInput}
                                        onChangeText={props.handleChange("description")}
                                        onBlur={props.handleBlur("description")} />
                                    <View>
                                        <TouchableOpacity style={styles.saveUpdateTO}
                                            onPress={props.handleSubmit}>
                                            <Text style={[styles.textCapitalize, styles.textCenter,
                                                {fontSize: 16}]}>save update</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }
                        </Formik>
                    </View>
                </View>
                )
            }
        </View>
        </ScrollView>
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
    textCapitalize: {
        textTransform: "capitalize"
    },
    textCenter: {
        textAlign: "center"
    },
    textMV: {
        marginVertical: 5
    },
    textInput: {
        backgroundColor: "#ccc",
        borderRadius: 3,
        paddingLeft: 10
    },
    saveUpdateTO: {
        backgroundColor: "#ff7f50",
        padding: 10,
        borderRadius: 3,
        marginVertical: 5
    }
})

export default EditProperties