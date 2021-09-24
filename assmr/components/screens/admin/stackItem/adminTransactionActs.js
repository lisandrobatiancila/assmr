import * as React from 'react'
import { View, Text, StyleSheet, AsyncStorage, FlatList, 
    Image, ImageBackground, 
    TouchableOpacity} from 'react-native'
import axios from 'axios'
import { Badge } from 'react-native-elements'
import { IMAGES } from '../../../../assets/assets'

const AdminTransactionActivities = ()=>{
    const [ports, setPorts] = React.useState([])
    const [adminTransactions, setAdminTransactions] = React.useState([])
    const retrieveAsyncStorage = async()=>{
        const serverIp = await AsyncStorage.getItem("serverIp")
        const imagePort = await AsyncStorage.getItem("imagePort")
        
        return [serverIp, imagePort]
    }
    React.useEffect(()=>{
        retrieveAsyncStorage()
            .then((PORTS)=>{
                setPorts(PORTS)
                axios.get(`http://${PORTS[0]}:1010/admin/transactions/admin-view-transactions`)
                .then((response)=>{
                    const transactionsResponse = response.data.response
                    setAdminTransactions(transactionsResponse)
                })
                .catch((err)=>{
                    console.log(`aP: ${err.message}`)
                })
            })
            .catch((err)=>{
                console.log(`rAS: ${err.message}`)
            })
    }, [])
    return(
        <ImageBackground source={IMAGES.assmer_logo} 
            style={{width: "100%", height: "100%", opacity: 0.9}}>
        <View style={styles.container}>
            <FlatList data={adminTransactions}
                keyExtractor={(item)=> item.assumer_id}
                renderItem = {({ item })=>
                <TouchableOpacity>
                <View style={styles.card} key={item.assumer_id}>
                    <View style={[styles.containerRow, {alignSelf: "center"}]}>
                        <View style={styles.viewMV}>
                            <View style={styles.userImageContainer}>
                                <Image source={{uri: `http://${ports[0]}:${ports[1]}${item.propOwner.user_image}`}} 
                                    style={{width: 80, height: 80, alignSelf: "center", borderRadius: 50}} resizeMode="contain" />
                            </View>
                            <Text style={[styles.textFont, styles.textName,
                                styles.textWeight]}>{item.propOwner.user_lastname}, {item.propOwner.user_firstname} {item.propOwner.user_middlename[0]}.</Text>
                            <Text style={{textAlign: "center"}}>owner</Text>
                        </View>
                        {/* end of propertyOwner */}
                        <View style={[styles.viewDivider, styles.viewMV]}></View>
                        <View style={styles.viewMV}>
                            <View style={styles.userImageContainer} style={{justifyContent: "center",
                                alignSelf: "center"}}>
                                <Image source={{uri: `http://${ports[0]}:${ports[1]}${item.user_image}`}} 
                                    style={{width: 80, height: 80, borderRadius: 50}} />
                            </View>
                            <Text style={[styles.textFont, styles.textName,
                                styles.textWeight]}>{item.assumer_lastname}, {item.assumer_firstname} {item.assumer_middlename[0]}.</Text>
                            <Text style={{textAlign: "center"}}>assumer</Text>
                        </View>
                        {/* end of propertyAssumer */}
                    </View>
                    <View style={{width: "100%", height: 2, backgroundColor: "#ff8c00", marginTop: 5}}></View>
                    <View style={{marginTop: 20}}>
                        <View style={{flexDirection: "row", flexWrap: "wrap",
                            justifyContent: "center"}}>
                            <Text style={[styles.textWeight, styles.textName]}>
                                {item.assumer_lastname}, {item.assumer_firstname} {item.assumer_middlename[0]}.</Text>
                            <Text> assume the property of </Text>
                            <Text style={[styles.textWeight, styles.textName]}>
                                {item.propOwner.user_lastname}, {item.propOwner.user_firstname} {item.propOwner.user_middlename[0]}. </Text>
                        </View>
                        <View style={{marginTop: 20}}>
                            <Text style={styles.textCapitalize}>date of assumption : {item.monthname} {item.day}, {item.year}</Text>
                            <View style={{flexDirection: "row"}}>
                                <Text style={styles.textCapitalize}>status : </Text>
                                <Badge value={item.assumer_status} status={(item.assumer_status === "active")?"success":"error"} />
                            </View>
                        </View>
                    </View>
                    {/* displayInfos */}
                </View>
                </TouchableOpacity>
                }
            />
        </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
    },
    card: {
        padding: 10,
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3,
        marginVertical: 3,
        backgroundColor: "#fff"
    },
    containerRow: {
        flexDirection: "row"
    },
    viewDivider: {
        width: 2,
        height: 50,
        backgroundColor: "#ff8c00",
        alignSelf: "center"
    },
    viewMV: {
        marginHorizontal: 5
    },
    textWeight: {
        fontWeight: "bold",
    },
    textFont: {
        fontSize: 16,
    },
    textName: {
        letterSpacing: 1.5,
    },
    textCapitalize: {
        textTransform: "capitalize"
    },
    userImageContainer: {
        width: 85,
        height: 85,
        borderRadius: 50,
        backgroundColor: "#ccc",
        alignContent: "center",
        alignSelf: "center"
    }
})
export default AdminTransactionActivities