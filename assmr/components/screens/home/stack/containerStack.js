import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
// views
import Posted from "../drawer/posted";
import PostedProperties from '../drawer/posted/postedProperties';
import ShowAssumers from '../drawer/posted/showAssumers';
import EditProperties from '../drawer/posted/editproperties';
import TemporaryNotifications from '../drawer/posted/temporaryNotifications'
import Assumed from "../drawer/assumed";
import AssumedDetails from '../drawer/assumed/assumed_details';
import FeedBack from "../drawer/feedback";
import Messages from '../drawer/messages'
import OpenMessage from '../drawer/message/openmessage';
import Notifications from '../drawer/notifications'
import NotificationDetails from '../drawer/notifications/notificDetails'
import UpdateAccount from '../drawer/updateAccount';
import { NavIcon, LeftArrow } from './navIcon';
import { Button } from 'react-native';

const PostedStack = createStackNavigator()
const AssumedStack = createStackNavigator()
const FeedBackStack = createStackNavigator()
const MessagesStack = createStackNavigator()
const NotificationsStack = createStackNavigator()
const UpdateAccountStack = createStackNavigator()
// stacks screens
export const UpdateAccountScreen = (props)=>{
    return(
        <UpdateAccountStack.Navigator>
            <UpdateAccountStack.Screen name="Account" component={ UpdateAccount } 
            options={{
                headerTitle: ()=> <NavIcon title="account" navigation={props.navigation} />
                
            }} />
        </UpdateAccountStack.Navigator>
    )
}
export const PostedStackScreen = (props)=>{
    return(
        <PostedStack.Navigator initialRouteName="Posted">
            <PostedStack.Screen name="Posted" component = { Posted } 
                options={{
                    headerTitle: ()=> <NavIcon title="posted" navigation={props.navigation} />
                    
                }} />
            <PostedStack.Screen name="Posted Properties" component= { PostedProperties } />
            <PostedStack.Screen name="Edit Properties" component = { EditProperties } />
            <PostedStack.Screen name="Assumers" component={ ShowAssumers } />
            <PostedStack.Screen name="Temporary" component={ TemporaryNotifications } />
        </PostedStack.Navigator>
    )
}

export const AssumedStackScreen = (props)=>{
    return(
        <AssumedStack.Navigator>
            <AssumedStack.Screen name="Assumed" component = { Assumed }
                options={{
                    headerTitle: ()=> <NavIcon title="assumed properties" navigation={props.navigation} />
                }} />
            <AssumedStack.Screen name="Assumed Details" component={AssumedDetails} navigation={props.navigation} />
        </AssumedStack.Navigator>
    )
}

export const FeedBackStackScreen = (props)=>{
    return(
        <FeedBackStack.Navigator>
            <FeedBackStack.Screen name="FeedBack" component={ FeedBack } 
                options={{
                    headerTitle: ()=> <NavIcon title="feedback" navigation={props.navigation} />
                }} />
        </FeedBackStack.Navigator>
    )
}

export const MessagesStackScreen = (props)=>{
    return(
        <MessagesStack.Navigator initialRouteName="Messages">
            <MessagesStack.Screen name="Messages" component={ Messages } 
                options={{
                    headerTitle: ()=> <NavIcon title="messages" navigation={props.navigation} />
                }} />
            <MessagesStack.Screen name="Open Messages" component={ OpenMessage } 
                // options={{
                //     headerTitle: ()=> <LeftArrow title="open messages" navigation={props.navigation} />
                // }}
                navigation = {props.navigation} />
        </MessagesStack.Navigator>
    )
}

export const NotificationStackScreen = (props)=>{
    return(
        <NotificationsStack.Navigator>
            <NotificationsStack.Screen name="Notifications" component={ Notifications } 
                options={{
                    headerTitle: ()=> <NavIcon title="notifications" navigation={props.navigation} />
                }} />
            <NotificationsStack.Screen name="Notification Details" component={ NotificationDetails } />
        </NotificationsStack.Navigator>
    )
}
// end of stacks screens

// drawers