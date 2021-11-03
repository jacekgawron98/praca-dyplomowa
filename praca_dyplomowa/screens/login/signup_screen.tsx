import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Dimensions, Pressable, ActivityIndicator } from "react-native";
import { DARK_COLOR, defaultStyles, PLACEHOLDER_COLOR } from "../../common/default_styles";
import { AuthContext } from "../../contexts/auth-context";
import { isStringEmpty } from "../../helpers/string-helper";
import { AUTH_STACK_ROUTES } from "../../routes/routes_constants";

export default function SignUpScreen({ navigation } : any) {
    const [login, setLogin] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [repeatPassword, setRepeatPassword] = useState<string>();

    const [loginError, setLoginError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [repeatPasswordError, setRepeatPasswordError] = useState<boolean>(false);

    const authContext = useContext(AuthContext)

    const onSignupPressed = () => {
        let error = false;
        if (!validateEmail(login)) {
            setLoginError(true)
            error = true;
        }

        if (!password) {
            setPasswordError(true)
            error = true;
        }

        if (!repeatPassword || repeatPassword !== password) {
            setRepeatPasswordError(true);
            error = true;
        }

        if (error) {
            return;
        }

        authContext.signup(login,password);
    }

    const onExistClicked = () => {
        console.log("New");
        navigation.push(AUTH_STACK_ROUTES.signinRoute)
    }

    const validateEmail = (email: string | undefined): boolean => {
        const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return email? EMAIL_REGEX.test(email) : false;
    }

    useEffect(() => {
        const resetError = navigation.addListener('blur', () =>{
            authContext.resetError();
        })
        return resetError;
    },[navigation])

    return (
        <View style={styles.container}>
            <View style={styles.texts}>
                <Text style={styles.logoText}>
                    Practice Assistant
                </Text>
                <Text style={[styles.mainText, defaultStyles.standardText]}>
                    Create new account
                </Text>
            </View>
            {
                !isStringEmpty(authContext.error) && <View>
                    <Text style={defaultStyles.alertText}>{authContext.error}</Text>
                </View>
            }
            <View style={defaultStyles.inputView}>
                <TextInput value={login} 
                    onChangeText={text => {setLogin(text); setLoginError(false)}} 
                    placeholder="Enter your email"
                    placeholderTextColor={PLACEHOLDER_COLOR}
                    style={defaultStyles.textInput}/>
                {loginError && <Text style={defaultStyles.alertText}>Email is invalid</Text>}
            </View>
            <View style={defaultStyles.inputView}>
                <TextInput value={password} 
                    onChangeText={text => {setPassword(text);setPasswordError(false)}}
                    placeholder="Enter your password"
                    placeholderTextColor={PLACEHOLDER_COLOR}
                    secureTextEntry={true}
                    style={defaultStyles.textInput}/>
                {passwordError && <Text style={defaultStyles.alertText}>Password cannot be empty</Text>}
            </View>
            <View style={defaultStyles.inputView}>
                <TextInput value={repeatPassword} 
                    onChangeText={text => {setRepeatPassword(text);setRepeatPasswordError(false)}}
                    placeholder="Repeat password"
                    placeholderTextColor={PLACEHOLDER_COLOR}
                    secureTextEntry={true}
                    style={defaultStyles.textInput}/>
                {repeatPasswordError && <Text style={defaultStyles.alertText}>Passwords do not match</Text>}
            </View>
            {
                !authContext.loading && <Pressable onPress={onSignupPressed}
                    style={defaultStyles.standardButton}>
                    <Text style={defaultStyles.buttonText}>Sign Up</Text>
                </Pressable>
            }
            {
                authContext.loading && <ActivityIndicator size="large" color={DARK_COLOR}/>
            }
            <Pressable onPress={onExistClicked}
                style={defaultStyles.linkButton}>
                <Text style={defaultStyles.linkButtonText}>I already have an account</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#232323",
        display: "flex",
        height: Dimensions.get('window').height + 100,
        justifyContent: "center",
        alignItems: "center",
    },
    
    logoText: {
        fontWeight: "bold",
        fontSize: 40,
        color: "#FFF"
    },

    texts: {
        display: "flex",
        alignItems: "center",
        padding: "5%",
        color: "#FFF"
    },

    mainText: {
        fontSize: 25
    },
})