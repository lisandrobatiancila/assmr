import * as React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { NativeRouter, Route, Link, withRouter } from 'react-router-native'

import { Context } from '../../../../../hooks/context'

import House from './houses'
import HouseAndLot from './houseandlot'
import Lot from './lots'
const Realestate = ()=>{
    const [activeRE, setActiveRE] = React.useState("hal")
    const userCredentials = React.useContext(Context)

    return(
        <Context.Provider value={{setActiveRE: setActiveRE, userCredentials}}>
            <NativeRouter>
                <View>
                    <View style={[styles.cardTop]}>
                        <Link to="/" style={[styles.cardTop, (activeRE === "hal")?styles.activeNav:styles.inactiveNav]}>
                            <Text>House and Lot</Text>
                        </Link>
                        <Link to="/house" style={[styles.cardTop, (activeRE === "house")?styles.activeNav:styles.inactiveNav]}>
                            <Text>House</Text>
                        </Link>
                        <Link to="/lot" style={[styles.cardTop, (activeRE === "lot")?styles.activeNav:styles.inactiveNav]}>
                            <Text>Lot</Text>
                        </Link>
                    </View>
                </View>
                <Route exact path="/" component={ HouseAndLot } />
                <Route path="/house" component={ House } />
                <Route path="/lot" component={ Lot } />
            </NativeRouter>
        </Context.Provider>
    )
}

const styles = StyleSheet.create({
    cardTop: {
        backgroundColor: "#fff",
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3,
        marginVertical: 3,
        padding: 5,
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    activeNav: {
        backgroundColor: "#ff4da6",
        color: "#fff"
    },
    inactiveNav: {
        backgroundColor: "#fff",
        color: "#000"
    }
})
export default Realestate