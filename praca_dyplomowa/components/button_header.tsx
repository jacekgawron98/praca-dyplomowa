import React from "react";
import { Pressable, View, Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { defaultStyles } from "../common/default_styles";

const ICON_SIZE = 32

export const ButtonHeader = (props: any) => {
    const onReturnClicked = () => {
        props.navigation.goBack();
    }

    return (
        <View style={defaultStyles.header}>
            <View>
                <Pressable onPress={props.onReturnClicked? props.onReturnClicked : onReturnClicked}>
                    <MaterialIcons name="chevron-left" color={"#fff"} size={ICON_SIZE}/>
                </Pressable>
            </View>
            <View>
                <Pressable onPress={props.onButtonClicked}
                    style={defaultStyles.standardButton}>
                    <Text style={defaultStyles.buttonText}>{props.buttonText}</Text>
                </Pressable>
            </View>
        </View>
    )
}