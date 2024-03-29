import { StyleSheet } from "react-native"
import { margin, padding } from "../helpers/style_helper"

export const PLACEHOLDER_COLOR = "#AAA"
export const ALERT_COLOR = "#890423"
export const DARK_COLOR = "#30812C"
export const MIDDLE_COLOR = "#3EA838"
export const LIGHT_COLOR = "#54C64D"
export const BACKGROUND_DARK = "#232323"
export const BACKGROUND_LIGHT = "#3D3D3D"

export const defaultStyles = StyleSheet.create({
    standardButton: {
        backgroundColor: MIDDLE_COLOR,
        borderRadius: 25,
        ...padding(13,32)
    },

    inputView: {
        width: "80%",
        ...margin(10,0),
    },
    
    textInput: {
        fontSize: 20,
        color: "#FFF",
        borderBottomWidth: 1,
        borderBottomColor: "#AAA",
        ...padding(0,0,10,0)
    },

    linkButton: {
        borderBottomWidth:1,
        borderBottomColor: MIDDLE_COLOR,
        ...margin(20,1,1,1)
    },

    linkButtonText: {
        color: LIGHT_COLOR
    },

    buttonText: {
        color: "#FFF",
        fontWeight: "bold"
    },

    standardText: {
        color: "#FFF"
    },

    alertText: {
        color: ALERT_COLOR
    },

    floatingButton: {
        position: "absolute",
        backgroundColor: MIDDLE_COLOR,
        bottom: 25,
        right: 25,
        borderRadius: 100,
        ...padding(10)
    },
    
    switch: {
        ...margin(0,20),
        transform: [
            {scaleX: 1.2},
            {scaleY: 1.2}
        ]
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        ...padding(10,15)
    },
})

