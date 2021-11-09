import React from "react";
import { View, Text, Pressable, Dimensions, StyleSheet, GestureResponderEvent } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BACKGROUND_DARK, defaultStyles } from "../common/default_styles";
import { margin, padding } from "../helpers/style_helper";

const ICON_SIZE = 28

interface ListSetProps {
    set: PracticeSet
    navigation: any
    onDeleteClicked?: (event: GestureResponderEvent) => void
}

export const ListSet = (props: ListSetProps) => {

    const onSetEditClicked = (setId?: string) => {
        if (!setId) return;
        console.log(`Edit: ${setId}`);
        props.navigation.navigate("SetFormScreen",{set: props.set})
    }

    const printTime = (hour: number, minute: number): string => {
        const h = hour < 10? `0${hour}` : hour.toString();
        const m = minute < 10? `0${minute}` : minute.toString();
        return `${h}:${m}`
    }

    return (
        <View style={styles.listItem}>
            <View style={styles.content}>
                <Text style={[defaultStyles.standardText, styles.itemName]}>{props.set.name}</Text>
                <Text style={[defaultStyles.standardText, {fontSize: 16}]}>{props.set.items.length} exercises</Text>
                {props.set.plannedTime && <Text style={[defaultStyles.standardText, {fontSize: 16}]}>
                    Scheduled on {props.set.plannedTime.day}, {printTime(props.set.plannedTime.hour,props.set.plannedTime.minute)} 
                </Text>}
            </View>
            <View style={styles.listItemButtons}>
                <Pressable onPress={() => onSetEditClicked(props.set._id)}>
                    <MaterialIcons name="edit" color={"#fff"} size={ICON_SIZE}/>
                </Pressable>
                <Pressable onPress={props.onDeleteClicked}>
                    <MaterialIcons name="delete" color={"#e33"} size={ICON_SIZE}/>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    listItem: {
        width: Dimensions.get('window').width * 0.9,
        flex:1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: BACKGROUND_DARK,
        borderRadius: 15,
        ...padding(10),
        ...margin(10,5,0)
    },

    content: {
        flexShrink: 3
    },

    listItemButtons: {
        flexShrink: 1,
        flexDirection: "row"
    },

    itemName: {
        fontSize: 24
    },

    tagsList: {
        flexDirection: "row",
        flexWrap: "wrap"
    },

    tag: {
        backgroundColor: "#54C64D",
        borderRadius: 5,
        ...padding(5),
        ...margin(3,0,0,3)
    }
})