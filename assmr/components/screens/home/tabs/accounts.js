import * as React from 'react'
import { Image, Text, StyleSheet, View, AsyncStorage, Alert } from 'react-native'
import { Badge } from 'react-native-elements'
import axios from 'axios'
import { createDrawerNavigator, DrawerContent } from '@react-navigation/drawer'
import { PostedStackScreen, AssumedStackScreen,
    FeedBackStackScreen,MessagesStackScreen, 
    NotificationStackScreen, UpdateAccountScreen } from '../stack/containerStack'
import LogOut from '../drawer/logout'
import { IMAGES } from '../../../../assets/assets'
import { Context } from '../../../../hooks/context'
import UserInfo from '../drawer/userinfo'
import UpdateAccount from '../drawer/updateAccount'
const DrawerNavigator = createDrawerNavigator()

const Accounts = (props)=>{
    const userCredentials = React.useContext(Context)
    const [messageBadge, setMessageBadge] = React.useState(0)
    const [notificationBadge, setNotificationBadge] = React.useState(100)
    const retrieveAsyncStorage = async()=>{
        const serverIp = await AsyncStorage.getItem("serverIp")
        const imagePort = await AsyncStorage.getItem("imagePort")
        return [serverIp, imagePort]
    }
    React.useEffect(()=>{
        retrieveAsyncStorage()
            .then((PORTS)=>{
                axios.post(`http://${PORTS[0]}:1010/notifications/user-counted-notifications`,
                    userCredentials.credentials
                )
                .then((response)=>{
                    const totalSMS = response.data.totalSMS
                    const totalNotifications = response.data.totalNotifications
                    
                    setMessageBadge(totalSMS[0].total_sms)
                    setNotificationBadge(totalNotifications[0].total_notification)
                })
                .catch((err)=>{
                    console.log("aP: "+err.message)
                })
            })
            .catch((err)=>{
                console.log("rA: "+err)
            })
    }, [])
    return(
        <DrawerNavigator.Navigator style={styles.container} 
            drawerContentOptions={{
                activeTintColor: "#ff8c00",//e91e63
                itemStyle:{
                    marginVertical: 5
                }
            }}
            initialRouteName="Posted Properties">
            <DrawerNavigator.Screen name="Account" component={ UpdateAccountScreen } 
            options={{
                drawerIcon: ()=> <Image source={IMAGES.account} style={{width: 20, height: 20}} />
            }} />
            <DrawerNavigator.Screen name="Posted Properties" component ={ PostedStackScreen } 
                style={{height: 200}} options={{
                    drawerIcon: ()=> <Image source={IMAGES.posted3} style={{width: 20, height: 20}} />
                }} />
            <DrawerNavigator.Screen name="Assumed Properties" component={ AssumedStackScreen } 
                options={{
                    drawerIcon: ()=> <Image source={IMAGES.assume} style={{width: 20, height: 20}} />
                }} />
            <DrawerNavigator.Screen name="FeedBacks" component={ FeedBackStackScreen } 
                options={{
                    drawerIcon: ()=> <Image source={IMAGES.feedback} style={{width: 20, height: 20}} />
                }} />
            <DrawerNavigator.Screen name="Messages" component={ MessagesStackScreen } 
                options={{
                    drawerLabel: ()=><View style={{flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                        <Text style={{color: "#000", opacity: 0.6}}>Messages</Text>
                        <Badge value={messageBadge} status="success">

                        </Badge>
                    </View>,
                    drawerIcon: ()=> <Image source={IMAGES.messages} style={{width: 20, height: 20}} />
                }} />
            <DrawerNavigator.Screen name="Notifications" component={ NotificationStackScreen }
                options={{
                    drawerLabel:()=> <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Text style={{color: "#000", opacity: 0.6}}>Notification</Text>
                        <Badge value={notificationBadge} status="warning">
                        </Badge>
                    </View>,
                    drawerIcon: ()=> <Image source={IMAGES.bell} style={{width: 20, height: 20}} />
                }}
                 />
            <DrawerNavigator.Screen name="Logout" children={()=> <LogOut props={props}/> } 
                options={{drawerIcon: ()=> <Image source={
                    IMAGES.logout
                } style={{width: 20, height: 20}}/>}} />
        </DrawerNavigator.Navigator>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start"
    }
})

export default Accounts