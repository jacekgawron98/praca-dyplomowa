import React from "react";
import { ListRenderItemInfo, View, Text, Pressable, Dimensions, StyleSheet, GestureResponderEvent } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BACKGROUND_DARK, BACKGROUND_LIGHT, defaultStyles } from "../common/default_styles";
import { margin, padding } from "../helpers/style_helper";

const ICON_SIZE = 28

interface ListItemProps {
    item: PracticeItem
    navigation: any
    isAdder?: boolean
    onDeleteClicked?: (event: GestureResponderEvent) => void
    onAddClicked?: (event: GestureResponderEvent) => void
}

export const ListItem = (props: ListItemProps) => {

    const onItemEditClicked = (itemId?: string) => {
        if (!itemId) return;
        console.log(`Edit: ${itemId}`);
        props.navigation.navigate("ItemFormScreen",{item: props.item})
    }

    const tagsList = props.item.tags?.map((tag) => (
        <View style={styles.tag} key={tag}>
            <Text style={defaultStyles.standardText}>{tag}</Text>
        </View>
    ))

    return (
        <View style={styles.listItem}>
            <View style={styles.content}>
                <Text style={[defaultStyles.standardText, styles.itemName]}>{props.item.name}</Text>
                {props.item.repeats && <Text style={defaultStyles.standardText}>Repeats: {props.item.repeats}</Text>}
                {props.item.duration && <Text style={defaultStyles.standardText}>Duration: {props.item.duration} seconds</Text>}
                <View style={styles.tagsList}>
                    {tagsList}
                </View>
            </View>
            {!props.isAdder &&
            <View style={styles.listItemButtons}>
                    <Pressable onPress={() => onItemEditClicked(props.item._id)}>
                        <MaterialIcons name="edit" color={"#fff"} size={ICON_SIZE}/>
                    </Pressable>
                    <Pressable onPress={props.onDeleteClicked}>
                        <MaterialIcons name="delete" color={"#e33"} size={ICON_SIZE}/>
                    </Pressable>
            </View>}
            {props.isAdder &&
            <View style={styles.listItemButtons}>
                <Pressable onPress={props.onAddClicked}>
                    <MaterialIcons name="add" color={"#fff"} size={ICON_SIZE}/>
                </Pressable>
            </View>}
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
        fontSize: 20
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