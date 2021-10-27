import React from "react";
import { createStackNavigator } from "@react-navigation/stack"
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { HomeScreen } from "../screens/app/home_screen";
import { CalendarScreen } from "../screens/app/calendar_screen";

const stack = createStackNavigator();

export const AppStack = () => {
    return (
        <stack.Navigator>
            <stack.Screen name="HomeScreen" 
                component={HomeScreen}
                options={{
                    headerShown: false
                }}/>
        </stack.Navigator>
    )
}