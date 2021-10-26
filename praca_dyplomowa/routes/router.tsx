import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { useAuth } from "../contexts/auth-context"
import { AppStack } from "./app-stack"
import { AuthStack } from "./auth-stack"

export const Router = () => {
    const { token } = useAuth();

    return (
        <NavigationContainer>
            {token ? <AppStack/> : <AuthStack/>}
        </NavigationContainer>
    )
}