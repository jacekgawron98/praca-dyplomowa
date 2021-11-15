import React, { useContext } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { BACKGROUND_LIGHT, defaultStyles } from "../../common/default_styles";
import { AuthContext } from "../../contexts/auth-context";

export const ProfileScreen = (props: any) => {
    const authContext = useContext(AuthContext);
    
    const onSignoutClicked = async () => {
        await authContext.signout();
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.mainContent}>
                <View>
                    <Text style={[defaultStyles.standardText,{fontSize: 24}]}>Signed as</Text>
                    <Text style={[defaultStyles.standardText,{fontSize: 24}]}>{authContext.account?.login}</Text>
                </View>
                <View>
                    <Pressable onPress={onSignoutClicked}
                        style={defaultStyles.standardButton}>
                        <Text style={defaultStyles.buttonText}>Sign out</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.history}>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: BACKGROUND_LIGHT
    },

    mainContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    history: {

    }
})