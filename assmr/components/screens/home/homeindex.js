import * as React from 'react'
import { Image, Text, AsyncStorage } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import axios from 'axios'
import Realestate from './tabs/realestates/realestate'
import Vehicles from './tabs/vehicles/vehicles'
import Accounts from './tabs/accounts'
import { IMAGES } from '../../../assets/assets'
import Jewelries from './tabs/jewlries/jewelries'
import { Context } from '../../../hooks/context'
import Index from '../accounts/index'
import { NotificPopUp } from '../../../notificPopUp/notificPopUp'
import { isReadyRef, navigationRef } from '../../../RootNavigation/RootNavigation'
import PushNotification, { Importance } from 'react-native-push-notification'
import { NativeBaseProvider } from 'native-base'
import AdminStack from '../admin/adminStack'

const TabNavigator = createBottomTabNavigator()

const HomeIndex = (props)=>{
    const [tabStatus, setTabStatus] = React.useState(true)

    const retrieveAsyncStorage = async()=>{
        const serverIp = await AsyncStorage.getItem("serverIp")
        const imagePort = await AsyncStorage.getItem("imagePort")

        return [serverIp, imagePort]
    }
    const infiniteNotifications = ()=>{
        var stoID = setTimeout(()=>{
            //  console.log('infinite')
             retrieveAsyncStorage()
                 .then((PORTS)=>{
                     axios.post(`http://${PORTS[0]}:1010/notifications/user-popup-notifications`,
                         {useremail: props.credentials.useremail}
                     )//for user messages and notifications ("POP-UP")
                     .then(async(response)=>{
                         const serverNotifications = response.data.response 
                         //messages and notifications
                         const allProperties = JSON.parse(await AsyncStorage.getItem("allProperties"))
                         const matchingInfos = JSON.parse(await AsyncStorage.getItem("allMatchingInfos"))

                         NotificPopUp(navigationRef, serverNotifications, allProperties, matchingInfos)
                     })
                     .catch((err)=>{
                         console.log(`aP: `+err.message)
                     })
                 })
                 .catch((err)=>{
                     console.log(`rAS: `+err.message)
                 })
             infiniteNotifications()
         }, 5000)
         return stoID
     }
     const setChannelId = ()=>{
         PushNotification.createChannel(
             {
               channelId: "com.assmr", // (required)
               channelName: "com.assmr", // (required)
               channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
               playSound: false, // (optional) default: true
               soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
               importance: 4, // (optional) default: 4. Int value of the Android notification importance
               vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
             },
             (created) =>{ 
                 console.log(`createChannel returned '${created}'`)
             } // (optional) callback returns whether the channel was created, false means it already existed.
           );
     }
     React.useEffect(()=>{
        setChannelId()
        infiniteNotifications()
        retrieveAsyncStorage()
            .then((PORTS)=>{
                axios.post(`http://${PORTS[0]}:1010/notifications/get-all-posted-properties`,
                    {userID: props.credentials.userid}
                )
                .then(async(response)=>{
                    await AsyncStorage.setItem("allProperties", 
                        JSON.stringify(response.data.response.properties))
                    await AsyncStorage.setItem("allMatchingInfos", 
                        JSON.stringify(response.data.response.matchingInfos))
                    //both used for user-specifications pop up notifications
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
            <NavigationContainer ref={navigationRef} onReady={
                ()=>{ isReadyRef.current = true}
            }>
                <NativeBaseProvider>
                {(props.credentials.userType === "user" )?
                    <Context.Provider value={{credentials: props.credentials, setCredentials: props.setCredentials}}>
                    {
                        (props.credentials.useremail !== "")?
                            <TabNavigator.Navigator initialRouteName="Jewelries">
                                <TabNavigator.Screen name="Jewelries" component={ Jewelries } options={{
                                    tabBarIcon: ()=> (<Image source={ IMAGES.jewelry } resizeMode="contain"
                                    style={{ width: 20, height: 20}} />)
                                    }}/>
                                <TabNavigator.Screen name="Realestate" component={ Realestate } 
                                    options={{
                                        tabBarIcon: ()=> (<Image source={IMAGES.house} resizeMode="contain"
                                        style={{width: 20, height: 20}} />)
                                    }} />
                                <TabNavigator.Screen name="Vehicle" component={ Vehicles }
                                    options={{
                                        tabBarIcon: ()=> (<Image source={ IMAGES.car} resizeMode="contain"
                                        style={{ width: 20, height: 20}} />)
                                    }} />
                                <TabNavigator.Screen name="Account" component={ Accounts }
                                    options={{
                                        tabBarIcon: ()=>(<Image source={IMAGES.user}
                                        resizeMode="contain" style={{ width: 20, height: 20}} />),
                                        tabBarVisible: false
                                    }}/>
                        </TabNavigator.Navigator>
                    :
                    <Index />
                    }
                    </Context.Provider>
                :
                    <AdminStack userCredentials = {props}/>
                }
            </NativeBaseProvider>
        </NavigationContainer>
    )
}

export default HomeIndex