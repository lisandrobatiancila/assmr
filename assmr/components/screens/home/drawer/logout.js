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
                    clearTimeout(toRef.current)
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
        return ()=> {
            clearTimeout(toRef.current)
            setIsLoading(toRef.current)
        }
    }, [])
    return(
        <View style={styles.container}>
            {(isLoading && <Loading title="Please wait..." color="#ff8c00" />)}
            <View style={{padding: 10, position: "absolute", top: "80%"}}>
                <Text style={styles.topText}>you will be redirected after a seconds...</Text>
                <View style={{alignSelf: "center"}}>
                    {/* <Text style={styles.bottomText}>please wait...</Text> */}
                    
                    <Text>{email.credentials.useremail}</Text>
                    {/* <Text>{JSON.stringify(email)}</Text> */}
                </View>
                <Button title="logout" onPress={()=> logOut()} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignSelf: "center",
        justifyContent: "center",
        width: "100%",
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