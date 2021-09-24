import * as React from 'react'
import { View, Text, StyleSheet, AsyncStorage, FlatList, TouchableOpacity,
    ImageBackground } from 'react-native'
import axios from 'axios'
import { Badge } from 'react-native-elements'
import { IMAGES } from '../../../../assets/assets'

const AdminHistories = ()=>{
    const [adminHistories, setAdminHistories] = React.useState([])
    var [totalCancelled, setTotalCancelled] = React.useState(0)
    var [totalActive, setTotalActive] = React.useState(0)
    const retrieveAsyncStorage = async()=>{
        const serverIp = await AsyncStorage.getItem("serverIp")
        const imagePort = await AsyncStorage.getItem("imagePort")
        
        return [serverIp, imagePort]
    }
    React.useEffect(()=>{
        retrieveAsyncStorage()
            .then((PORTS)=>{
                axios.get(`http://${PORTS[0]}:1010/admin/histories/admin-view-histories`)
                .then((response)=>{
                    const resultHistories = response.data.response
                    for (var rh in resultHistories){
                        if (resultHistories[rh].assumer_status === "active")
                            setTotalActive(totalActive+1)
                        else
                            setTotalCancelled(totalCancelled+1)
                    }
                    setAdminHistories(resultHistories)
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
        <View style={styles.outContainer}>
            <View style={styles.inContainer}>
                <FlatList data={adminHistories}
                    renderItem={( { item })=>
                        <TouchableOpacity>
                            <View style={styles.card}>
                                <Text style={[styles.textCapitalize, styles.textFont,
                                    styles.textCenter]}
                                    >{item.assumer_lastname}, {item.assumer_firstname} {item.assumer_middlename[0]}. </Text>
                                <Text style={[styles.textCenter, styles.textMV]}>
                                    {item.history_type}
                                </Text>
                                <Text style={styles.textCenter}>on {item.monthname} {item.day}, {item.year} {item.dayname[0]}{item.dayname[1]}{item.dayname[2]}.</Text>
                                <View style={{flexDirection: "row", alignSelf: "center"}}>
                                    <Text>
                                        <Badge value={item.assumer_status} 
                                            status={(item.assumer_status === "active")?"success":"error"}  />
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    } />
            </View>
            <View style={styles.footerItem}>
                <Text>
                    cancelled
                    <Badge value={totalCancelled} status="error" />
                </Text>
                <Text>
                    active
                    <Badge value={totalActive} status="success" />
                </Text>
            </View>
        </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    outContainer: {
        padding: 5
    },
    inContainer: {
        height: "95%"
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
    footerItem: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    textCapitalize: {
        textTransform: "capitalize"
    },
    textCenter: {
        textAlign: "center"
    },
    textFont: {
        fontSize: 18,
        letterSpacing: 2,
        fontWeight: "bold"
    },
    textMV: {
        marginVertical: 5
    }
})

export default AdminHistories