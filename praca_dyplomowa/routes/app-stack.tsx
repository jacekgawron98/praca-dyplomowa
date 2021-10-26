import React from "react";
import { createStackNavigator } from "@react-navigation/stack"
import { HomeScreen } from "../screens/app/home_screen";

const stack = createStackNavigator();

export const AppStack = () => {
    return (
        <stack.Navigator>
            <stack.Screen name="App screen" component={HomeScreen}></stack.Screen>
        </stack.Navigator>
    )
}