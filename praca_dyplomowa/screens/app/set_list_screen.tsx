import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BACKGROUND_LIGHT, defaultStyles } from "../../common/default_styles";

const ICON_SIZE = 40

export const SetListScreen = (props: any) => {

    const onAddClicked = () => {
        props.navigation.navigate("SetFormScreen",{})
    }

    return (
        <View style={styles.container}>
            <Pressable onPress={onAddClicked}
                style={defaultStyles.floatingButton}>
                <MaterialIcons name="add" color={"#fff"} size={ICON_SIZE}/>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: BACKGROUND_LIGHT
    }
})