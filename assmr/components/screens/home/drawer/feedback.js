import * as React from 'react'
import { View, Image, Text, StyleSheet, TextInput, 
    Keyboard, TouchableWithoutFeedback, AsyncStorage,
    ScrollView, TouchableOpacity, FlatList, Alert, Button,
    ImageBackground } from 'react-native'
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button'
import axios from 'axios'
import { Formik } from 'formik'
import * as yup from 'yup'
import { IMAGES } from '../../../../assets/assets'
import { Context } from '../../../../hooks/context'

const FeedBack = (props)=>{
    const userCredentials = React.useContext(Context)
    const [clickedStar, setClickStar] = React.useState(0)
    const [closeFeedBackForm, setCloseFeedBackForm] = React.useState(false)
    const [postedFeedBack, setPostedFeedBack] = React.useState(null)
    const schema = yup.object().shape({
        comment: yup.string().min(5, "Too short!").required("Required")
    })
    const radioLabel = [
        {label: "Very satisfied"},
        {label: "Satisfied"},
        {label: "Not satisfied"}
    ]
    const retrieveAsyncStorage = async()=>{
        const serverIp = await AsyncStorage.getItem("serverIp")
        const imagePort = await AsyncStorage.getItem("imagePort")

        return [serverIp, imagePort]
    }
    React.useEffect(()=>{
        retrieveAsyncStorage()
            .then((PORTS)=>{
                axios.get(`http://${PORTS[0]}:1010/feedbacks/get-users-feedbacks`)
                    .then((response)=>{
                        setPostedFeedBack(response.data.response)
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
            })
            .catch((err)=>{
                console.log(err)
            })
    }, [closeFeedBackForm])
    return(
        <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
            <View>
            {
                (!closeFeedBackForm &&
                    <ScrollView>
                        <View style={[{padding: 5}, {flex: 1, flexDirection: "column", marginVertical: 3}]}>
                            <View style={styles.card}>
                                <View style={[styles.giveFB, {backgroundColor: "#4ECDC4", 
                                    flexDirection: "row", justifyContent: "flex-end", justifyContent: "space-around"}]}>
                                    <Text style={[styles.fbText, styles.fbTextCenter]}>
                                        give us feedback
                                    </Text>
                                    <TouchableOpacity onPress={()=> {
                                            setCloseFeedBackForm(!closeFeedBackForm)
                                            setClickStar(0)
                                        }}>
                                        <Image source={IMAGES.close} resizeMode="contain" 
                                            style={{width: 15, height: 15, marginTop: 5 }} />
                                    </TouchableOpacity>
                                </View>
                                <Formik initialValues={{satisfaction: radioLabel[0].label, 
                                    rating: 0, comment: "", userid: userCredentials.credentials.userid}} 
                                    validationSchema={schema}
                                    onSubmit={(values, { resetForm })=>{
                                        retrieveAsyncStorage()
                                            .then(async(PORTS)=>{
                                                axios.post(`http://${PORTS[0]}:1010/feedbacks/users-feedbacks`,
                                                    values
                                                )
                                                    .then((response)=>{
                                                        Alert.alert(
                                                            'Message',
                                                            response.data.response
                                                        )
                                                        resetForm()
                                                    })
                                                    .catch((err)=>{
                                                        console.log(err)
                                                    })
                                            })
                                            .catch((err)=>{
                                                console.log(err)
                                            })
                                    }}>
                                    {
                                        (props)=>
                                            <View style={{padding: 5}}>
                                                <View>
                                                    <Text style={styles.fbText}>how satisfied are you</Text>
                                                    <RadioForm
                                                        radio_props={radioLabel}
                                                        value={props.values.satisfaction}
                                                        onPress={(value, index)=> {
                                                            props.values.satisfaction = radioLabel[index].label
                                                        }}
                                                    />
                                                </View>
                                                <View>
                                                    <Text style={styles.fbText}>rate us</Text>
                                                    <View style={{flexDirection: "row", flexWrap: "wrap", 
                                                        marginVertical: 5, justifyContent: "center"}}>
                                                        <TouchableOpacity style={styles.starFB} onPress={
                                                            ()=> {
                                                                setClickStar(1)
                                                                props.values.rating = 1
                                                            }
                                                        }>
                                                            <Image source={(clickedStar > 0)?IMAGES.starcolor:IMAGES.stardefault} resizeMode="contain"
                                                                style={{width: 30, height: 30}} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={styles.starFB} onPress={
                                                            ()=> {
                                                                setClickStar(2)
                                                                props.values.rating = 2
                                                            }
                                                        }>
                                                            <Image source={(clickedStar > 1)?IMAGES.starcolor:IMAGES.stardefault} resizeMode="contain"
                                                                style={{width: 30, height: 30}} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={styles.starFB} onPress={
                                                            ()=> {
                                                                setClickStar(3)
                                                                props.values.rating = 3
                                                            }
                                                        }>
                                                            <Image source={(clickedStar > 2)?IMAGES.starcolor:IMAGES.stardefault} resizeMode="contain"
                                                                style={{width: 30, height: 30}} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={styles.starFB} onPress={
                                                            ()=> {
                                                                setClickStar(4)
                                                                props.values.rating = 4
                                                            }
                                                        }>
                                                            <Image source={(clickedStar > 3)?IMAGES.starcolor:IMAGES.stardefault} resizeMode="contain"
                                                                style={{width: 30, height: 30}} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={styles.starFB} onPress={
                                                            ()=> {
                                                                setClickStar(5)
                                                                props.values.rating = 5
                                                            }
                                                        }>
                                                            <Image source={(clickedStar > 4)?IMAGES.starcolor:IMAGES.stardefault} resizeMode="contain"
                                                                style={{width: 30, height: 30}} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                <View>
                                                    <View style={{flexDirection: "row"}}>
                                                        <Text style={styles.fbText}>comment</Text>
                                                        <Text style={{marginHorizontal: 10, marginTop: 5, color: "#ff471a"}}>
                                                            {props.touched.comment && props.errors.comment}
                                                        </Text>
                                                    </View>
                                                    <TextInput multiline={true} 
                                                        style={styles.fbTextInput} 
                                                        placeholder="Leave a message to us..."
                                                        value={props.values.comment}
                                                        onChangeText={props.handleChange('comment')}
                                                        onBlur={props.handleBlur("comment")} />
                                                </View>
                                                <View style={{marginVertical: 3}}>
                                                    <TouchableOpacity style={[styles.fbButtonOP, {backgroundColor: "#5cb85c"}]}
                                                        onPress={props.handleSubmit}>
                                                        <Text style={[styles.fbTextCenter, {textTransform: "capitalize"}]}>
                                                            submit
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[styles.fbButtonOP, {backgroundColor: "#337ab7"}]}>
                                                        <Text style={[styles.fbTextCenter, {textTransform: "capitalize"}]}>cancel</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        
                                    }
                                </Formik>
                            </View>
                    </View>
                </ScrollView>    
                )
            }
            {
                (closeFeedBackForm &&
                    <ImageBackground source={IMAGES.assmer_logo}
                        style={{width: "100%", height: "100%", opacity: 0.9}}>
                    <View style={{height: "100%"}}>
                        <FlatList data={postedFeedBack}
                            keyExtractor={(item)=> item.feedbackid}
                            renderItem={({item})=>
                                <TouchableOpacity>
                                    <View key={item.feedbackid} style={{padding: 3}}>
                                        <View style={[styles.card, {padding: 10}]}>
                                            <View style={{flexDirection: "row", marginVertical: 3}}>
                                                <Image source={IMAGES.user} resizeMode="contain"
                                                    style={{width: 50, height: 50}} /> 
                                                    <View style={{flexDirection: "column", marginHorizontal: 10}}>
                                                        <Text style={{fontSize: 18, fontWeight: "bold"}}>{item.userlastname}, {item.userfirstname}</Text>
                                                        <Text style={{fontSize: 16}}>{item.feedbackcomment}</Text>
                                                        <View style={{flexDirection: "row", marginVertical: 10}}>
                                                            <Image source={(item.feedbackrating > 0)?IMAGES.starcolor:IMAGES.stardefault} 
                                                                style={styles.starSize} />  
                                                            <Image source={(item.feedbackrating > 1)?IMAGES.starcolor:IMAGES.stardefault} 
                                                                style={styles.starSize} />  
                                                            <Image source={(item.feedbackrating > 2)?IMAGES.starcolor:IMAGES.stardefault} 
                                                                style={styles.starSize} />  
                                                            <Image source={(item.feedbackrating > 3)?IMAGES.starcolor:IMAGES.stardefault} 
                                                                style={styles.starSize} />  
                                                            <Image source={(item.feedbackrating > 4)?IMAGES.starcolor:IMAGES.stardefault} 
                                                                style={styles.starSize} /> 
                                                        </View>
                                                        <Text
                                                            style={{textTransform: "capitalize", fontSize: 12}}>
                                                                date: {item.date}
                                                        </Text>
                                                    </View>
                                            </View> 
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            } />
                        <TouchableOpacity onPress={()=> setCloseFeedBackForm(!closeFeedBackForm)} >
                        <View style={styles.addButtonFB}>
                            <Image source={IMAGES.add} resizeMode="contain" 
                                style={{width: 20, height: 20, alignSelf: "center"}} />
                        </View>
                    </TouchableOpacity>
                    </View>
                    </ImageBackground>
                )
            }
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    card:{
        backgroundColor: "#fff",
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 3},
        elevation: 3,
        marginVertical: 3,
    },
    fbTextInput:{
        backgroundColor: "#ccc",
        borderRadius: 3,
        paddingLeft: 5
    },
    fbText:{
        textTransform: "capitalize",
        fontSize: 22
    },
    fbTextCenter: {
        textAlign: "center",
        color: "#fff",
        fontSize: 16
    },
    giveFB: {
        backgroundColor: "#ccc",
        padding: 10
    },
    starFB: {
        marginHorizontal: 5
    },
    fbButtonOP: {
        padding: 10,
        borderRadius: 3,
    },
    starSize: {
        width: 25,
        height: 25,
        marginHorizontal: 3
    },
    addButtonFB: {
        backgroundColor: "#e91e63",
        width: 50,
        height: 50,
        borderRadius: 50,
        shadowColor: "#000",
        elevation: 3,
        shadowOffset: { width: 2, height: 5},
        padding: 10,
        alignSelf: "flex-end",
        justifyContent: "center",
        flexDirection: "column"
    }
})
export default FeedBack