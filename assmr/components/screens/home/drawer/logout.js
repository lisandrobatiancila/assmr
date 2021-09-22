import * as React from 'react'
import { View, Text, Button, Alert, StyleSheet } from 'react-native'
import Loading from '../../loading/loading'
import { Context } from '../../../../hooks/context'

const LogOut = (props)=>{
    const email = React.useContext(Context)
    const toRef = React.useRef()
    const [isLoading, setIsLoading] = React.useState(true)
    const logOut = ()=>{
        Alert.alert(
            'log out',
            'are you sure',
            [
                {text: 'cancel', onPress: ()=> {
                    setIsLoading(true)
                    props.props.navigation.navigate("Posted Properties")
                }},
                {text: 'confirm', onPress: ()=>{
                    email.setCredentials({userid: 0, useremail: '', userType: ''})
                }}
            ],
            {cancelable: false}
        )
    }
    React.useEffect(()=>{
        const TO = setTimeout(()=>{
            email.setCredentials({userid: 0, useremail: '', userType: ''})
            setIsLoading(false)
        }, 3000)
        toRef.current = TO
        return ()=> setIsLoading(toRef.current)
    }, [])
    return(
        <View style={styles.container}>
            {(isLoading && <Loading title="Please wait..." color="#000" />)}
            <View>
                <Text style={styles.topText}>you will be redirected after a seconds...</Text>
                <View style={{alignSelf: "center"}}>
                    {/* <Text style={styles.bottomText}>please wait...</Text> */}
                    
                    <Text>{email.credentials.useremail}</Text>
                    {/* <Text>{JSON.stringify(email)}</Text> */}
                </View>
            </View>
            <Button title="logout" onPress={()=> logOut()} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        padding: 10,
        alignSelf: "center",
        justifyContent: "center"
    },
    topText: {
        fontSize: 16,
        textTransform: "capitalize",
        marginVertical: 5
    },
    bottomText: {
        textTransform: "capitalize",
        fontSize: 22,
        fontWeight: "bold",
        marginVertical: 5
    }
})
export default LogOut