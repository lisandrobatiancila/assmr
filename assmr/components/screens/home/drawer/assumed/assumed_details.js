import * as React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, AsyncStorage, Alert } from 'react-native'
import { SliderBox } from 'react-native-image-slider-box'
import  axios from 'axios'

import { Context } from '../../../../../hooks/context'

const AssumedDetails = (props)=>{
    const userCredentials = React.useContext(Context)
    const [propertyDetails, setPropertyDetails] = React.useState(props.route.params)
    var propImages = []
    if (propertyDetails.item.propertyType === "jewelry"){
        propImages = [
            `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.jewelry_info[0].jewelry_firstimage}`,
            `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.jewelry_info[0].jewelry_secondimage}`,
            `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.jewelry_info[0].jewelry_thirdimage}`,
            `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.jewelry_info[0].jewelry_documentimage}`
        ]
    }
    else if (propertyDetails.item.propertyType === "vehicle"){
        propImages = [
            `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.vehicle_info[1].vehicle_frontimage}`,
            `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.vehicle_info[1].vehicle_rightsideimage}`,
            `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.vehicle_info[1].vehicle_leftsideimage}`,
            `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.vehicle_info[1].vehicle_backimage}`,
            `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.vehicle_info[1].vehicle_crimage}`,
            `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.vehicle_info[1].vehicle_orimage}`
        ]
    }
    else if (propertyDetails.item.propertyType === "realestate"){
        if (propertyDetails.item.realestateType === "house")
            propImages = [
                `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.realestate_info[1].house_frontimage}`,
                `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.realestate_info[1].house_rightsideimage}`,
                `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.realestate_info[1].house_leftsideimage}`,
                `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.realestate_info[1].house_backimage}`,
                `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.realestate_info[1].house_documentimage}`
            ]
        else if (propertyDetails.item.realestateType === "lot")
            propImages = [
                `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.realestate_info[1].lot_firstimage}`,
                `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.realestate_info[1].lot_secondimage}`,
                `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.realestate_info[1].lot_thirdimage}`,
                `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.realestate_info[1].lot_documentimage}`,
            ]
        else if (propertyDetails.item.realestateType === "houseandlot")
            propImages = [
                `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.realestate_info[1].hal_frontimage}`,
                `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.realestate_info[1].hal_rightsideimage}`,
                `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.realestate_info[1].hal_backsideimage}`,
                `http://${propertyDetails.PORTS[0]}:${propertyDetails.PORTS[1]}${propertyDetails.item.realestate_info[1].hal_documentimage}`,
            ]
    }
    const retrieveAsyncStorage = async()=>{
        return await AsyncStorage.getItem("serverIp")
    }
    const cancelAssumptions = (propertyType, assumer_id, item_id, triggerFrom)=>{
        Alert.alert(
            'Confirmation',
            'Are you sure you want to cancell your assumption?',
            [
                {text: "no"},
                {text: "yes", onPress: ()=>{
                    retrieveAsyncStorage()
                        .then((serverIp)=>{
                            const clientPayLoads = {
                                userID: userCredentials.credentials.userid,
                                assumerID: assumer_id,
                                itemID: item_id,
                                email: userCredentials.credentials.useremail,
                                propertyType: propertyType,
                                triggerFrom: triggerFrom
                            }
                            axios.post(`http://${serverIp}:1010/assumedproperty/user-cancell-assumption`,
                                clientPayLoads
                            )
                            .then((response)=>{
                                Alert.alert(
                                    'Message',
                                    response.data.response
                                )
                                props.navigation.navigate("Assumed")
                            })
                            .catch((err)=>{
                                console.log(err)
                            })
                        })
                        .catch((err)=>{
                            console.log(err)
                        })
                }}//end of onPress
            ],
            {cancelable: false}
        )
    }
    return(
        <ScrollView>
            <View style={{padding: 5}}>
                <View style={styles.card}>
                    {
                        (propertyDetails.item.propertyType === "jewelry" &&
                        <View>
                            <Text style={styles.textTitle}>{propertyDetails.item.propertyType}</Text>
                            <View style={styles.card}>
                                {/* <Text>{JSON.stringify(propertyDetails)}</Text> */}
                                <SliderBox images={propImages} dotColor="#ff54cc"
                                    inactiveDotColor="#000" />
                            </View>
                            <View>
                                <View style={{backgroundColor: (propertyDetails.item.propertyStatus === "Not assume")?"#ff944d":"#5cd65c",
                                    padding: 5}}>
                                    <Text style={[styles.textCapitalize, styles.MV3]}>
                                        status : {propertyDetails.item.propertyStatus}</Text>
                                </View>
                                <Text style={[styles.textCapitalize, styles.MV3]}>
                                    owner : {propertyDetails.item.jewelry_info[0].jewelry_owner}</Text>
                                <Text style={[styles.textCapitalize, styles.MV3]}>
                                    jewelry name : {propertyDetails.item.jewelry_info[0].jewelry_name}</Text>
                                <Text style={[styles.textCapitalize, styles.MV3]}>
                                    downpayment : {propertyDetails.item.jewelry_info[0].jewelry_downpayment}</Text>
                                <Text style={[styles.textCapitalize, styles.MV3]}>
                                    installmentpaid : {propertyDetails.item.jewelry_info[0].jewelry_installmentpaid}</Text>
                                <Text style={[styles.textCapitalize, styles.MV3]}>
                                    installmentduration : {propertyDetails.item.jewelry_info[0].jewelry_installmentduration}</Text>
                                <Text style={[styles.textCapitalize, styles.MV3]}>
                                    installmentdelinquent : {propertyDetails.item.jewelry_info[0].jewelry_delinquent}</Text>
                                <Text style={[styles.textCapitalize, styles.MV3]}>
                                    description : {propertyDetails.item.jewelry_info[0].jewelry_description}</Text>
                                <Text style={[styles.textCapitalize, styles.MV3]}>
                                    location : {propertyDetails.item.jewelry_info[0].jewelry_location}</Text>
                            </View>
                            <View>
                                <TouchableOpacity style={styles.cancelOP}
                                    onPress={()=>{
                                        cancelAssumptions(propertyDetails.item.propertyType, propertyDetails.item.assumer_id.assumer_id, 
                                            propertyDetails.item.jewelry_info[0].jewelry_id, "user")
                                    }}>
                                    <Text style={styles.cancelText}>
                                        cancel my assumptions</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        )
                    }
                    {
                        (propertyDetails.item.propertyType === "vehicle" &&
                        <View>
                            {/* <Text>{JSON.stringify(propertyDetails)}</Text> */}
                            <Text style={styles.textTitle}>{propertyDetails.item.propertyType}</Text>
                            <View style={styles.card}>
                                <SliderBox images={propImages} dotColor="#ff54cc"
                                    inactiveDotColor="#000" />
                            </View>
                            <View>
                                <View style={{backgroundColor: (propertyDetails.item.propertyStatus === "Not assume")?"#ff944d":"#5cd65c",
                                    padding: 5}}>
                                    <Text style={[styles.textCapitalize, styles.MV3]}>
                                        status : {propertyDetails.item.propertyStatus}</Text>
                                </View>
                                <Text style={[styles.textCapitalize, styles.MV3]}>
                                    owner : {propertyDetails.item.vehicle_info[0].vehicle_owner}</Text>
                                <Text style={[styles.textCapitalize, styles.MV3]}>
                                    name : {propertyDetails.item.vehicle_info[0].vehicle_name}</Text>
                                <Text style={[styles.textCapitalize, styles.MV3]}>
                                    model : {propertyDetails.item.vehicle_info[0].vehicle_model}</Text>
                                <Text style={[styles.textCapitalize, styles.MV3]}>
                                    downpayment : {propertyDetails.item.vehicle_info[0].vehicle_downpayment}</Text>
                                <Text style={[styles.textCapitalize, styles.MV3]}>
                                    installmentpaid : {propertyDetails.item.vehicle_info[0].vehicle_installmentpaid}</Text>
                                <Text style={[styles.textCapitalize, styles.MV3]}>
                                    installmentduration : {propertyDetails.item.vehicle_info[0].vehicle_installmentduration}</Text>
                                <Text style={[styles.textCapitalize, styles.MV3]}>
                                    installmentdelinquent : {propertyDetails.item.vehicle_info[0].vehicle_delinquent}</Text>
                                <Text style={[styles.textCapitalize, styles.MV3]}>
                                    description : {propertyDetails.item.vehicle_info[0].vehicle_description}</Text>
                            </View>
                            <View>
                                <TouchableOpacity style={styles.cancelOP}
                                    onPress={()=>{
                                        cancelAssumptions(propertyDetails.item.propertyType, propertyDetails.item.assumer_id.assumer_id, 
                                            propertyDetails.item.vehicle_info[0].vehicle_id, "user")
                                    }}>
                                    <Text style={styles.cancelText}>
                                        cancel assumptions</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        )
                    }
                    {
                        (propertyDetails.item.propertyType === "realestate" &&
                        <View>
                            <Text style={styles.textTitle}>{propertyDetails.item.realestateType}</Text>
                            {/* <Text>{JSON.stringify(propertyDetails.item.realestate_info[1])}</Text> */}
                            {/* <Text>{JSON.stringify(propImages)}</Text> */}
                            <View style={styles.card}>
                                <SliderBox images={propImages} dotColor="#ff54cc"
                                    inactiveDotColor="#000" />
                            </View>
                            {
                                (propertyDetails.item.realestateType === "house" &&
                                <View>
                                    <View>
                                        <View style={{backgroundColor: (propertyDetails.item.propertyStatus === "Not assume")?"#ff944d":"#5cd65c",
                                            padding: 5}}>
                                            <Text style={[styles.textCapitalize, styles.MV3]}>
                                                status : {propertyDetails.item.propertyStatus}</Text>
                                        </View>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            owner : {propertyDetails.item.realestate_info[0].realestate_owner}</Text>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            location : {propertyDetails.item.realestate_info[0].realestate_location}</Text>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            installmentpaid : {propertyDetails.item.realestate_info[0].realestate_installmentpaid}</Text>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            installmentduration : {propertyDetails.item.realestate_info[0].realestate_installmentduration}</Text>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            installmentdelinquent : {propertyDetails.item.realestate_info[0].realestate_installmentdelinquent}</Text>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            type : {propertyDetails.item.realestate_info[0].type}</Text>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            developer : {propertyDetails.item.realestate_info[1].house_developer}</Text>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            description : {propertyDetails.item.realestate_info[0].realestate_description}</Text>
                                    </View>
                                    <View>
                                        <TouchableOpacity style={styles.cancelOP}
                                            onPress={()=>{
                                                cancelAssumptions(propertyDetails.item.propertyType, propertyDetails.item.assumer_id.assumer_id, 
                                                    propertyDetails.item.realestate_info[0].realestate_id, "user")
                                            }}>
                                            <Text style={styles.cancelText}>
                                                cancel assumptions</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                )
                            }
                            {
                                (propertyDetails.item.realestateType === "lot" &&
                                <View>
                                    <View>
                                        <View style={{backgroundColor: (propertyDetails.item.propertyStatus === "Not assume")?"#ff944d":"#5cd65c",
                                            padding: 5}}>
                                            <Text style={[styles.textCapitalize, styles.MV3]}>
                                                status : {propertyDetails.item.propertyStatus}</Text>
                                        </View>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            owner : {propertyDetails.item.realestate_info[0].realestate_owner}</Text>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            location : {propertyDetails.item.realestate_info[0].realestate_location}</Text>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            installmentpaid : {propertyDetails.item.realestate_info[0].realestate_installmentpaid}</Text>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            installmentduration : {propertyDetails.item.realestate_info[0].realestate_installmentduration}</Text>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            installmentdelinquent : {propertyDetails.item.realestate_info[0].realestate_installmentdelinquent}</Text>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            type : {propertyDetails.item.realestate_info[0].type}</Text>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            developer : {propertyDetails.item.realestate_info[1].lot_developer}</Text>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            description : {propertyDetails.item.realestate_info[0].realestate_description}</Text>
                                    </View>
                                    <View>
                                        <TouchableOpacity style={styles.cancelOP}
                                            onPress={()=>{
                                                cancelAssumptions(propertyDetails.item.propertyType, propertyDetails.item.assumer_id.assumer_id, 
                                                    propertyDetails.item.realestate_info[0].realestate_id, "user")
                                            }}>
                                            <Text style={styles.cancelText}>
                                                cancel assumptions</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                )
                            }
                            {
                                (propertyDetails.item.realestateType === "houseandlot" &&
                                <View>
                                    <View>
                                        <View style={{backgroundColor: (propertyDetails.item.propertyStatus === "Not assume")?"#ff944d":"#5cd65c",
                                            padding: 5}}>
                                            <Text style={[styles.textCapitalize, styles.MV3]}>
                                                status : {propertyDetails.item.propertyStatus}</Text>
                                        </View>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            owner : {propertyDetails.item.realestate_info[0].realestate_owner}</Text>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            location : {propertyDetails.item.realestate_info[0].realestate_location}</Text>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            installmentpaid : {propertyDetails.item.realestate_info[0].realestate_installmentpaid}</Text>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            installmentduration : {propertyDetails.item.realestate_info[0].realestate_installmentduration}</Text>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            installmentdelinquent : {propertyDetails.item.realestate_info[0].realestate_installmentdelinquent}</Text>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            type : {propertyDetails.item.realestate_info[0].type}</Text>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            developer : {propertyDetails.item.realestate_info[1].hal_developer}</Text>
                                        <Text style={[styles.textCapitalize, styles.MV3]}>
                                            description : {propertyDetails.item.realestate_info[0].realestate_description}</Text>
                                    </View>
                                    <View>
                                        <TouchableOpacity style={styles.cancelOP}
                                            onPress={()=>{
                                                cancelAssumptions(propertyDetails.item.propertyType, propertyDetails.item.assumer_id.assumer_id, 
                                                    propertyDetails.item.realestate_info[0].realestate_id, "user")
                                            }}>
                                            <Text style={styles.cancelText}>
                                                cancel assumptions</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                )
                            }
                        </View>
                        )
                    }
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3,
        marginVertical: 5,
    },
    textCapitalize: {
        textTransform: "capitalize"
    },
    MV3: {
        marginVertical: 3
    },
    MV5: {
        marginVertical: 5
    },
    cancelOP: {
        padding: 10,
        borderRadius: 3,
        backgroundColor: "#ff3333"
    },
    cancelText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
        textTransform: "capitalize",
        marginVertical: 3
    },
    textTitle: {
        textTransform: "capitalize",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16
    }
})
export default AssumedDetails