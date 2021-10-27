import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import React from "react";
import { View, Text } from "react-native";
import { CalendarScreen } from "./calendar_screen";
import { ItemsScreen } from "./items_screen";
import { ProfileScreen } from "./profile_screen";
import { SetListScreen } from "./set_list_screen";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { StatisticsScreen } from "./statistics_screen";

const Tab = createMaterialBottomTabNavigator();

const ICON_SIZE = 22

export const HomeScreen = (props: any) => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="CalendarScreen" component={CalendarScreen}
                options={{
                    tabBarLabel: 'Calendar',
                    tabBarIcon: ({ color }) => (
                      <MaterialIcons name="calendar-today" color={color} size={ICON_SIZE}/>  
                    ),
                }}/>
            <Tab.Screen name="SetsScreen" component={SetListScreen}
                options={{
                    tabBarLabel: 'My sets',
                    tabBarIcon: ({ color }) => (
                      <MaterialIcons name="list-alt" color={color} size={ICON_SIZE}/>  
                    ),
                }}/>
            <Tab.Screen name="ItemsScreen" component={ItemsScreen}
                options={{
                    tabBarLabel: 'My items',
                    tabBarIcon: ({ color }) => (
                    <MaterialIcons name="inventory" color={color} size={ICON_SIZE}/>  
                    ),
                }}/>
            <Tab.Screen name="StatisticsScreen" component={StatisticsScreen}
                options={{
                    tabBarLabel: 'Stats',
                    tabBarIcon: ({ color }) => (
                    <MaterialIcons name="insights" color={color} size={ICON_SIZE}/>  
                    ),
                }}/>
            <Tab.Screen name="ProfileScreen" component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => (
                      <MaterialIcons name="person" color={color} size={ICON_SIZE}/>  
                    ),
                }}/>
        </Tab.Navigator>
    )
}