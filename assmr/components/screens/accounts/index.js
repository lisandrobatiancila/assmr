import React from "react";
import { NativeRouter, Route } from "react-router-native";
import Login from './login'
import Signup from './signup'

const Index = ({ credentials, setCredentials })=>{
    const [openModal, setOpenModal] = React.useState(true)
    
    return(
        <NativeRouter>
            <Route exact path="/" component= {()=> (
                <Login credentials={credentials} setCredentials={setCredentials}
                openModal={openModal} setOpenModal={setOpenModal} />)
                } />
            <Route path="/signup" component= { Signup } />
        </NativeRouter>
    )
}
export default Index