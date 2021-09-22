import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import AdminIndex from './stackItem/adminIndex'
import AdminReports from './stackItem/adminReports'
import AdminHistories from './stackItem/adminHistories'
import AdminTransactionActivities from './stackItem/adminTransactionActs'
import AdminSubscriptions from './stackItem/adminSubscriptions'
import AdminFeedBack from './stackItem/adminFeedBack'
import { Context } from '../../../hooks/context'
const AdminStackNavigator = createStackNavigator()

const AdminStack = (props)=>{
    return(
        <Context.Provider value={props}>
        <AdminStackNavigator.Navigator initialRouteName="Admin DashBoard">
            <AdminStackNavigator.Screen name="Admin DashBoard" component={ AdminIndex } />
            <AdminStackNavigator.Screen name="Admin Reports" component={ AdminReports } />
            <AdminStackNavigator.Screen name="Admin Histories" component={ AdminHistories } />
            <AdminStackNavigator.Screen name="Admin Transactions" component={ AdminTransactionActivities } />
            <AdminStackNavigator.Screen name="Admin Subscriptions" component={ AdminSubscriptions } />
            <AdminStackNavigator.Screen name="Admin FeedBack" component={ AdminFeedBack } />
        </AdminStackNavigator.Navigator>
        </Context.Provider>
    )
}

export default AdminStack