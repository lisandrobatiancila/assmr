import * as React from 'react'
import { View, Text, AsyncStorage, Button, StyleSheet, FlatList, 
    ScrollView } from 'react-native'
import { SliderBox } from 'react-native-image-slider-box'
import axios from 'axios'
import { Badge } from 'react-native-elements'
import Loading from '../../../loading/loading'

const TemporaryNotifications = (props)=>{
    const payLoads = props.route.params.payLoads.notifyProp
    const [isLoading, setIsLoading] = React.useState(true)
    const [refreshed, setRefreshed] = React.useState(false)//debug purposes
    const [jewelryImages, setJewelryImages] = React.useState(null)
    const [vehicleImages, setVehicleImages] = React.useState(null)
    const [lotImages, setLotImages] = React.useState(null)
    const [houseImages, setHouseImages] = React.useState(null)
    const [houseandlotImages, setHouseandLotImages] = React.useState(null)
    
    const [notificationLists, setNotificationLists] = React.useState([])

    const retrieveAsyncStorage = async()=>{
        const serverIp = await AsyncStorage.getItem("serverIp")
        const imagePort = await AsyncStorage.getItem("imagePort")

        return [serverIp, imagePort]
    }
    React.useEffect(()=>{
        setTimeout(()=>{
            retrieveAsyncStorage()
            .then((PORTS)=>{
                axios.post(`http://${PORTS[0]}:1010/posted-property/temporary-notifications`,
                    payLoads
                )
                .then((response)=>{
                    const results = response.data.response

                    for (var r in results){
                        if (results[r].propertyType === "jewelry"){
                            setJewelryImages([
                                `http://${PORTS[0]}:${PORTS[1]}${results[r].jewelry_firstimage}`,
                                `http://${PORTS[0]}:${PORTS[1]}${results[r].jewelry_secondimage}`,
                                `http://${PORTS[0]}:${PORTS[1]}${results[r].jewelry_thirdimage}`,
                                `http://${PORTS[0]}:${PORTS[1]}${results[r].jewelry_documentimage}`,
                            ])
                        }
                        else if (results[r].propertyType === "vehicle"){
                            setVehicleImages([
                                `http://${PORTS[0]}:${PORTS[1]}${results[r].vehicle_frontimage}`,
                                `http://${PORTS[0]}:${PORTS[1]}${results[r].vehicle_rightsideimage}`,
                                `http://${PORTS[0]}:${PORTS[1]}${results[r].vehicle_leftsideimage}`,
                                `http://${PORTS[0]}:${PORTS[1]}${results[r].vehicle_backimage}`,
                                `http://${PORTS[0]}:${PORTS[1]}${results[r].vehicle_orimage}`,
                                `http://${PORTS[0]}:${PORTS[1]}${results[r].vehicle_crimage}`
                            ])
                        }
                        else if (results[r].propertyType === "realestate"){
                            switch(results[r].realestateType){
                                case "house":
                                    setHouseImages([
                                        `http://${PORTS[0]}:${PORTS[1]}${results[r].house_frontimage}`,
                                        `http://${PORTS[0]}:${PORTS[1]}${results[r].house_rightsideimage}`,
                                        `http://${PORTS[0]}:${PORTS[1]}${results[r].house_leftsideimage}`,
                                        `http://${PORTS[0]}:${PORTS[1]}${results[r].house_backimage}`,
                                        `http://${PORTS[0]}:${PORTS[1]}${results[r].house_documentimage}`,
                                    ])
                                break;
                                case "lot":
                                    setLotImages([
                                        `http://${PORTS[0]}:${PORTS[1]}${results[r].lot_firstimage}`,
                                        `http://${PORTS[0]}:${PORTS[1]}${results[r].lot_secondimage}`,
                                        `http://${PORTS[0]}:${PORTS[1]}${results[r].lot_thirdimage}`,
                                        `http://${PORTS[0]}:${PORTS[1]}${results[r].lot_documentimage}`,
                                    ])
                                break;
                                case "houseandlot":
                                    setHouseandLotImages([
                                        `http://${PORTS[0]}:${PORTS[1]}${results[r].hal_frontimage}`,
                                        `http://${PORTS[0]}:${PORTS[1]}${results[r].hal_rightsideimage}`,
                                        `http://${PORTS[0]}:${PORTS[1]}${results[r].hal_leftsideimage}`,
                                        `http://${PORTS[0]}:${PORTS[1]}${results[r].hal_backsideimage}`,
                                        `http://${PORTS[0]}:${PORTS[1]}${results[r].hal_documentimage}`
                                    ])
                                break;
                                default:
                                    console.log('no realestateType...')
                            }
                        }
                    }
                    setNotificationLists(response.data.response)
                })
                .catch((err)=>{
                    console.log(`aP: ${err.message}`)
                })
            })
            .catch((err)=>{
                console.log(`rAS: ${err.message}`)
            })
            setIsLoading(false)
        }, 1000)
    },[refreshed])
    return(
        <View>
            {(isLoading)?
            <View style={{marginTop: 20}}>
                <Loading title="Please wait..." color="#ff8c00" />
            </View>
            :
            <View style={styles.container}>
                <Button title="reload" onPress={()=>{
                    setRefreshed(!refreshed)
                }} />
                <View style={styles.cardTitle}>
                    <Text style={[styles.textCapitalize, styles.textCenter, styles.textFontSize]}>
                        this is just a temporary notifications</Text>
                </View>
                <View style={{height: "80%"}}>
                <FlatList data={notificationLists}
                    keyExtractor={( item )=> item.property_id}
                    renderItem={({ item })=>
                        <View style={styles.cardItems} key={item.property_id}>
                            {(item.propertyType === "jewelry" &&
                                <View>
                                    <View>
                                        <SliderBox images={jewelryImages} dotColor="#ff54cc"
                                        inactiveDotColor="#000" />
                                    </View>
                                    <View>
                                        <View style={{flexDirection: "row", padding: 5, 
                                            backgroundColor: "#66cdaa"}}>
                                            <Text  style={[styles.textCapitalize, styles.textMV]}>total assumer : </Text>
                                            <Badge value={item.total_assumer} status="success" />
                                        </View>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>owner : {item.jewelry_owner}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>jewelryname : {item.jewelry_name}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>location : {item.jewelry_location}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>downpayment : {item.jewelry_downpayment}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>installmentpaid : {item.jewelry_installmentpaid}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>installmentduration : {item.jewelry_installmentduration}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>installmentdelinquent : {item.jewelry_delinquent}</Text>
                                    </View>
                                </View>
                            )}
                            {(item.propertyType === "vehicle" &&
                                <View key={item.property_id}>
                                    <View>
                                        <SliderBox images={vehicleImages} dotColor="#ff54cc"
                                        inactiveDotColor="#000" />
                                    </View>
                                    <View>
                                        <View style={{flexDirection: "row", backgroundColor: "#66cdaa",
                                            padding: 3}}>
                                            <Text style={[styles.textCapitalize, styles.textMV]}>total assumer : </Text>
                                            <Badge value={item.total_assumer} status="success" />
                                        </View>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>owner : {item.vehicle_owner}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>vehicle-name : {item.vehicle_name}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>model : {item.vehicle_model}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>location : {item.vehicle_location}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>downpayment : {item.vehicle_downpayment}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>installmentpaid : {item.vehicle_installmentpaid}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>installmentduration : {item.vehicle_installmentduration}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>installmentdelinquent : {item.vehicle_delinquent}</Text>
                                    </View>
                                </View>
                            )}
                            {(item.propertyType === "realestate" &&
                                <View key={item.property_id}>
                                    {(item.realestateType === "houseandlot" &&
                                        <SliderBox images={houseandlotImages} dotColor="#ff54cc"
                                        inactiveDotColor="#000" />
                                    )}
                                    {(item.realestateType === "house" &&
                                        <SliderBox images={houseImages} dotColor="#ff54cc"
                                        inactiveDotColor="#000" />
                                    )}
                                    {(item.realestateType === "lot" &&
                                        <SliderBox images={lotImages} dotColor="#ff54cc"
                                        inactiveDotColor="#000" />
                                    )}
                                    <View>
                                        <View style={{flexDirection: "row", backgroundColor: "#66cdaa",
                                            padding: 3}}>
                                            <Text style={[styles.textCapitalize, styles.textFontSize]}>
                                                total assumer : </Text>
                                            <Badge value={item.total_assumer} status="success" />
                                        </View>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>owner : {item.realestate_owner}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>propertytype : {item.propertyType}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>realestatetype : {item.type}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>location : {item.realestate_location}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>downpayment : {item.realestate_downpayment}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>installmentpaid : {item.realestate_installmentpaid}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>installmentduration : {item.realestate_installmentduration}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>installmentdelinquent : {item.realestate_installmentdelinquent}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}> developer : {item.developer}</Text>
                                    </View>
                                </View>
                            )}
                            <Button title="assume" color="#ff8c00" />
                                <View style={{marginVertical: 2}}></View>
                                <Button title="send message" onPress={()=>{
                                    const params = {
                                        messagesender: item.account_email,
                                        userimage: item.user_image
                                    }
                                    props.navigation.navigate("Messages", {
                                        screen: "Open Messages",
                                        initial: false,
                                        params: params
                                    })
                            }} color="#ff4da6" />
                        </View>
                    }
                />
                </View>
            </View>
            }
        </View>
    )
}

export default TemporaryNotifications

const styles = StyleSheet.create({
    container: {
        padding: 5
    },
    cardTitle: {
        padding: 10,
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3,
        marginVertical: 5
    },
    cardItems: {
        padding: 10,
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3,
        marginVertical: 3
    },
    textCapitalize: {
        textTransform: "capitalize",
    },
    textCenter: {
        textAlign: "center"
    },
    textFontSize: {
        fontSize: 15
    },
    textMV: {
        marginVertical: 3
    }
})