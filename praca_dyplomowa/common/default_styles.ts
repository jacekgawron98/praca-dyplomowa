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
        ...padding(13,13,32,32)
    },

    inputView: {
        width: "80%",
        ...margin(10,10,0,0),
    },
    
    textInput: {
        fontSize: 20,
        color: "#FFF",
        borderBottomWidth: 1,
        borderBottomColor: "#AAA",
        ...padding(0,10,0,0)
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
    }
})

