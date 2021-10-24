import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Dimensions, Pressable } from "react-native";
import { defaultStyles, PLACEHOLDER_COLOR } from "../../common/default_styles";
import { margin, padding } from "../../helpers/style_helper"

export default function SignUpScreen() {
    const [login, setLogin] = useState<string>();
    const [password, setPassword] = useState<string>();

    const [loginError, setLoginError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);

    const onSigninPressed = () => {
        let error = false;
        if (!validateEmail(login)) {
            setLoginError(true)
            error = true;
        }

        if (!password) {
            setPasswordError(true)
            error = true;
        }

        if (error) {
            return;
        }

        console.log(`l: ${login}, h: ${password}`);
    }

    const onForgotClicked = () => {
        console.log("Forgot");
    }

    const onNewClicked = () => {
        console.log("New");
    }

    const validateEmail = (email: string | undefined): boolean => {
        const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return email? EMAIL_REGEX.test(email) : false;
    }

    return (
        <View style={styles.container}>
            <View style={styles.texts}>
                <Text style={styles.logoText}>
                    Practice Assistant
                </Text>
                <Text style={[styles.mainText, defaultStyles.standardText]}>
                    Welcome back!
                </Text>
            </View>
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
            <Pressable onPress={onSigninPressed}
                style={defaultStyles.standardButton}>
                <Text style={defaultStyles.buttonText}>Sign In</Text>
            </Pressable>
            <Pressable onPress={onNewClicked}
                style={defaultStyles.linkButton}>
                <Text style={defaultStyles.linkButtonText}>Create new account</Text>
            </Pressable>
            <Pressable onPress={onForgotClicked}
                style={defaultStyles.linkButton}>
                <Text style={defaultStyles.linkButtonText}>Forgot your password?</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        height: Dimensions.get('window').height,
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