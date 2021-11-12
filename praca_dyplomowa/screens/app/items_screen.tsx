import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ListRenderItemInfo, Alert, Modal, Text, FlatList, Pressable } from "react-native";
import { BACKGROUND_DARK, BACKGROUND_LIGHT, defaultStyles, MIDDLE_COLOR } from "../../common/default_styles";
import { AuthContext } from "../../contexts/auth-context";
import * as itemsService from "../../services/items-service";
import { margin, padding } from "../../helpers/style_helper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ListItem } from "../../components/list_items";
import { showConfirmAlert, showInfoAlert } from "../../helpers/alerts";
import { useIsFocused } from "@react-navigation/core";

const ICON_SIZE = 40

export const ItemsScreen = (props: any) => {
    const [items, setItems] = useState<PracticeItem[]>([]);
    const authContext = useContext(AuthContext);
    const isFocused = useIsFocused();

    useEffect(() => {
        const getItems = async () => {
            if (authContext.account?._id && authContext.token) {
                try {
                    const fetchedItems = await itemsService.getItems(authContext.account?._id, authContext.token);
                    setItems(fetchedItems);
                }catch (error: any) {
                    console.log(error);
                }
            }
        }
        getItems();
    },[isFocused])

    const onAddClicked = () => {
        props.navigation.navigate("ItemFormScreen",{})
    }

    const onItemDeleteClicked = async (itemId?: string) => {
        if (!itemId) return;
        const result = await showConfirmAlert("Delete item", "Are you sure you want to delete this item? It will be deleted from every set!");
        if (result && authContext.token) {
            itemsService.deleteItem(itemId, authContext.token).then(result => {
                if (result) {
                    const newItems = items.filter(item => item._id !== itemId);
                    setItems(newItems);
                } else {
                    showInfoAlert("Error", "Cannot delete item. Try again later.");
                }
            })
        }
        console.log(`Delete: ${itemId}`);
    }

    const listItem = (item: ListRenderItemInfo<PracticeItem>) => (
        <ListItem navigation={props.navigation} item={item.item} onDeleteClicked={() => onItemDeleteClicked(item.item._id)}></ListItem>
    )

    return (
        <View style={styles.container}>
            {items.length === 0 && <Text>You dont have any items</Text>}
            {items && <FlatList
                data={items}
                renderItem={listItem}
                keyExtractor={item => item._id? item._id : item.name + Date.now()}
            />}
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
    },
})