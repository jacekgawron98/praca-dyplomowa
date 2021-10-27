import React from 'react';
import { StackActions } from '@react-navigation/routers';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../screens/login/signin_screen';
import SignUpScreen from '../screens/login/signup_screen';
import { AUTH_STACK_ROUTES } from './routes_contants';

const stack = createStackNavigator()

export const AuthStack = () => {
    return (
        <stack.Navigator>
            <stack.Screen 
                name={AUTH_STACK_ROUTES.signinRoute}
                component={SignInScreen}
                options={{
                    headerShown: false
                }}
            />
            <stack.Screen
                name={AUTH_STACK_ROUTES.signupRoute}
                component={SignUpScreen}
                options={{
                    headerShown: false
                }}
            />

        </stack.Navigator>
    )
}