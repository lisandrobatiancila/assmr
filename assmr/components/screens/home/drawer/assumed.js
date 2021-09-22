import * as React from 'react'
import { View, Text, Image, 
    Picker, FlatList, StyleSheet, 
    AsyncStorage, Button, TouchableOpacity, Alert } from 'react-native'
import axios from 'axios'
import { Context } from '../../../../hooks/context'

const HeaderView = ({ choosenPropertyType, setChoosenPropertyType })=>{
    return(
        <View>
            <View style={styles.headerView}>
                <Picker selectedValue={choosenPropertyType}
                    onValueChange={(value)=>
                        setChoosenPropertyType(value)
                    }>
                    <Picker.Item label="All" value="all" />
                    <Picker.Item label="Jewelry" value="jewelry" />
                    <Picker.Item label="Realestate" value="realestate" />
                    <Picker.Item label="Vehicle" value="vehicle" />
                </Picker>
            </View>
        </View>
    )
}
const AllPropertyView = ({ allAssumedProperties, navigation, sendUserSMS, PORTS })=>{
    const userCredentials = React.useContext(Context)
    const [ports, setPorts] = React.useState([])
    return(
        <View style={{padding: 5, height: "90%"}}>
            <View style={{flexDirection: "column"}}>
                    <FlatList data={allAssumedProperties}
                    keyExtractor={(item)=> item.assumer_id.assumer_id}
                    renderItem={({ item })=>
                        <View style={styles.card} >
                            {/* <Text>{item.propertyType}</Text> */}
                            {
                                (item.propertyType === "vehicle" &&
                                    <View key={item.assumer_id.assumer_id}>
                                        <View style={styles.card}>
                                            <Image source={{uri: `http://${PORTS[0]}:${PORTS[1]}${item.vehicle_info[1].vehicle_frontimage}`}}
                                                style={{width: undefined, height: 200}} resizeMode="cover" />
                                            <View style={{backgroundColor: (item.propertyStatus === "Not assume")?"#ff944d":"#5cd65c",
                                                        padding: 5}}>
                                                <Text style={[styles.textCapitalize, styles.textMV]}>status : {item.propertyStatus}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={[styles.textCapitalize, styles.textMV]}>
                                                owner : {item.vehicle_info[0].vehicle_owner}</Text>
                                            <Text style={[styles.textCapitalize, styles.textMV]}>
                                                vehicle : {item.vehicle_info[0].vehicle_name}</Text>
                                            <Text style={[styles.textCapitalize, styles.textMV]}>
                                                model : {item.vehicle_info[0].vehicle_model}</Text>
                                            <Text style={[styles.textCapitalize, styles.textMV]}>
                                                installment paid : {item.vehicle_info[0].vehicle_installmentpaid}</Text>
                                            <Text style={[styles.textCapitalize, styles.textMV]}>
                                                location : {item.vehicle_info[0].vehicle_location}</Text>
                                        </View>
                                        <View>
                                            <TouchableOpacity style={[styles.buttonViewDetails,
                                                styles.MV3]}
                                                onPress={()=> navigation.navigate("Assumed Details", {item, PORTS})}>
                                                <Text style={[styles.textCenter, styles.textCapitalize, 
                                                        {fontSize: 16}]}>view details</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.buttonSensSMS}
                                                onPress={()=> sendUserSMS(userCredentials, 
                                                    {assumerID: item.assumer_id.assumer_id})}>
                                                <Text style={[styles.textCenter, styles.textCapitalize, 
                                                    {fontSize: 16}]}>send sms</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            }
                            {
                                (item.propertyType === "jewelry" &&
                                    <View key={item.assumer_id.assumer_id}>
                                        <View style={styles.card}>
                                            <Image source={{uri: `http://${PORTS[0]}:${PORTS[1]}${item.jewelry_info[0].jewelry_firstimage}`}}
                                                style={{width: undefined, height: 200}} resizeMode="stretch" />
                                        </View>
                                        <View>
                                            <View style={{backgroundColor: (item.propertyStatus === "Not assume")?"#ff944d":"#5cd65c",
                                                    padding: 5}}>
                                                <Text style={[styles.textCapitalize, styles.textMV]}>status : {item.propertyStatus}</Text>
                                            </View>
                                            <Text style={[styles.textCapitalize, styles.textMV]}>
                                                owner : {item.jewelry_info[0].jewelry_owner}</Text>
                                            <Text style={[styles.textCapitalize, styles.textMV]}>
                                                jewelry name : {item.jewelry_info[0].jewelry_name}</Text>
                                            <Text style={[styles.textCapitalize, styles.textMV]}>
                                                installment paid : {item.jewelry_info[0].jewelry_installmentpaid}</Text>
                                            <Text style={[styles.textCapitalize, styles.textMV]}>
                                                location : {item.jewelry_info[0].jewelry_location}</Text>
                                        </View>
                                        <View>
                                            <TouchableOpacity style={[styles.buttonViewDetails,
                                                styles.MV3]}
                                                onPress={()=> navigation.navigate("Assumed Details", {item, PORTS})}>
                                                <Text style={[styles.textCenter, styles.textCapitalize, 
                                                        {fontSize: 16}]}>view details</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.buttonSensSMS}
                                                onPress={()=> sendUserSMS(userCredentials, 
                                                    {assumerID: item.assumer_id.assumer_id})}>
                                                <Text style={[styles.textCenter, styles.textCapitalize, 
                                                    {fontSize: 16}]}>send sms</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            }
                            {
                                (item.propertyType === "realestate" &&
                                    <View key={item.assumer_id.assumer_id}>
                                    {
                                        (item.realestateType === "house" &&
                                            <View>
                                                {/* <Text>{JSON.stringify(item)}</Text> */}
                                                <View style={styles.card}>
                                                    <Image source={{uri: `http://${PORTS[0]}:${PORTS[1]}${item.realestate_info[1].house_frontimage}`}}
                                                        style={{width: undefined, height: 200}} resizeMode="stretch" />
                                                </View>
                                                <View>
                                                    <View style={{backgroundColor: (item.propertyStatus === "Not assume")?"#ff944d":"#5cd65c",
                                                            padding: 5}}>
                                                        <Text style={[styles.textCapitalize, styles.textMV]}>status : {item.propertyStatus}</Text>
                                                    </View>
                                                    <Text style={[styles.textCapitalize, styles.textMV]}>
                                                        owner : {item.realestate_info[0].realestate_owner}</Text>
                                                        <Text style={[styles.textCapitalize, styles.textMV]}>
                                                        realestate type : {item.realestate_info[0].realestate_type}</Text>
                                                    <Text style={[styles.textCapitalize, styles.textMV]}>
                                                        type : {item.realestate_info[0].type}</Text>
                                                    <Text style={[styles.textCapitalize, styles.textMV]}>
                                                        installment paid : {item.realestate_info[0].realestate_installmentpaid}</Text>
                                                    <Text style={[styles.textCapitalize, styles.textMV]}>
                                                        location : {item.realestate_info[0].realestate_location}</Text>
                                                </View>
                                                <View>
                                                <TouchableOpacity style={[styles.buttonViewDetails,
                                                        styles.MV3]}
                                                        onPress={()=> navigation.navigate("Assumed Details", {item, PORTS})}>
                                                    <Text style={[styles.textCenter, styles.textCapitalize, 
                                                            {fontSize: 16}]}>view details</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.buttonSensSMS}
                                                    onPress={()=> sendUserSMS(userCredentials, 
                                                        {assumerID: item.assumer_id.assumer_id})}>
                                                    <Text style={[styles.textCenter, styles.textCapitalize, 
                                                            {fontSize: 16}]}>send sms</Text>
                                                </TouchableOpacity>
                                                </View>
                                            </View>
                                        )
                                    }
                                    {
                                        (item.realestateType === "lot" &&
                                            <View>
                                                <View style={styles.card}>
                                                    <Image source={{uri: `http://${PORTS[0]}:${PORTS[1]}${item.realestate_info[1].lot_firstimage}`}}
                                                        style={{width: undefined, height: 200}} resizeMode="stretch" />
                                                </View>
                                                <View>
                                                    <View style={{backgroundColor: (item.propertyStatus === "Not assume")?"#ff944d":"#5cd65c",
                                                            padding: 5}}>
                                                        <Text style={[styles.textCapitalize, styles.textMV]}>status : {item.propertyStatus}</Text>
                                                    </View>
                                                    <Text style={[styles.textCapitalize, styles.textMV]}>
                                                        owner : {item.realestate_info[0].realestate_owner}</Text>
                                                        <Text style={[styles.textCapitalize, styles.textMV]}>
                                                        realestate type : {item.realestate_info[0].realestate_type}</Text>
                                                    <Text style={[styles.textCapitalize, styles.textMV]}>
                                                        type : {item.realestate_info[0].type}</Text>
                                                    <Text style={[styles.textCapitalize, styles.textMV]}>
                                                        installment paid : {item.realestate_info[0].realestate_installmentpaid}</Text>
                                                    <Text style={[styles.textCapitalize, styles.textMV]}>
                                                        location : {item.realestate_info[0].realestate_location}</Text>
                                                </View>
                                                <View>
                                                <TouchableOpacity style={[styles.buttonViewDetails,
                                                        styles.MV3]}
                                                        onPress={()=> navigation.navigate("Assumed Details", {item, PORTS})}>
                                                    <Text style={[styles.textCenter, styles.textCapitalize, 
                                                            {fontSize: 16}]}>view details</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.buttonSensSMS}
                                                    onPress={()=> sendUserSMS(userCredentials, 
                                                        {assumerID: item.assumer_id.assumer_id})}>
                                                    <Text style={[styles.textCenter, styles.textCapitalize, 
                                                            {fontSize: 16}]}>send sms</Text>
                                                </TouchableOpacity>
                                                </View>
                                            </View>
                                        )
                                    }
                                    {
                                        (item.realestateType === "houseandlot" &&
                                            <View>
                                                <View style={styles.card}>
                                                    <Image source={{uri: `http://${PORTS[0]}:${PORTS[1]}${item.realestate_info[1].hal_frontimage}`}}
                                                        style={{width: undefined, height: 200}} resizeMode="stretch" />
                                                </View>
                                                <View>
                                                    <View style={{backgroundColor: (item.propertyStatus === "Not assume")?"#ff944d":"#5cd65c",
                                                            padding: 5}}>
                                                        <Text style={[styles.textCapitalize, styles.textMV]}>status : {item.propertyStatus}</Text>
                                                    </View>
                                                    <Text style={[styles.textCapitalize, styles.textMV]}>
                                                        owner : {item.realestate_info[0].realestate_owner}</Text>
                                                        <Text style={[styles.textCapitalize, styles.textMV]}>
                                                        realestate type : {item.realestate_info[0].realestate_type}</Text>
                                                    <Text style={[styles.textCapitalize, styles.textMV]}>
                                                        type : {item.realestate_info[0].type}</Text>
                                                    <Text style={[styles.textCapitalize, styles.textMV]}>
                                                        installment paid : {item.realestate_info[0].realestate_installmentpaid}</Text>
                                                    <Text style={[styles.textCapitalize, styles.textMV]}>
                                                        location : {item.realestate_info[0].realestate_location}</Text>
                                                </View>
                                                <View>
                                                <TouchableOpacity style={[styles.buttonViewDetails,
                                                        styles.MV3]}
                                                        onPress={()=> navigation.navigate("Assumed Details", {item, PORTS})}>
                                                    <Text style={[styles.textCenter, styles.textCapitalize, 
                                                            {fontSize: 16}]}>view details</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.buttonSensSMS}
                                                    onPress={()=> sendUserSMS(userCredentials, 
                                                        {assumerID: item.assumer_id.assumer_id})}>
                                                    <Text style={[styles.textCenter, styles.textCapitalize, 
                                                            {fontSize: 16}]}>send sms</Text>
                                                </TouchableOpacity>
                                                </View>
                                            </View>
                                        )
                                    }
                                    </View>
                                )
                            }
                        </View>
                    } />
                </View>
        </View>
    )
}
const JewelryPropertyView = ( { jewelryData, navigation, sendUserSMS, PORTS })=>{
    const userCredentials = React.useContext(Context)
    return(
        (Object.keys(jewelryData).length > 0)?
            <View style={{padding: 5, height: "90%"}}>
                <View style={{flex: 1, flexDirection: "column"}}>
                    <FlatList data={jewelryData}
                        keyExtractor={(item)=> item.assumer_id.assumer_id}
                        renderItem={({ item })=>
                        <View style={styles.card} key={item.assumer_id.assumer_id}>
                            <View style={styles.card}>
                                <Image source={{uri: `http://${PORTS[0]}:${PORTS[1]}${item.jewelry_info[0].jewelry_firstimage}`}} 
                                    style={{width:undefined, height: 200}} resizeMode="stretch" />
                            </View>
                            <View style={{backgroundColor: (item.propertyStatus === "Not assume")?"#ff944d":"#5cd65c",
                                padding: 5}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>status : {item.propertyStatus}</Text>
                            </View>
                            <View>
                                <Text style={[styles.textCapitalize, styles.textMV]}>
                                    owner : {item.jewelry_info[0].jewelry_owner}</Text>
                                <Text style={[styles.textCapitalize, styles.textMV]}>
                                    jewelry name : {item.jewelry_info[0].jewelry_name}</Text>
                                <Text style={[styles.textCapitalize, styles.textMV]}>
                                    installmentpaid : {item.jewelry_info[0].jewelry_installmentpaid}</Text>
                                <Text style={[styles.textCapitalize, styles.textMV]}>
                                    location : {item.jewelry_info[0].jewelry_location}</Text>
                            </View>
                            <View>
                                <TouchableOpacity style={[styles.buttonViewDetails,
                                    styles.MV3]}
                                    onPress={()=> navigation.navigate("Assumed Details", {item, PORTS})}>
                                    <Text style={[styles.textCenter, styles.textCapitalize, 
                                        {fontSize: 16}]}>view details</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.buttonSensSMS}
                                    onPress={()=> sendUserSMS(userCredentials, 
                                        {assumerID: item.assumer_id.assumer_id})}>
                                    <Text style={[styles.textCenter, styles.textCapitalize, 
                                        {fontSize: 16}]}>send sms</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        } />
                </View>
            </View>
            :
            <View style={styles.emptyError}>
                <Text style={styles.emptyText}>empty</Text>
            </View>
    )
}
const RealestatePropertyView = ({ realestateData, navigation, sendUserSMS, PORTS })=>{
    const userCredentials = React.useContext(Context)
    return(
        (Object.keys(realestateData).length > 0)?
        <View style={{padding: 5, height: "90%"}}>
            <View style={{flexDirection: "column"}}>
                <FlatList data={realestateData}
                    keyExtractor={(item)=> item.assumer_id.assumer_id}
                    renderItem={({ item })=>
                        <View key={item.assumer_id.assumer_id} style={styles.card}>
                            {
                                (item.realestateType === "house" &&
                                <View>
                                    <View style={styles.card}>
                                        <Image source={{uri: `http://${PORTS[0]}:${PORTS[1]}${item.realestate_info[1].house_frontimage}`}}
                                            style={{width: undefined, height: 200}} resizeMode="stretch"  />
                                    </View>
                                    <View style={{backgroundColor: (item.propertyStatus === "Not assume")?"#ff944d":"#5cd65c",
                                        padding: 5}}>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>status : {item.propertyStatus}</Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>owner : {item.realestate_info[0].realestate_owner}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>realestate type : {item.realestate_info[0].realestate_type}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>type : {item.realestate_info[0].type}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>installmentpaid : {item.realestate_info[0].realestate_installmentpaid}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>location : {item.realestate_info[0].realestate_location}</Text>
                                    </View>
                                    <View>
                                        <TouchableOpacity style={[styles.buttonViewDetails,
                                            styles.MV3]}
                                            onPress={()=> navigation.navigate("Assumed Details", {item, PORTS})}>
                                            <Text style={[styles.textCenter, styles.textCapitalize, 
                                                {fontSize: 16}]}>view details</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.buttonSensSMS}
                                            onPress={()=> sendUserSMS(userCredentials, 
                                                {assumerID: item.assumer_id.assumer_id})}>
                                            <Text style={[styles.textCenter, styles.textCapitalize, 
                                                {fontSize: 16}]}>send sms</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                )
                            }
                            {
                                (item.realestateType === "lot" &&
                                <View>
                                    <View style={styles.card}>
                                    <Image source={{uri: `http://${PORTS[0]}:${PORTS[1]}${item.realestate_info[1].lot_firstimage}`}}
                                        style={{width: undefined, height: 200}} resizeMode="stretch"  />
                                    </View>
                                    <View style={{backgroundColor: (item.propertyStatus === "Not assume")?"#ff944d":"#5cd65c",
                                        padding: 5}}>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>status : {item.propertyStatus}</Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>owner : {item.realestate_info[0].realestate_owner}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>realestate type : {item.realestate_info[0].realestate_type}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>type : {item.realestate_info[0].type}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>installmentpaid : {item.realestate_info[0].realestate_installmentpaid}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>location : {item.realestate_info[0].realestate_location}</Text>
                                    </View>
                                    <View>
                                        <TouchableOpacity style={[styles.buttonViewDetails,
                                            styles.MV3]}
                                            onPress={()=> navigation.navigate("Assumed Details", {item, PORTS})}>
                                            <Text style={[styles.textCenter, styles.textCapitalize, 
                                                {fontSize: 16}]}>view details</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.buttonSensSMS}
                                            onPress={()=> sendUserSMS(userCredentials, 
                                                {assumerID: item.assumer_id.assumer_id})}>
                                            <Text style={[styles.textCenter, styles.textCapitalize, 
                                                {fontSize: 16}]}>send sms</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                )
                            }
                            {
                                (item.realestateType === "houseandlot" &&
                                <View>
                                    <View style={styles.card}>
                                    <Image source={{uri: `http://${PORTS[0]}:${PORTS[1]}${item.realestate_info[1].hal_frontimage}`}}
                                            style={{width: undefined, height: 200}} resizeMode="stretch"  />
                                    </View>
                                    <View style={{backgroundColor: (item.propertyStatus === "Not assume")?"#ff944d":"#5cd65c",
                                        padding: 5}}>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>status : {item.propertyStatus}</Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>owner : {item.realestate_info[0].realestate_owner}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>realestate type : {item.realestate_info[0].realestate_type}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>type : {item.realestate_info[0].type}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>installmentpaid : {item.realestate_info[0].realestate_installmentpaid}</Text>
                                        <Text style={[styles.textCapitalize, styles.textMV]}>location : {item.realestate_info[0].realestate_location}</Text>
                                    </View>
                                    <View>
                                        <TouchableOpacity style={[styles.buttonViewDetails,
                                            styles.MV3]}
                                            onPress={()=> navigation.navigate("Assumed Details", {item, PORTS})}>
                                            <Text style={[styles.textCenter, styles.textCapitalize, 
                                                {fontSize: 16}]}>view details</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.buttonSensSMS}
                                            onPress={()=> sendUserSMS(userCredentials, 
                                                {assumerID: item.assumer_id.assumer_id})}>
                                            <Text style={[styles.textCenter, styles.textCapitalize, 
                                                {fontSize: 16}]}>send sms</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                )
                            }
                        </View>
                    } />
            </View>
        </View>
        :
        <View style={styles.emptyError}>
            <Text style={styles.emptyText}>empty</Text>
        </View>
    )
}
const VehiclePropertyView = ({ vehicleData, navigation, sendUserSMS, PORTS })=>{
    const userCredentials = React.useContext(Context)
    return(
        (Object.keys(vehicleData).length > 0)?
        <View style={{padding: 5, height: "90%"}}>
            <View style={{flexDirection: "column"}}>
                <FlatList data={vehicleData}
                    keyExtractor={(item)=> item.assumer_id.assumer_id}
                    renderItem={({ item })=>
                    <View style={styles.card}>
                        <View style={styles.card}>
                            <Image source={{uri: `http://${PORTS[0]}:${PORTS[1]}${item.vehicle_info[1].vehicle_frontimage}`}} 
                                style={{width: undefined, height: 200}} resizeMode="stretch" />
                        </View>
                        <View style={{backgroundColor: (item.propertyStatus === "Not assume")?"#ff944d":"#5cd65c",
                            padding: 5}}>
                            <Text style={[styles.textCapitalize, styles.textMV]}>status : {item.propertyStatus}</Text>
                        </View>
                        <View>
                            <Text style={[styles.textCapitalize, styles.textMV]}>
                                owner : {item.vehicle_info[0].vehicle_owner}</Text>
                            <Text style={[styles.textCapitalize, styles.textMV]}>
                                vehicle : {item.vehicle_info[0].vehicle_name}</Text>
                            <Text style={[styles.textCapitalize, styles.textMV]}>
                                model : {item.vehicle_info[0].vehicle_model} </Text>
                            <Text style={[styles.textCapitalize, styles.textMV]}>
                                installmentpaid : {item.vehicle_info[0].vehicle_installmentpaid}</Text>
                            <Text style={[styles.textCapitalize, styles.textMV]}>
                                location : {item.vehicle_info[0].vehicle_location}</Text>
                        </View>
                        <View>
                            <TouchableOpacity style={[styles.buttonViewDetails,
                                styles.MV3]}
                                onPress={()=> navigation.navigate("Assumed Details", {item, PORTS})}>
                                <Text style={[styles.textCenter, styles.textCapitalize, 
                                    {fontSize: 16}]}>view details</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonSensSMS}
                                onPress={()=> sendUserSMS(userCredentials, 
                                    {assumerID: item.assumer_id.assumer_id})}>
                                <Text style={[styles.textCenter, styles.textCapitalize, 
                                    {fontSize: 16}]}>send sms</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    } />
            </View>
        </View>
        :
        <View style={styles.emptyError}>
            <Text style={styles.emptyText}>
                empty</Text>
        </View>
    )
}
const Assumed = (props)=>{
    const userCredentials = React.useContext(Context)
    const [jewelryData, setJewelryData] = React.useState([])
    const [realestateData, setRealestateData] = React.useState(null)
    const [vehicleData, setVehicleData] = React.useState(null)
    const [allAssumedProperties, setAllAassumedProperties] = React.useState(null)
    const [choosenPropertyType, setChoosenPropertyType] = React.useState('all')
    const [ports, setPorts] = React.useState([])
    const retrieveAsyncStorage = async()=>{
        const serverIp = await AsyncStorage.getItem("serverIp")
        const imagePort = await AsyncStorage.getItem("imagePort")

        return [serverIp, imagePort]
    }
    const sendUserSMS = (activeCredentials, otherPayLoads)=>{
        retrieveAsyncStorage()
            .then((PORTS)=>{
                axios.post(`http://${PORTS[0]}:1010/messages/send-user-sms`,
                    [activeCredentials.credentials, otherPayLoads]
                )
                .then((response)=>{
                    const payLoads = {
                        messagesender: response.data.response.account_email,
                        userimage: response.data.response.user_image
                    }

                    props.navigation.navigate("Messages", 
                        {
                            screen: "Open Messages",
                            params: payLoads,
                            initial: false
                        }
                    )
                })
                .catch((err)=>{
                    console.log(err.message)
                })
            })
            .catch((err)=>{
                console.log(err.message)
            })
    }
    React.useEffect(()=>{
        retrieveAsyncStorage()
            .then((PORTS)=>{
                setPorts(PORTS)
                axios.post(`http://${PORTS[0]}:1010/assumedproperty/get-user-assumed-property`,
                    userCredentials.credentials
                )
                .then((response)=>{
                    response = response.data.response
                    var allAssumed = response
                    var jewelData = []
                    var vehicData = []
                    var realData = []
                    for(var resp in response){
                        if (response[resp].propertyType === "jewelry")
                            jewelData.push(response[resp])
                        else if (response[resp].propertyType === "vehicle")
                            vehicData.push(response[resp])
                        else if (response[resp].propertyType === "realestate")
                            realData.push(response[resp])
                    }//end of for
                    setAllAassumedProperties(allAssumed)
                    setJewelryData(jewelData)
                    setVehicleData(vehicData)
                    setRealestateData(realData)
                })
                .catch((err)=>{
                    console.log(err.message)
                })
            })
            .catch((err)=>{
                console.log(err.message)
            })
    }, [choosenPropertyType])
    return(
        <View>
            <HeaderView choosenPropertyType={choosenPropertyType}
                setChoosenPropertyType={setChoosenPropertyType} />
            {
                (choosenPropertyType === "all" && 
                    <AllPropertyView allAssumedProperties={allAssumedProperties}
                        navigation = {props.navigation} sendUserSMS={sendUserSMS} PORTS={ports} />
                )
            }
            {
                (choosenPropertyType === "jewelry" &&
                    <JewelryPropertyView jewelryData={jewelryData}
                        navigation = {props.navigation} sendUserSMS={sendUserSMS} PORTS={ports} />
                )
            }
            {
                (choosenPropertyType === "realestate" &&
                    <RealestatePropertyView realestateData={realestateData}
                        navigation = {props.navigation} sendUserSMS={sendUserSMS} PORTS={ports} />
                )
            }
            {
                (choosenPropertyType === "vehicle" &&
                    <VehiclePropertyView vehicleData = {vehicleData}
                        navigation = {props.navigation} sendUserSMS={sendUserSMS} PORTS={ports} />
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    headerView: {
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3
    },
    card: {
        backgroundColor: "#fff",
        padding: 6,
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3,
        marginVertical: 5
    },
    textCenter: {
        textAlign: "center"
    },
    textMV: {
        marginVertical: 3
    },
    textCapitalize: {
        textTransform: "capitalize"
    },
    MV3: {
        marginVertical: 3
    },
    buttonViewDetails: {
        padding: 10,
        backgroundColor: "#00bfff",
        borderRadius: 3,
    },
    buttonSensSMS: {
        padding: 10,
        backgroundColor: "#ff4da6",
        borderRadius: 3
    },
    emptyError: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    emptyText: {
        textTransform: "capitalize",
        fontWeight: "bold",
        fontSize: 20,
        letterSpacing: 1
    }
})
export default Assumed