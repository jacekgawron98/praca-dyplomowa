import React, { useContext } from "react";
import { View, Text, Pressable } from "react-native";
import { defaultStyles } from "../../common/default_styles";
import { AuthContext } from "../../contexts/auth-context";

export const ProfileScreen = (props: any) => {
    const authContext = useContext(AuthContext);
    
    const onSignoutClicked = async () => {
        await authContext.signout();
    }
    
    return (
        <View>
            <Text>Profile screen</Text>
            <Pressable onPress={onSignoutClicked}
                style={defaultStyles.standardButton}>
                <Text style={defaultStyles.buttonText}>Sign out</Text>
            </Pressable>
        </View>
    )
}