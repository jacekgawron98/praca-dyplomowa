import React from 'react';
import { StackActions } from '@react-navigation/routers';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from '../screens/login/signup_screen';

const stack = createStackNavigator()

export const AuthStack = () => {
    return (
        <stack.Navigator>
            <stack.Screen 
                name="Sign In Screen" 
                component={SignUpScreen}
                options={{
                    headerShown: false
                }}
            />
        </stack.Navigator>
    )
}