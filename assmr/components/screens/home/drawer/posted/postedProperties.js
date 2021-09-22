import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, AsyncStorage, FlatList, 
    Image, TouchableOpacity, ScrollView, Alert, Modal, Button } from 'react-native'
import { Badge } from 'react-native-elements'
import axios from 'axios'
import { Context } from '../../../../../hooks/context'
import { IMAGES } from '../../../../../assets/assets'

const JewelryView = ({ viewInfo, navigation })=>{
    const userCredentials = useContext(Context)
    const [jewelryProperties, setJewelryProperties] = useState(null)
    const [ports, setPorts] = React.useState(null)

    const retrieveAsyncStorage = async()=>{
        const serverIp = await AsyncStorage.getItem("serverIp")
        const imageIp = await AsyncStorage.getItem("imagePort")
        
        return [serverIp, imageIp]
    }
    useEffect(()=>{
        retrieveAsyncStorage()
            .then((PORTS)=>{
                setPorts(PORTS)
                axios.post(`http://${PORTS[0]}:1010/posted-property/user-view-certain-property`,
                    {userid: userCredentials.credentials.userid, propertytype: viewInfo.property_type}
                )
                .then((response)=>{
                    setJewelryProperties(response.data.response)
                })
                .catch((err)=>{
                    console.log(err)
                })
            })
            .catch((err)=>{
                console.log(err)
            })
    }, [])
    const deleteJewelry = (jewelry)=>{
        Alert.alert(
            'Delete',
            'Are you sure you want to delete this',
            [
                {text: "cancel"},
                {text: "confirm", onPress: ()=>{
                    retrieveAsyncStorage()
                        .then((PORTS)=>{
                            axios.patch(`http://${PORTS[0]}:1010/posted-property/user-removed-property`,
                                {
                                    propertyid: jewelry.propertyid,
                                    useremail: userCredentials.credentials.useremail,
                                    itemid: jewelry.jewelryid,
                                    totalassumer: jewelry.totalassumer
                                }
                            )
                            .then((response)=>{
                                console.log(response.data.response)
                            })
                            .catch((err)=>{
                                console.log('aP: '+err.message)
                            })
                        })
                        .catch((err)=>{
                            console.log('rAS: '+err.message)
                        })
                }}
            ]
            ,
            {cancelable: false}
        )
    }
    
    return(
        <View style={{padding: 5}}>
            <FlatList data={jewelryProperties} 
                keyExtractor={(item)=> item.propertyid}
                ListHeaderComponent={
                    <View style={{flexDirection: "column"}}>
                        <View style={[styles.card, {flexDirection: "column"}, 
                            {backgroundColor: "#ff8c00"}]}>
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, {fontSize: 16}]}>
                                    current view : {viewInfo.property_type} - {viewInfo.total_pType}
                                </Text>
                            </View>
                        </View>
                    </View>
                }
                renderItem={({ item })=>
                    <View style={{padding: 5}}>
                        <View style={styles.card}>
                            <View style={styles.card}>
                                <Image source={{uri: `http://${ports[0]}:${ports[1]}${item.firstimage}`}} resizeMode="contain"
                                    style={{width: undefined, height: 200, }} resizeMode="stretch" />
                            </View>
                            <View>
                                <View style={{backgroundColor: "#66cdaa", padding: 5}}>
                                    <Text style={styles.textCapitalize}>
                                            property status : {item.propertystatus}
                                    </Text>
                                </View>
                                <View style={{flexDirection: "row"}}>
                                    <Text style={[styles.textCapitalize, styles.textmarginV]}>total assumer : </Text>
                                    <Badge value={item.totalassumer} status={
                                        parseInt(item.totalassumer) > 0?"success":"warning"
                                    }></Badge>
                                </View>
                                {/* <Text>{JSON.stringify(item)}</Text> */}
                                <Text style={[styles.textCapitalize, styles.textmarginV]}>jewelry name : {item.jewelryname}</Text>
                                <Text style={[styles.textCapitalize, styles.textmarginV]}>jewelry downpayment : {item.jewelrydownpayment}</Text>
                            </View>
                            <View>
                                    {(item.totalassumer > 0 &&
                                        <TouchableOpacity style={styles.showOp}
                                            onPress={()=> navigation.navigate("Assumers", {propID: item.propertyid, propType: item.propertytype, others: null})}>
                                            <View style={{flexDirection: "row", alignSelf: "center"}}>
                                                <Image source={IMAGES.eye} resizeMode="contain" style={{width: 20, height: 20}} />
                                                <Text  style={[styles.textCapitalize, styles.textCenter, {marginHorizontal: 5}]}>
                                                    show assumer's
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                <TouchableOpacity style={styles.editTO} 
                                    onPress={()=> 
                                        navigation.navigate("Edit Properties", {item, ports})    
                                    }>
                                    <View style={{flexDirection: "row", alignSelf: "center"}}>
                                        <Image source={IMAGES.edit} resizeMode="contain" 
                                            style={{width: 20, height: 20}} />
                                        <Text style={[styles.textCapitalize, styles.textCenter, {marginHorizontal: 5}]}>
                                            edit
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.deleteTO}
                                    onPress={()=> deleteJewelry(item)}>
                                    <View style={{flexDirection: "row", alignSelf: "center"}}>
                                        <Image source={IMAGES.trash_can} resizeMode="contain" 
                                            style={{width: 20, height: 20}} />
                                        <Text style={[styles.textCapitalize, styles.textCenter, {marginHorizontal: 5}]}>
                                            delete
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
            } />
        </View>
    )
}
const RealestateView = ({ viewInfo, navigation })=>{
    const userCredentials = useContext(Context)
    const [realestatesProperties, setRealestatesProperties] = useState(null)
    const [ports, setPorts] = React.useState(null)
    const retrieveAsyncStorage = async()=>{
        const serverIp = await AsyncStorage.getItem("serverIp")
        const imagePort = await AsyncStorage.getItem("imagePort")

        return [serverIp, imagePort]
    }
    useEffect(()=>{
        retrieveAsyncStorage()
            .then((PORTS)=>{
                setPorts(PORTS)
                axios.post(`http://${PORTS[0]}:1010/posted-property/user-view-certain-property`,
                    {userid: userCredentials.credentials.userid, propertytype: viewInfo.property_type}
                )
                .then((response)=>{
                    setRealestatesProperties(response.data.response)
                })
                .catch((err)=>{
                    console.log(err)
                })
            })
            .catch((err)=>{
                console.log(err)
            })
    }, [])
    return(
        <View>
            <View>
                <View style={{padding: 5}}>
                    <FlatList data={realestatesProperties}
                        keyExtractor={(item)=> item.propertyid}
                        ListHeaderComponent={
                            <View style={[styles.card, {backgroundColor: "#ff8c00"}]}>
                                <Text style={[styles.textCapitalize, {fontSize: 16}]}>
                                    current view : {viewInfo.property_type} - {viewInfo.total_pType}
                                </Text>
                            </View>
                        }
                        renderItem={({ item })=>
                            <View style={{padding: 5}}>
                            <View style={styles.card}>
                                <View style={styles.card}>
                                    <Image source={{uri: `http://${ports[0]}:${ports[1]}${item.image}`}} 
                                        style={{width: undefined, height: 200}} resizeMode="stretch" />
                                </View>
                                <View>
                                    <View style={{backgroundColor: "#66cdaa", padding: 5}}>
                                        <Text style={styles.textCapitalize}>property status : {item.propertystatus}</Text>
                                    </View>
                                    <View style={{flexDirection: "row"}}>
                                        <Text style={[styles.textCapitalize, styles.textmarginV]}>total assumer : </Text>
                                        <Badge value={item.totalassumer} status={
                                            parseInt(item.totalassumer) > 0?"success":"warning"
                                        }></Badge>
                                    </View>
                                    <Text style={[styles.textCapitalize, styles.textmarginV]}>owner : {item.realestateowner}</Text>
                                    <Text style={[styles.textCapitalize, styles.textmarginV]}>realestate type : {item.realestatetype}</Text>
                                    <Text style={[styles.textCapitalize, styles.textmarginV]}>type : {item.type}</Text>
                                    <Text style={[styles.textCapitalize, styles.textmarginV]}>downpayment : {item.realestatedownpayment}</Text>
                                    <Text style={[styles.textCapitalize, styles.textmarginV]}>developer : {item.developer}</Text>
                                </View>
                                <View>
                                    {(item.totalassumer > 0 &&
                                        <TouchableOpacity style={styles.showOp}
                                            onPress={()=> navigation.navigate("Assumers", {propID: item.propertyid, propType: item.propertytype, others: null})}>
                                            <View style={{flexDirection: "row", alignSelf: "center"}}>
                                                <Image source={IMAGES.eye} resizeMode="contain" style={{width: 20, height: 20}} />
                                                <Text  style={[styles.textCapitalize, styles.textCenter, {marginHorizontal: 5}]}>
                                                    show assumer's
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity style={styles.editTO}
                                        onPress={()=>{
                                            navigation.navigate("Edit Properties", {item, ports})
                                        }}>
                                        <View style={{flexDirection: "row", alignSelf: "center"}}>
                                            <Image source={IMAGES.edit} resizeMode="contain" 
                                                 style={{width: 20, height: 20}} />
                                            <Text style={[styles.textCapitalize, styles.textCenter, {marginHorizontal: 5}]}>
                                                 edit
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.deleteTO}
                                        onPress={()=>{
                                            Alert.alert(
                                                'Delete',
                                                'Are you sure you want to delete this',
                                                [
                                                    {text: "cancel", onPress: ()=>{

                                                    }},
                                                    {text: "confirm", onPress: ()=>{

                                                    }}
                                                ],
                                                {cancelable: false}
                                            )
                                        }}>
                                        <View style={{flexDirection: "row", alignSelf: "center"}}>
                                            <Image source={IMAGES.trash_can} resizeMode="contain" 
                                                 style={{width: 20, height: 20}} />
                                            <Text style={[styles.textCapitalize, styles.textCenter, {marginHorizontal: 5}]}>
                                                 delete
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            </View>
                        } />
                </View>
            </View>
        </View>
    )
}
const VehicleView = ({ viewInfo, navigation })=>{
    const userCredentials = useContext(Context)
    const [vehicleProperties, setVehicleProperties] = useState(null)
    const [ports, setPorts] = React.useState(null)
    const retrieveAsyncStorage = async()=>{
        const serverIp = await AsyncStorage.getItem("serverIp")
        const imagePort = await AsyncStorage.getItem("imagePort")

        return [serverIp, imagePort]
    }
    useEffect(()=>{
        retrieveAsyncStorage()
            .then((PORTS)=>{
                setPorts(PORTS)
                axios.post(`http://${PORTS[0]}:1010/posted-property/user-view-certain-property`,
                    {userid: userCredentials.credentials.userid, propertytype: viewInfo.property_type}
                )
                .then((response)=>{
                    setVehicleProperties(response.data.response)
                })
                .catch((err)=>{
                    console.log(err)
                })
            })
            .catch((err)=>{
                console.log(err)
            })
    }, [])
    return(
        <View style={{padding: 5}}>
            <View>
                <View>
                    <FlatList data={vehicleProperties}
                        keyExtractor={(item)=> item.propertyid}
                        ListHeaderComponent={
                            <View style={[styles.card, {backgroundColor: "#ff8c00"}]}>
                                <Text style={[styles.textCapitalize, {fontSize: 16}]}>
                                    current view : {viewInfo.property_type} - {viewInfo.total_pType}
                                </Text>
                            </View>
                        }
                        renderItem={({ item })=>
                            <View style={{padding: 5}}>
                                <View style={styles.card}>
                                    {/* <Text>{JSON.stringify(item)}</Text> */}
                                    <View style={styles.card}>
                                        <Image source={{uri: `http://${ports[0]}:${ports[1]}${item.vehiclefrontimage}`}} resizeMode="contain" 
                                            style={{width: undefined, height: 200}} resizeMode="stretch" />
                                    </View>
                                    <View style={{backgroundColor: "#66cdaa", padding: 5}}>
                                        <Text style={styles.textCapitalize}>
                                            property status : {item.propertystatus}</Text>
                                    </View>
                                    <View>
                                        <View style={{flexDirection: "row"}}>
                                            <Text style={[styles.textCapitalize, styles.textmarginV]}>total assumer : </Text>
                                            <Badge value={item.totalassumer} status={
                                                parseInt(item.totalassumer) > 0?"success":"warning"
                                            }></Badge>
                                        </View>
                                        <Text style={[styles.textCapitalize, styles.textmarginV]}>vehicle name : {item.vehiclename}</Text>
                                        <Text style={[styles.textCapitalize, styles.textmarginV]}>model : {item.vehiclemodel}</Text>
                                        <Text style={[styles.textCapitalize, styles.textmarginV]}>owner : {item.vehicleowner}</Text>
                                        <Text style={[styles.textCapitalize, styles.textmarginV]}>downpayment : {item.vehicledownpayment}</Text>
                                    </View>
                                    <View>
                                            {(item.totalassumer > 0 &&
                                            <TouchableOpacity style={styles.showOp}
                                                onPress={()=> navigation.navigate("Assumers", {propID: item.propertyid, propType: item.propertytype, others: null})}>
                                                <View style={{flexDirection: "row", alignSelf: "center"}}>
                                                    <Image source={IMAGES.eye} resizeMode="contain" style={{width: 20, height: 20}} />
                                                    <Text  style={[styles.textCapitalize, styles.textCenter, {marginHorizontal: 5}]}>
                                                        show assumer's
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                            )}
                                        <TouchableOpacity style={styles.editTO}
                                            onPress={()=>{
                                                navigation.navigate("Edit Properties", {item, ports})
                                            }}>
                                            <View style={{flexDirection: "row", alignSelf: "center"}}>
                                                <Image source={IMAGES.edit} resizeMode="contain" style={{width: 20, height: 20}} />
                                                <Text  style={[styles.textCapitalize, styles.textCenter, {marginHorizontal: 5}]}>
                                                    edit
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.deleteTO}
                                            onPress={()=>{
                                                Alert.alert(
                                                    'Delete',
                                                    'Are you sure you want to delete this',
                                                    [
                                                        {text: "cancel", onPress:()=>{

                                                        }},
                                                        {text: "confirm", onPress: ()=>{

                                                        }}
                                                    ]
                                                    ,
                                                    {cancelable: false, onDismiss: ()=>{

                                                    }}
                                                )
                                            }}>
                                            <View style={{flexDirection: "row", alignSelf: "center"}}>
                                                <Image source={IMAGES.trash_can} resizeMode="contain" 
                                                    style={{width: 20, height: 20}} />
                                                <Text style={[styles.textCapitalize, styles.textCenter, {marginHorizontal: 5}]}>
                                                    delete
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        } />
                </View>
            </View>
        </View>
    )
}

const PostedProperties = (props)=>{
    return(
        <View>
            {
                (props.route.params.property_type === "jewelry" &&
                    <JewelryView viewInfo={props.route.params} navigation = {props.navigation} />
                )
            }
            {
                (props.route.params.property_type === "realestate" &&
                    <RealestateView viewInfo={props.route.params} navigation = {props.navigation} />
                )
            }
            {
                (props.route.params.property_type === "vehicle" &&
                    <VehicleView viewInfo={props.route.params} navigation={props.navigation} />
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3,
        padding: 10,
        marginVertical: 3
    },
    textCapitalize: {
        textTransform: "capitalize"
    },
    textmarginV: {
        marginVertical: 5
    },
    textCenter: {
        textAlign: "center"
    },
    showOp: {
        backgroundColor: "#47d147",
        padding: 10,
        borderRadius: 3,
        marginVertical: 3
    },
    editTO: {
        backgroundColor: "#ff7f50",
        padding: 10,
        borderRadius: 3,
        marginVertical: 3
    },
    deleteTO: {
        backgroundColor: "#ccc",
        padding: 10,
        borderRadius: 3,
        marginVertical: 3
    }
})
export default PostedProperties