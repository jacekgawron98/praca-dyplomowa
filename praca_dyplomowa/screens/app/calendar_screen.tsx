import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BACKGROUND_LIGHT } from "../../common/default_styles";

export const CalendarScreen = (props: any) => {
    return (
        <View style={styles.container}>
            <Text>Calendar screen</Text>
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