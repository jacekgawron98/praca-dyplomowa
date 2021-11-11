import React from "react";
import { createStackNavigator } from "@react-navigation/stack"
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { HomeScreen } from "../screens/app/home_screen";
import { CalendarScreen } from "../screens/app/calendar_screen";
import { ItemFormScreen } from "../screens/app/item_form_screen";
import { SetFormScreen } from "../screens/app/set_form_screen";
import { ExerciseScreen } from "../screens/app/exercise_screen";

const stack = createStackNavigator();

export const AppStack = () => {
    return (
        <stack.Navigator>
            <stack.Screen name="HomeScreen" 
                component={HomeScreen}
                options={{
                    headerShown: false
                }}/>
            <stack.Screen name="ItemFormScreen"
                component={ItemFormScreen}
                options={{
                    headerShown: false
                }}
            />
            <stack.Screen name="SetFormScreen"
                component={SetFormScreen}
                options={{
                    headerShown: false
                }}
            />
            <stack.Screen name="ExerciseScreen"
                component={ExerciseScreen}
                options={{
                    headerShown: false
                }}
            />
        </stack.Navigator>
    )
}