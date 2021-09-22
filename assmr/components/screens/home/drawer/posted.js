import * as React from 'react'
import { View, Text, FlatList, Image, StyleSheet, 
    TouchableOpacity, AsyncStorage,
    Picker, Modal, Alert, TextInput, ScrollView, TouchableWithoutFeedback, Button } from 'react-native'
import axios from 'axios'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Context } from '../../../../hooks/context'
import { IMAGES } from '../../../../assets/assets'
import * as ImagePicker from 'react-native-image-picker';
// import ImagePicker from 'react-native-image-crop-picker';
import Loading from '../../loading/loading'

const AddVehicleView = ({ userid })=>{
    const vehicleSchema = yup.object().shape({
        owner: yup.string().min(3, "Too short").required("Required"),
        brand: yup.string().min(3, "Too short").required("Required"),
        model: yup.string().min(3, "Too short").required("Required"),
        location: yup.string().min(3, "Too short").required("Required"),
        downpayment: yup.string().min(3, "Too short").required("Required"),
        installmentpaid: yup.string().min(3, "Too short").required("Required"),
        installmentduration: yup.string().min(3, "Too short").required("Required"),
        delinquent: yup.string().min(3, "Too short").required("Required"),
    })
    const retrieveAsyncStorage = async()=>{
        return await AsyncStorage.getItem("serverIp")
    }
    const [vehilceImagesToUpload, setVehicleImagesToUpload] = React.useState(null)
    const vehicleAddImage = async()=>{
        const options = {
            selectionLimit: 0,
            mediaType: "photo"
        }
        ImagePicker.launchImageLibrary(options, (response)=>{
            if (response.didCancel)
                console.log('userCancelled')
            else if (response.assets.length > 5 && response.assets.length < 7)
                setVehicleImagesToUpload(response.assets)
            else{
                setVehicleImagesToUpload(response.assets)
                Alert.alert(
                    'Oops',
                    `Please select at least 6 images, picked images ${response.assets.length}`
                )
            }
        })
    }
    
    return(
        <ScrollView>
            <View>
                <View>
                    <Formik initialValues={{owner: "", brand: "", model: "", location: "",
                        downpayment: "", installmentpaid: "", installmentduration: "", delinquent: "",
                        description: ""}}
                        validationSchema={vehicleSchema}
                        onSubmit={(values, { resetForm })=>{
                            retrieveAsyncStorage()
                                .then((serverIp)=>{
                                    if (vehilceImagesToUpload === null)
                                        Alert.alert(
                                            'Message',
                                            'Kindly select vehicle images '
                                        )
                                    else if (vehilceImagesToUpload.length > 5 && vehilceImagesToUpload.length < 7){
                                        var form = new FormData()
                                        form.append("userid", userid)
                                        form.append("serverIp", serverIp)
                                        form.append("propertytype", "vehicle")
                                        for (var v in values){
                                            form.append(v, values[v])
                                        }

                                        for (var vITP in vehilceImagesToUpload){
                                            form.append(`image`, {
                                                uri: vehilceImagesToUpload[vITP].uri,
                                                type: vehilceImagesToUpload[vITP].type,
                                                name: vehilceImagesToUpload[vITP].fileName
                                            })
                                        }

                                        axios({
                                            method: "POST",
                                            url: `http://${serverIp}:1010/posted-property/user-post-new-property`,
                                            data: form,
                                            headers: {
                                                "Accept": "application/json",
                                                "Content-Type": "multipart/json"
                                            }
                                        })
                                        .then((response)=>{
                                            Alert.alert(
                                                'Message',
                                                response.data.response
                                            )
                                            resetForm()
                                            setVehicleImagesToUpload(null)
                                        })
                                        .catch((err)=>{
                                            console.log(err)
                                        })
                                    }//end if
                                    else
                                        Alert.alert(
                                            'Oops',
                                            `Please select at least 6 images, picked images ${vehilceImagesToUpload.length}`
                                        )
                                })
                                .catch((err)=>{
                                    console.log(err)
                                })
                            
                        }}>
                        {
                            (props)=>
                            <View style={{flex: 1, flexDirection: "column",
                                backgroundColor: "#ff8c00", padding: 5}}>
                                <View style={{flexDirection: "row"}}>
                                    <Text style={[styles.textCapitalize, styles.textMV]}>owner</Text>
                                    <Text style={[styles.textError, {marginHorizontal: 20, marginTop: 5}]}>{props.touched.owner && props.errors.owner}</Text>
                                </View>
                                <TextInput value={props.values.owner} placeholder="owner"
                                    style={styles.textInput}
                                    onChangeText={props.handleChange("owner")}
                                    onBlur={props.handleBlur("owner")} />
                                <View style={{flexDirection: "row"}}>
                                    <Text style={[styles.textCapitalize, styles.textMV]}>brand</Text>
                                    <Text style={[styles.textError, {marginHorizontal: 20, marginTop: 5}]}>{props.touched.brand && props.errors.brand}</Text>
                                </View>
                                <TextInput value={props.values.brand} placeholder="brand"
                                    style={styles.textInput}
                                    onChangeText={props.handleChange("brand")}
                                    onBlur={props.handleBlur("brand")} />
                                <View style={{flexDirection: "row"}}>
                                    <Text style={[styles.textCapitalize, styles.textMV]}>model</Text>
                                    <Text style={[styles.textError, {marginHorizontal: 20, marginTop: 5}]}>{props.touched.model && props.errors.model}</Text>
                                </View>
                                <TextInput value={props.values.model} placeholder="model"
                                    style={styles.textInput}
                                    onChangeText={props.handleChange("model")}
                                    onBlur={props.handleBlur("model")} />
                                <View style={{flexDirection: "row"}}>
                                    <Text style={[styles.textCapitalize, styles.textMV]}>location</Text>
                                    <Text style={[styles.textError, {marginHorizontal: 20, marginTop: 5}]}>{props.touched.location && props.errors.location}</Text>
                                </View>
                                <TextInput value={props.values.location} placeholder="location" 
                                    style={styles.textInput}
                                    onChangeText={props.handleChange("location")}
                                    onBlur={props.handleBlur("location")} />
                                <View style={{flexDirection: "row"}}>
                                    <Text style={[styles.textCapitalize, styles.textMV]}>downpayment</Text>
                                    <Text style={[styles.textError, {marginHorizontal: 20, marginTop: 5}]}>{props.touched.downpayment && props.errors.downpayment}</Text>
                                </View>
                                <TextInput value={props.values.downpayment} placeholder="downpayment"
                                    style={styles.textInput}
                                    onChangeText={props.handleChange("downpayment")}
                                    onBlur={props.handleBlur("downpayment")} />
                                <View style={{flexDirection: "row"}}>
                                    <Text style={[styles.textCapitalize, styles.textMV]}>installmentpaid</Text>
                                    <Text style={[styles.textError, {marginHorizontal: 20, marginTop: 5}]}>{props.touched.installmentpaid && props.errors.installmentpaid}</Text>
                                </View>
                                <TextInput value={props.values.installmentpaid} placeholder="installmentpaid"
                                    style={styles.textInput}
                                    onChangeText={props.handleChange("installmentpaid")}
                                    onBlur={props.handleBlur("installmentpaid")} />
                                <View style={{flexDirection: "row"}}>
                                    <Text style={[styles.textCapitalize, styles.textMV]}>installmentduration</Text>
                                    <Text style={[styles.textError, {marginHorizontal: 20, marginTop: 5}]}>{props.touched.installmentduration && props.errors.installmentduration}</Text>
                                </View>
                                <TextInput value={props.values.installmentduration} placeholder="installmentduration"
                                    style={styles.textInput}
                                    onChangeText={props.handleChange("installmentduration")}
                                    onBlur={props.handleBlur("installmentduration")} />
                                <View style={{flexDirection: "row"}}>
                                    <Text style={[styles.textCapitalize, styles.textMV]}>delinquent</Text>
                                    <Text style={[styles.textError, {marginHorizontal: 20, marginTop: 5}]}>{props.touched.delinquent && props.errors.delinquent}</Text>
                                </View>
                                <TextInput value={props.values.delinquent} placeholder="delinquent" 
                                    style={styles.textInput}
                                    onChangeText={props.handleChange("delinquent")}
                                    onBlur={props.handleBlur("delinquent")} />
                                <View style={{flexDirection: "row"}}>
                                    <Text style={[styles.textCapitalize, styles.textMV]}>add some property description</Text>
                                    <Text style={[styles.textError, {marginHorizontal: 20, marginTop: 5}]}>{props.touched.description && props.errors.description}</Text>
                                </View>
                                <TextInput value={props.values.description} 
                                    placeholder="description..." style={styles.textInput}
                                    onChangeText={props.handleChange("description")}
                                    onBlur={props.handleBlur("description")} />
                                <View>
                                    {
                                        (vehilceImagesToUpload)?
                                        <Text>{vehilceImagesToUpload.length} images added</Text>
                                        :
                                        <Text>0 images added!</Text>
                                    }
                                    <TouchableOpacity style={styles.addImageButton}
                                        onPress={()=> vehicleAddImage()}>
                                        <Text style={[styles.textCapitalize, 
                                            {textAlign: "center", fontSize: 16,
                                            color: "#fff"}]}>add image</Text>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <TouchableOpacity style={styles.submitButton}
                                        onPress={props.handleSubmit}>
                                        <Text style={[styles.textCapitalize, 
                                            {textAlign: "center", color: "#fff", fontSize: 16}]}>
                                                submit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.resetButton}
                                        onPress={props.handleReset}>
                                        <Text style={[styles.textCapitalize, 
                                            {textAlign: "center", fontSize: 16}]}>reset</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{height: 265}}>
                                    
                                </View>
                            </View>
                        }
                    </Formik>
                </View>
            </View>
        </ScrollView>
    )
}
const House = ({ userid })=>{
    const [houseImagesToUpload, setHouseImagesToUpload] = React.useState(null)
    const houseScheme = yup.object().shape({
        ownername: yup.string().min(3, "Too short").required("Required"),
        location: yup.string().min(3, "Too short").required("Required"),
        downpayment: yup.string().min(3, "Too short").required("Required"),
        installmentpaid: yup.string().min(3, "Too short").required("Required"),
        installmentduration: yup.string().min(3, "Too short").required("Required"),
        delinquent: yup.string().min(3, "Too short").required("Required"),
    })
    const retrieveAsyncStorage = async()=>{
        return await AsyncStorage.getItem("serverIp")
    }
    const houseAddImage = ()=>{
        const options = {
            selectionLimit: 0,
            mediaType: "photo"
        }
        ImagePicker.launchImageLibrary(options, (response)=>{
            if (response.didCancel)
                console.log('userCancel')
            else if (response.assets.length > 4 && response.assets.length < 6)
                setHouseImagesToUpload(response.assets)
            else{
                setHouseImagesToUpload(response.assets)
                Alert.alert(
                    'Oops',
                    `Please select at least 5 images, picked images ${response.assets.length}`
                )
            }
        })
    }
    return(
        <ScrollView>
            <Formik initialValues={{ownername: "", type: "residential", developer: "",
                location: "", downpayment: "", installmentpaid: "", installmentduration: "",
                delinquent: "", description: ""}}
                validationSchema={houseScheme}
                onSubmit={(values, { resetForm })=>{
                    retrieveAsyncStorage()
                        .then((serverIp)=>{
                            if (houseImagesToUpload === null)
                                Alert.alert(
                                    'Message',
                                    'Kindly select house images'
                                )
                            else if (houseImagesToUpload.length > 4 && houseImagesToUpload.length < 6){
                                var form = new FormData()
                                form.append("userid", userid)
                                form.append("serverIp", serverIp)
                                form.append("propertytype", "realestate")
                                form.append("realestatetype", "house")
                                for (var v in values){
                                    form.append(v, values[v])
                                }
                                for (var hITP in houseImagesToUpload){
                                    form.append("image", {
                                        uri: houseImagesToUpload[hITP].uri,
                                        type: houseImagesToUpload[hITP].type,
                                        name: houseImagesToUpload[hITP].fileName
                                    })
                                }
                            }
                            else
                                Alert.alert(
                                    'Oops',
                                    `Please select at least 6 images, picked images ${houseImagesToUpload.length}`
                                )
                            
                            axios({
                                method: "POST",
                                url: `http://${serverIp}:1010/posted-property/user-post-new-property`,
                                data: form,
                                headers: {
                                    "Accept": "application/json",
                                    "Content-Type": "multipart/form-data"
                                }
                            })
                            .then((response)=>{
                                Alert.alert(
                                    'Message',
                                    response.data.response
                                )
                                resetForm()
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
                        <View>
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>owner</Text>
                                <Text style={styles.textError}>{props.touched.ownername && props.errors.ownername}</Text>
                            </View>
                            <TextInput value={props.values.ownername}
                                style={styles.textInput} placeholder="owner"
                                onChangeText={props.handleChange("ownername")}
                                onBlur={props.handleBlur("ownername")} />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>realestate type</Text>
                                <Text style={styles.textError}>{props.touched.type && props.errors.type}</Text>
                            </View>
                            <View style={{backgroundColor: "teal"}}>
                                <Picker selectedValue={props.values.type}
                                    onValueChange={props.handleChange("type")}>
                                    <Picker.Item label="Residential" value="residential"/>
                                    <Picker.Item label="Commercial" value="commercial"/>
                                    <Picker.Item label="Industrial" value="industrial"/>
                                </Picker>
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>developer (optional)</Text>
                                <Text style={styles.textError}>{props.touched.developer && props.errors.developer}</Text>
                            </View>
                            <TextInput value={props.values.developer}
                                style={styles.textInput} placeholder="developer"
                                onChangeText={props.handleChange("developer")}
                                onBlur={props.handleBlur("developer")} />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>location</Text>
                                <Text style={styles.textError}>{props.touched.location && props.errors.location}</Text>
                            </View>
                            <TextInput value={props.values.location}
                                style={styles.textInput}
                                onChangeText={props.handleChange("location")}
                                onBlur={props.handleBlur("location")}
                                placeholder="location" />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>downpayment</Text>
                                <Text style={styles.textError}>{props.touched.downpayment && props.errors.downpayment}</Text>
                            </View>
                            <TextInput value={props.values.downpayment}
                                style={styles.textInput}
                                onBlur={props.handleBlur("downpayment")}
                                onChangeText={props.handleChange("downpayment")}
                                placeholder="downpayment" />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>installmentpaid</Text>
                                <Text style={styles.textError}>{props.touched.installmentpaid && props.errors.installmentpaid}</Text>
                            </View>
                            <TextInput value={props.values.installmentpaid}
                                style={styles.textInput}
                                onChangeText={props.handleChange("installmentpaid")}
                                onBlur={props.handleBlur("installmentpaid")} 
                                placeholder="installmentpaid" />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>installmentduration</Text>
                                <Text style={styles.textError}>{props.touched.installmentduration && props.errors.installmentduration}</Text>
                            </View>
                            <TextInput value={props.values.installmentduration}
                                style={styles.textInput}
                                onChangeText={props.handleChange("installmentduration")}
                                onBlur={props.handleBlur("installmentduration")}
                                placeholder="installmentduration" />
                           <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>delinquent</Text>
                                <Text style={styles.textError}>{props.touched.delinquent && props.errors.delinquent}</Text>
                            </View>
                            <TextInput values={props.values.delinquent}
                                style={styles.textInput}
                                onChangeText={props.handleChange("delinquent")}
                                onBlur={props.handleBlur("delinquent")}
                                placeholder="delinquent" />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>description</Text>
                                <Text style={styles.textError}>{props.touched.description && props.errors.description}</Text>
                            </View>
                            <TextInput value={props.values.description}
                                style={styles.textInput}
                                onChangeText={props.handleChange("description")}
                                onBlur={props.handleBlur("description")}
                                placeholder="description" />
                        </View>
                        <View>
                            {
                                (houseImagesToUpload)?
                                <Text>{houseImagesToUpload.length} images added!</Text>
                                :
                                <Text>0 images added!</Text>
                            }
                            <TouchableOpacity style={styles.addImageButton}
                                onPress={()=> houseAddImage()}>
                                <Text style={[styles.textCapitalize, {textAlign: "center",
                                    color: "#fff", fontSize: 16}]}>add image</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.submitButton}
                                onPress={props.handleSubmit}>
                                <Text style={[styles.textCapitalize, {textAlign: "center",
                                    color: "#fff", fontSize: 16}]}>submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.resetButton}
                                onPress={props.handleReset}>
                                <Text style={[styles.textCapitalize, {textAlign: "center",
                                    fontSize: 16}]}>reset</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{height: 40}}>

                        </View>
                    </View>
                }
            </Formik>
        </ScrollView>
    )
}
const Lot = ({ userid })=>{
    const [lotImagesToUpload, setLotImagesToUpload] = React.useState(null)
    const lotScheme = yup.object().shape({
        ownername: yup.string().min(3, "Too short").required("Required"),
        location: yup.string().min(3, "Too short").required("Required"),
        downpayment: yup.string().min(3, "Too short").required("Required"),
        installmentpaid: yup.string().min(3, "Too short").required("Required"),
        installmentduration: yup.string().min(3, "Too short").required("Required"),
        delinquent: yup.string().min(3, "Too short").required("Required")
    })
    const retrieveAsyncStorage = async()=>{
        return await AsyncStorage.getItem("serverIp")
    }
    const lotAddImage = ()=>{
        const options = {
            selectionLimit: 0,
            mediaType: "photo"
        }
        ImagePicker.launchImageLibrary(options, (response)=>{
            if (response.didCancel)
                console.length("userCancel")
            else if (response.assets.length > 3 && response.assets.length < 5){
                setLotImagesToUpload(response.assets)
            }
            else{
                setLotImagesToUpload(response.assets)
                Alert.alert(
                    'Oops',
                    `Please select at least 4 images, picked images ${response.assets.length}`
                )
            }
        })
    }
    return(
        <ScrollView>
            <Formik initialValues={{ownername: "", developer: "", location: "",
                downpayment: "", installmentpaid: "", installmentduration: "", delinquent: "",
                description: ""}}
                validationSchema={lotScheme}
                onSubmit={(values, { resetForm })=>{
                    retrieveAsyncStorage()
                        .then((serverIp)=>{
                            if (lotImagesToUpload === null)
                                Alert.alert(
                                    'Message',
                                    'Kindly select lot images'
                                )
                            else if (lotImagesToUpload.length > 3 && lotImagesToUpload.length < 5){
                                var form = new FormData()
                                form.append("userid", userid)
                                form.append("serverIp", serverIp)
                                form.append("propertytype", "realestate")
                                form.append("realestatetype", "lot")
                                form.append("type", "land")

                                for (var v in values){
                                    form.append(v, values[v])
                                }
                                for(var lITP in lotImagesToUpload){
                                    form.append("image", {
                                        uri: lotImagesToUpload[lITP].uri,
                                        type: lotImagesToUpload[lITP].type,
                                        name: lotImagesToUpload[lITP].fileName,
                                    })
                                }

                                axios({
                                    method: "POST",
                                    url: `http://${serverIp}:1010/posted-property/user-post-new-property`,
                                    data: form,
                                    headers: {
                                        "Accept": "application/json",
                                        "Content-Type": "multipart/form-data"
                                    }
                                })
                                .then((response)=>{
                                    Alert.alert(
                                        'Message',
                                        response.data.response
                                    )
                                    resetForm()
                                })
                                .catch((err)=>{
                                    console.log(err)
                                })
                            }
                            else
                                Alert.alert(
                                    'Oops',
                                    `Please select at least 4 images, picked images ${lotImagesToUpload.length}`
                                )
                        })
                        .catch((err)=>{
                            console.log(err)
                        })
                }}>
                {
                    (props)=>
                    <View>
                        <View>
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>owner</Text>
                                <Text style={styles.textError}>{props.touched.ownername && props.errors.ownername}</Text>
                            </View>
                            <TextInput value={props.values.ownername}
                                onBlur={props.handleBlur("ownername")}
                                onChangeText={props.handleChange("ownername")}
                                style={styles.textInput} placeholder="owner" />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>developer (optional)</Text>
                            </View>
                            <TextInput value={props.values.developer}
                                onChangeText={props.handleChange("developer")}
                                style={styles.textInput} placeholder="developer" />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>location</Text>
                                <Text style={styles.textError}>{props.touched.location && props.errors.location}</Text>
                            </View>
                            <TextInput value={props.values.location}
                                onChangeText={props.handleChange("location")}
                                onBlur={props.handleBlur("location")}
                                style={styles.textInput} placeholder="location" />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>downpayment</Text>
                                <Text style={styles.textError}>{props.touched.downpayment && props.errors.downpayment}</Text>
                            </View>
                            <TextInput value={props.values.downpayment}
                                onChangeText={props.handleChange("downpayment")}
                                onBlur={props.handleBlur("downpayment")}
                                style={styles.textInput} placeholder="downpayment" />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>installmentpaid</Text>
                                <Text style={styles.textError}>{props.touched.installmentpaid && props.errors.installmentpaid}</Text>
                            </View>
                            <TextInput value={props.values.installmentpaid}
                                onChangeText={props.handleChange("installmentpaid")}
                                onBlur={props.handleBlur("installmentpaid")}
                                style={styles.textInput} placeholder="installmentpaid" />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>installmentduration</Text>
                                <Text style={styles.textError}>{props.touched.installmentduration && props.errors.installmentduration}</Text>
                            </View>
                            <TextInput value={props.values.installmentduration}
                                onChangeText={props.handleChange("installmentduration")}
                                onBlur={props.handleBlur("installmentduration")}
                                style={styles.textInput} placeholder="installmentduration" />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>delinquent</Text>
                                <Text style={styles.textError}>{props.touched.delinquent && props.errors.delinquent}</Text>
                            </View>
                            <TextInput value={props.values.delinquent}
                                onChangeText={props.handleChange("delinquent")}
                                onBlur={props.handleBlur("delinquent")}
                                style={styles.textInput} placeholder="delinquent" />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>description</Text>
                                <Text style={styles.textError}>{props.touched.description && props.errors.description}</Text>
                            </View>
                            <TextInput value={props.values.description}
                                onChangeText={props.handleChange("description")}
                                style={styles.textInput} placeholder="description" />
                        </View>
                        <View>
                            {
                                (lotImagesToUpload)?
                                <Text>{lotImagesToUpload.length} images added!</Text>
                                :
                                <Text>0 images added!</Text>
                            }
                            <TouchableOpacity style={styles.addImageButton}
                                onPress={()=> lotAddImage()}>
                                <Text style={[styles.textCapitalize, {textAlign: "center",
                                    color: "#fff", fontSize: 16}]}>add image</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.submitButton}
                                onPress={props.handleSubmit}>
                                <Text style={[styles.textCapitalize, {textAlign: "center",
                                    color: "#fff", fontSize: 16}]}>submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.resetButton}
                                onPress={props.handleReset}>
                                <Text style={[styles.textCapitalize, {textAlign: "center",
                                    fontSize: 16}]}>reset</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{height: 40}}>

                        </View>
                    </View>
                }
            </Formik>
        </ScrollView>
    )
}
const HouseAndLot = ({ userid })=>{
    const [halImagesToUpload, setHalImagesToUpload] = React.useState(null)
    const halScheme = yup.object().shape({
        ownername: yup.string().min(3, "Too short").required("Required"),
        location: yup.string().min(3, "Too short").required("Required"),
        downpayment: yup.string().min(3, "Too short").required("Required"),
        installmentpaid: yup.string().min(3, "Too short").required("Required"),
        installmentduration: yup.string().min(3, "Too short").required("Required"),
        delinquent: yup.string().min(3, "Too short").required("Required")
    })
    const retrieveAsyncStorage = async()=>{
        return await AsyncStorage.getItem("serverIp")
    }
    const halAddImage = ()=>{
        const options = {
            selectionLimit: 0,
            mediaType: "photo"
        }
        ImagePicker.launchImageLibrary(options, (response)=>{
            if (response.didCancel)
                console.log("userCancel")
            else if (response.assets.length > 4 && response.assets.length < 6)
                setHalImagesToUpload(response.assets)
            else{
                setHalImagesToUpload(response.assets)
                Alert.alert(
                    'Oops',
                    `Please select at least 5 images, picked images ${response.assets.length}`
                )
            }
        })
    }
    return(
        <ScrollView>
            <Formik initialValues={{ownername: "", type: "residential", developer: "", location: "",
                downpayment: "", installmentpaid: "", installmentduration: "", delinquent: "", description: ""}}
                validationSchema={halScheme}
                onSubmit={(values, { resetForm })=>{
                    retrieveAsyncStorage()
                        .then((serverIp)=>{
                            if (halImagesToUpload === null)
                                Alert.alert(
                                    'Message',
                                    'Kindly select house and lot images'
                                )
                            else if (halImagesToUpload.length > 4 && halImagesToUpload.length < 6){
                                var form = new FormData()
                                form.append("userid", userid)
                                form.append("serverIp", serverIp)
                                form.append("propertytype", "realestate")
                                form.append("realestatetype", "houseandlot")
                                
                                for(var v in values){
                                    form.append(v, values[v])
                                }
                                for(var halITP in halImagesToUpload){
                                    form.append("image", {
                                        uri: halImagesToUpload[halITP].uri,
                                        type: halImagesToUpload[halITP].type,
                                        name: halImagesToUpload[halITP].fileName
                                    })
                                }

                                axios({
                                    method: "POST",
                                    url: `http://${serverIp}:1010/posted-property/user-post-new-property`,
                                    data: form,
                                    headers: {
                                        "Accept": "application/json",
                                        "Content-Type": "multipart/form-data"
                                    }
                                })
                                .then((response)=>{
                                    Alert.alert(
                                        'Message',
                                        response.data.response
                                    )
                                    resetForm()
                                })
                                .catch((err)=>{
                                    console.log(err)
                                })
                            }
                            else
                                Alert.alert(
                                    'Oops',
                                    `Please select at least 5 images, picked images ${lotImagesToUpload.length}`
                                )
                        })
                        .catch((err)=>{
                            console.log(err)
                        })
                }}>
                {
                    (props)=>
                    <View>
                        <View>
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>owner</Text>
                                <Text style={[styles.textError]}>{props.touched.ownername && props.errors.ownername}</Text>
                            </View>
                            <TextInput value={props.values.ownername}
                                onChangeText={props.handleChange("ownername")}
                                onBlur={props.handleBlur("ownername")}
                                style={styles.textInput} placeholder="owner" />
                            <View>
                                <Text style={styles.textCapitalize}>realestate type</Text>
                            </View>
                            <View style={{backgroundColor: "teal"}}>
                                <Picker selectedValue={props.values.type}
                                    onValueChange={props.handleChange("type")}>
                                    <Picker.Item label="Residential" value="residential" />
                                    <Picker.Item label="Commercial" value="commercial" />
                                    <Picker.Item label="Industrial" value="industrial" />
                                </Picker>
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <Text style={styles.textCapitalize}>developer (optional)</Text>
                            </View>
                            <TextInput value={props.values.developer}
                                onChangeText={props.handleChange("developer")}
                                style={styles.textInput} placeholder="developer" />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>location</Text>
                                <Text style={[styles.textError]}>{props.touched.location && props.errors.location}</Text>
                            </View>
                            <TextInput value={props.values.location}
                                onChangeText={props.handleChange("location")}
                                onBlur={props.handleBlur("location")}
                                style={styles.textInput} placeholder="location" />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>downpayment</Text>
                                <Text style={[styles.textError]}>{props.touched.downpayment && props.errors.downpayment}</Text>
                            </View>
                            <TextInput value={props.values.downpayment}
                                onChangeText={props.handleChange("downpayment")}
                                onBlur={props.handleBlur("downpayment")}
                                style={styles.textInput} placeholder="downpayment" />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>installmentpaid</Text>
                                <Text style={[styles.textError]}>{props.touched.installmentpaid && props.errors.installmentpaid}</Text>
                            </View>
                            <TextInput value={props.values.installmentpaid}
                                onChangeText={props.handleChange("installmentpaid")}
                                onBlur={props.handleBlur("installmentpaid")}
                                style={styles.textInput} placeholder="installmentpaid" />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>installmentduration</Text>
                                <Text style={[styles.textError]}>{props.touched.installmentduration && props.errors.installmentduration}</Text>
                            </View>
                            <TextInput value={props.values.installmentduration}
                                onChangeText={props.handleChange("installmentduration")}
                                onBlur={props.handleBlur("installmentduration")}
                                style={styles.textInput} placeholder="installmentduration" />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>delinquent</Text>
                                <Text style={[styles.textError]}>{props.touched.delinquent && props.errors.delinquent}</Text>
                            </View>
                            <TextInput value={props.values.delinquent}
                                onBlur={props.handleBlur("delinquent")}
                                onChangeText={props.handleChange("delinquent")}
                                style={styles.textInput} placeholder="delinquent" />
                            <View>
                                <Text style={styles.textCapitalize}>description</Text>
                            </View>
                            <TextInput style={styles.textInput} placeholder="description" />
                        </View>
                        <View>
                            {
                                (halImagesToUpload)?
                                <Text>{halImagesToUpload.length} images added!</Text>
                                :
                                <Text>0 images added!</Text>
                            }
                            <TouchableOpacity style={styles.addImageButton}
                                onPress={()=> halAddImage()}>
                                <Text style={[styles.textCapitalize, {textAlign: "center",
                                    color: "#fff", fontSize: 16}]}>add image</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.submitButton}
                                onPress={props.handleSubmit}>
                                <Text style={[styles.textCapitalize, {textAlign: "center",
                                    color: "#fff", fontSize: 16}]}>submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.resetButton}
                                onPress={props.handleReset}>
                                <Text style={[styles.textCapitalize, {textAlign: "center",
                                    fontSize: 16}]}>reset</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{height: 40}}>

                        </View>
                    </View>
                }
            </Formik>
        </ScrollView>
    )
}
const AddRealestate = ({ userid })=>{
    const [realestateType, setRealestateType] = React.useState('house')
    const [realestateModal, setRealestateModal] = React.useState(true)

    return(
        <View>
            <Text style={[styles.textCapitalize, {marginVertical: 3}]}>realestate type</Text>
            <View style={styles.card}>
                <Picker selectedValue={realestateType}
                    onValueChange={(value)=>{
                        setRealestateType(value)
                        setRealestateModal(!realestateModal)
                    }}>
                    <Picker.Item label="House" value="house" />
                    <Picker.Item label="Lot" value="lot" />
                    <Picker.Item label="House And Lot" value="houseandlot" />
                </Picker>
            </View>
            {
                (realestateModal &&
                    <Modal>
                        <View style={[styles.realestateCard, {backgroundColor: "#ff8c00"}]}>
                            <View style={{flexDirection: "row", alignSelf: "center"}}>
                                <Text style={[styles.textCapitalize, {fontSize: 16}]}>
                                    realestate - {realestateType}
                                </Text>
                                <TouchableOpacity 
                                    onPress={()=> setRealestateModal(!realestateModal)}>
                                    <Image source={IMAGES.close} resizeMode="contain" style={{width: 15, 
                                        height: 15, marginHorizontal: 10, marginTop: 3}} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{padding: 5}}>
                            {
                                (realestateType === "house" &&
                                    <House userid={userid} />
                                )
                            }
                            {
                                (realestateType === "lot" &&
                                    <Lot userid={userid} />
                                )
                            }
                            {
                                (realestateType === "houseandlot" &&
                                    <HouseAndLot userid={userid} />
                                )
                            }
                        </View>
                    </Modal>
                )
            }
            <Text style={[styles.textCapitalize, {textAlign: "center", 
                fontSize: 16, fontWeight: "bold"}, styles.textMV]}>
                default realestate type to add is house
            </Text>
        </View>
    )
}
const AddJewelry = ({ userid })=>{
    const [jewelryImagesToUpload, setJewelryImagesToUpload] = React.useState(null)
    const jewelrySchema = yup.object().shape({
        ownername: yup.string().min(3, "Too short").required("Required"),
        jewelryname: yup.string().min(3, "Too short").required("Required"),
        location: yup.string().min(3, "Too short").required("Required"),
        downpayment: yup.string().min(3, "Too short").required("Required"),
        installmentpaid: yup.string().min(3, "Too short").required("Required"),
        installmentduration: yup.string().min(3, "Too short").required("Required"),
        delinquent: yup.string().min(3, "Too short").required("Required")
    })
    const retrieveAsyncStorage = async()=>{
        return await AsyncStorage.getItem("serverIp")
    }
    const jewelryAddImage = ()=>{
        const options = {
            selectionLimit: 0,
            mediaType: "photo"
        }
        ImagePicker.launchImageLibrary(options, (response)=>{
            if (response.didCancel)
                console.log("userCancel")
            else if (response.assets.length > 3 && response.assets.length < 5)
                setJewelryImagesToUpload(response.assets)
            else
                Alert.alert(
                    'Oops',
                    `Please select at least 4 images, picked images ${response.assets.length}`
                )
        })
    }
    return(
        <ScrollView>
        <View>
            <View>
                <Formik initialValues={{ownername: "", jewelryname: "", location: "", downpayment: "",
                    installmentpaid: "", installmentduration: "", delinquent: "", description: ""}}
                    validationSchema={jewelrySchema}
                    onSubmit={(values, { resetForm })=>{
                        retrieveAsyncStorage()
                            .then((serverIp)=>{
                                if (jewelryImagesToUpload === null)
                                    Alert.alert(
                                        'Message',
                                        'Kindly select jewelry images'
                                    )
                                else if (jewelryImagesToUpload.length > 3 && jewelryImagesToUpload.length < 5){
                                    var form = new FormData()
                                    form.append("userid", userid.toString())
                                    form.append("serverIp", serverIp)
                                    form.append("propertytype", "jewelry")
                                    for (var j in values){
                                        form.append(j, values[j])
                                    }

                                    for (var jITP in jewelryImagesToUpload){
                                        form.append("image", {
                                            uri: jewelryImagesToUpload[jITP].uri,
                                            type: jewelryImagesToUpload[jITP].type,
                                            name: jewelryImagesToUpload[jITP].fileName
                                        })
                                    }
                                    axios({
                                        method: "POST",
                                        url: `http://${serverIp}:1010/posted-property/user-post-new-property`,
                                        data: form,
                                        headers: {
                                            "Accept": "application/json",
                                            "Content-Type": "multipart/form-data"
                                        }
                                    })
                                    .then((response)=>{
                                        Alert.alert(
                                            'Message',
                                            response.data.response
                                        )
                                        setJewelryImagesToUpload(null)
                                        resetForm()
                                    })
                                    .catch((err)=>{
                                        console.log(err)
                                    })
                                }
                                else
                                    Alert.alert(
                                        'Oops',
                                        `Please select at least 4 images, picked images ${jewelryImagesToUpload.length}`
                                    )
                            })
                            .catch((err)=>{
                                console.log(err)
                            })
                    }}>
                    {
                        (props)=>
                        <View style={{backgroundColor: "#ff8c00", padding: 5}}>
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>
                                    owner</Text>
                                <Text style={styles.textError}>{props.touched.ownername && props.errors.ownername}</Text>
                            </View>
                            <TextInput value={props.values.ownername} style={styles.textInput} 
                                placeholder="ownername" 
                                onChangeText={props.handleChange("ownername")}
                                onBlur={props.handleBlur("ownername")} />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>
                                    jewelryname</Text>
                                <Text style={styles.textError}>{props.touched.jewelryname && props.errors.jewelryname}</Text>
                            </View>
                            <TextInput value={props.values.jewelryname} 
                                style={styles.textInput} style={styles.textInput} 
                                placeholder="jewelry name"
                                onChangeText={props.handleChange("jewelryname")}
                                onBlur={props.handleBlur("jewelryname")} />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>
                                    location</Text>
                                <Text style={styles.textError}>{props.touched.location && props.errors.location}</Text>
                            </View>
                            <TextInput value={props.values.location} style={styles.textInput} 
                                placeholder="location"
                                onChangeText={props.handleChange("location")}
                                onBlur={props.handleBlur("location")} />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>
                                    downpayment</Text>
                                <Text style={styles.textError}>{props.touched.downpayment && props.errors.downpayment}</Text>
                            </View>
                            <TextInput value={props.values.downpayment} style={styles.textInput} 
                                placeholder="downpayment"
                                onChangeText={props.handleChange("downpayment")}
                                onBlur={props.handleBlur("downpayment")}
                                keyboardType="numeric" />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>
                                    installmentpaid</Text>
                                <Text style={styles.textError}>{props.touched.installmentpaid && props.errors.installmentpaid}</Text>
                            </View>
                            <TextInput value={props.values.installmentpaid} 
                                style={styles.textInput} placeholder="installmentpaid"
                                onChangeText={props.handleChange("installmentpaid")}
                                onBlur={props.handleBlur("installmentpaid")}
                                keyboardType="numeric" />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>
                                    installmentduration</Text>
                                <Text style={styles.textError}>{props.touched.installmentduration && props.errors.installmentduration}</Text>
                            </View>
                            <TextInput value={props.values.installmentduration} 
                                style={styles.textInput} placeholder="installmentduration"
                                onChangeText={props.handleChange("installmentduration")}
                                onBlur={props.handleBlur("installmentduration")} />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>
                                    delinquent</Text>
                                <Text style={styles.textError}>{props.touched.delinquent && props.errors.delinquent}</Text>
                            </View>
                            <TextInput value={props.values.delinquent} 
                                style={styles.textInput} placeholder="delinquent"
                                onChangeText={props.handleChange("delinquent")}
                                onBlur={props.handleBlur("delinquent")} />
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>
                                    add some property description</Text>
                                <Text style={styles.textError}>{props.touched.description && props.errors.description}</Text>
                            </View>
                            <TextInput value={props.values.description} style={styles.textInput}
                                multiline={true} placeholder="description"
                                onChangeText={props.handleChange("description")}
                                onBlur={props.handleBlur("description")} />
                            <View>
                                {
                                    (jewelryImagesToUpload)?
                                    <Text>{jewelryImagesToUpload.length} images added!</Text>
                                    :
                                    <Text>0 images added!</Text>
                                }
                                <TouchableOpacity style={styles.addImageButton}
                                    onPress={()=> jewelryAddImage()}>
                                    <Text style={[styles.textCapitalize, 
                                        {textAlign: "center", color: "#fff", fontSize: 16}]}>add image</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.submitButton}
                                    onPress={props.handleSubmit}>
                                    <Text style={[styles.textCapitalize, 
                                        {textAlign: "center", color: "#fff", fontSize: 16}]}>submit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.resetButton}
                                    onPress={props.handleReset}>
                                    <Text style={[styles.textCapitalize, 
                                        {textAlign: "center", fontSize: 16}]}>reset</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{height: 265}}>

                            </View>
                        </View>
                    }
                </Formik>
            </View>
        </View>
        </ScrollView>
    )
}
const Posted = ({ navigation })=>{
    const userCredentials = React.useContext(Context)
    const [totalPostedProperties, setTotalPostedProperties] = React.useState([])
    const [addPropertyModal, setAddPropertyModal] = React.useState(false)
    const [whatPropTypeToAdd, setWhatPropTypeToAdd] = React.useState('vehicle')
    const [loading, setLoading] = React.useState(true)
    const retrieveAsyncStorage = async()=>{
        return await AsyncStorage.getItem("serverIp")
    }
    React.useEffect(()=>{
        setTimeout(()=>{
            retrieveAsyncStorage()
            .then(async(serverIp)=>{
                const totalPostedProperties = await axios.post(`http://${serverIp}:1010/posted-property/user-posted-property`,
                    {userid: userCredentials.credentials.userid}
                )
                .then((response)=>{
                    return response.data.response
                })
                .catch((err)=>{
                    console.log(err)
                })
                setTotalPostedProperties(totalPostedProperties)
            })
            .catch((err)=>{
                console.log(err)
            })
            setLoading(!loading)
        }, 1000)
    }, [])
    return(
        
            (loading)?
            <Loading title="Please wait..." color="#ff8c10" />
            :
            (addPropertyModal)?
                <Modal>
                    <TouchableWithoutFeedback>
                    <View style={{padding: 5}}>
                        <View style={styles.card}>
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, {textAlign: "center"}]}>
                                    choose what property you want to post
                                </Text>
                                <TouchableOpacity style={{marginHorizontal: 15}}
                                    onPress={()=> {
                                        setAddPropertyModal(!addPropertyModal)
                                        setWhatPropTypeToAdd('vehicle')
                                    }}>
                                    <Image source={ IMAGES.close } style={{width: 15, height: 15,
                                    marginTop: 3}} resizeMode="contain" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <Text style={[styles.textCapitalize, {marginVertical: 3}]}>property type</Text>
                            <View style={{backgroundColor: "teal"}}>
                                <Picker selectedValue={whatPropTypeToAdd} 
                                    onValueChange={(propertype)=>
                                        setWhatPropTypeToAdd(propertype)
                                    }>
                                    <Picker.Item label="Vehicle" value="vehicle" />
                                    <Picker.Item label="Realestate" value="realestate" />
                                    <Picker.Item label="Jewelry" value="jewelry" />
                                </Picker>
                            </View>
                            {
                                (whatPropTypeToAdd === "vehicle" &&
                                    <AddVehicleView userid = {userCredentials.credentials.userid} />
                                )
                            }
                            {
                                (whatPropTypeToAdd === "realestate" &&
                                    <AddRealestate userid = {userCredentials.credentials.userid} />
                                )
                            }
                            {
                                (whatPropTypeToAdd === "jewelry" &&
                                    <AddJewelry userid = {userCredentials.credentials.userid} />
                                )
                            }
                        </View>
                    </View>
                    </TouchableWithoutFeedback>
                </Modal>
                :
                <View style={{padding: 5, backgroundColor: "#ff8c00", height: "100%"}}>
                    <View>
                        <Text style={{marginVertical: 10, fontSize: 15, textAlign: "center"}}>
                            Your posted properties will be shown here.    If there were any!
                        </Text>
                        {
                            (Object.keys(totalPostedProperties).length === 0 &&
                            <View>
                                <Text style={styles.textNoPostedProperties}>
                                    You have no posted properties currently!</Text>
                            </View>
                            )
                        }
                    </View>
                    <FlatList data={totalPostedProperties}
                        keyExtractor={(item)=> item.property_id}
                        renderItem={({ item })=>
                            <View key={item.property_id}>
                                <TouchableOpacity onPress={()=>{
                                    navigation.navigate("Posted Properties", item)
                                }}>
                                    <View style={styles.card}>
                                        <View style={{alignSelf: "center"}}>
                                            <Text style={styles.textTitle}>posted {item.property_type}</Text>
                                            <Text style={{textAlign: "center", fontSize: 30}}>{item.total_pType}</Text>
                                            <View style={styles.divider}></View>
                                            <Image source={IMAGES.folder} resizeMode="contain" 
                                                style={{width: 30, height: 30, alignSelf: "center"}} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                {/* item.property_type */}
                            </View>
                        } />
                    <TouchableOpacity style={styles.addButton} 
                        onPress={()=> setAddPropertyModal(!addPropertyModal)}>
                        <Image source={IMAGES.add} resizeMode="contain"
                            style={{width: 20, height: 20, alignSelf: "center"}} />
                    </TouchableOpacity>
                </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3,
        marginVertical: 5
    },
    textTitle: {
        textTransform: "capitalize",
        fontSize: 17
    },
    divider: {
        width: 50,
        height: 3,
        backgroundColor: "#ff7f50",
        alignSelf: "center",
        marginVertical: 3
    },
    addButton: {
        backgroundColor: "#e91e63",//e91e63
        width: 50,
        height: 50,
        borderRadius: 50,
        shadowColor: "#000",
        elevation: 3,
        shadowOffset: { width: 2, height: 5},
        padding: 10,
        alignSelf: "flex-end",
        justifyContent: "center",
        flexDirection: "column"
    },
    textCapitalize: {
        textTransform: "capitalize"
    },
    textMV: {
        marginVertical: 5
    },
    textInput:{
        backgroundColor: "#fff",
        paddingLeft: 10,
        borderRadius: 3
    },
    submitButton: {
        backgroundColor: "#5cb85c", //f2a71b
        padding: 10,
        borderRadius: 3,
        marginVertical: 5
    },
    resetButton: {
        backgroundColor: "#ccc",
        padding: 10,
        borderRadius: 3,
        marginVertical: 5
    },
    addImageButton: {
        backgroundColor: "#5218fa",
        padding: 10,
        borderRadius: 3,
        marginVertical: 5
    },
    realestateCard: {
        backgroundColor: "#fff",
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3,
        padding: 10
    },
    textNoPostedProperties: {
        fontSize: 25,
        marginTop: 50,
        fontWeight: "bold",
        textAlign: "center"
    },
    textError: {
        marginHorizontal: 20,
        marginTop: 5,
        color: "#ff471a"
    }
})

export default Posted