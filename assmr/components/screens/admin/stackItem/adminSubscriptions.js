import * as React from 'react'
import { View, Text, StyleSheet, AsyncStorage, FlatList, Image, 
    ImageBackground } from 'react-native'
import axios from 'axios'
import { Badge } from 'react-native-elements'
import { IMAGES } from '../../../../assets/assets'

const AdminSubscriptions = ()=>{
    const [adminSubscriptions, setAdminSubscriptions] = React.useState([])
    const [ports, setPorts] = React.useState([])
    const retrieveAsyncStorage = async()=>{
        const serverIp = await AsyncStorage.getItem("serverIp")
        const imagePort = await AsyncStorage.getItem("imagePort")
        
        return [serverIp, imagePort]
    }
    React.useEffect(()=>{
        retrieveAsyncStorage()
            .then((PORTS)=>{
                setPorts(PORTS)
                axios.get(`http://${PORTS[0]}:1010/admin/transactions/admin-view-subscriptions`)
                .then((response)=>{
                    const resultSubscriptions = response.data.response
                    setAdminSubscriptions(resultSubscriptions)
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
            <View style={styles.card}><Text style={[styles.textCapitalize, 
                    styles.textCenter, 
                    {fontWeight: "bold", letterSpacing: 1.5, fontSize: 16}]}>list of assumers</Text></View>
            <View style={{height: "90%"}}>
                <FlatList data={adminSubscriptions}
                   renderItem={( { item } )=>
                   <View style={styles.card}>
                       <View style={styles.card}>
                           <Image source={{uri: `http://${ports[0]}:${ports[1]}${item.user_image}`}} 
                                style={{width: undefined, height: 200, }} resizeMode="stretch" />

                       </View>
                       <View>
                           <Text style={[styles.textCapitalize, styles.textMV]}>name : {item.assumer_lastname}, {item.assumer_firstname} {item.assumer_middlename[0]}.</Text>
                           <Text style={[styles.textCapitalize, styles.textMV]}>contact # : {item.assumer_contactno}</Text>
                           <Text style={[styles.textCapitalize, styles.textMV]}>job : {item.assumer_job}</Text>
                           <Text style={[styles.textCapitalize, styles.textMV]}>company : {item.assumer_company}</Text>
                           <Text style={[styles.textCapitalize, styles.textMV]}>income : {item.assumer_income}</Text>
                           <Text style={[styles.textCapitalize, styles.textMV]}>address : {item.assumer_address}</Text>
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>status : </Text>
                                <Badge value={item.assumer_status} status={(item.assumer_status === "active")?"success":"error"} />
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.textCapitalize, styles.textMV]}>assumption date : </Text>
                                <Text style={{marginVertical: 3}}>{item.monthname} {item.day}, {item.year} {item.dayname[0]}{item.dayname[1]}{item.dayname[2]}.</Text>
                            </View>
                        </View>
                    </View>
                   } />
            </View>
        </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
        flexDirection: "column"
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
    textCapitalize: {
        textTransform: "capitalize"
    },
    textCenter: {
        textAlign: "center"
    },
    textMV: {
        marginVertical: 3
    },
})

export default AdminSubscriptions