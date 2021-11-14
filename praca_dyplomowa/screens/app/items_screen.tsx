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
import { ItemFilters } from "../../components/item_filters";

const ICON_SIZE = 40

export const ItemsScreen = (props: any) => {
    const [items, setItems] = useState<PracticeItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<PracticeItem[]>([]);
    const [tagsFilter, setTagsFilter] = useState<string[]>([]);
    const [textFilter, setTextFilter] = useState<string>("");

    const authContext = useContext(AuthContext);
    const isFocused = useIsFocused();

    useEffect(() => {
        const getItems = async () => {
            if (authContext.account?._id && authContext.token) {
                try {
                    const fetchedItems = await itemsService.getItems(authContext.account?._id, authContext.token);
                    setItems(fetchedItems);
                    setFilteredItems(fetchedItems);
                }catch (error: any) {
                    console.log(error);
                }
            }
        }
        getItems();
    },[isFocused])

    useEffect(() => {
        applyFilters(tagsFilter,textFilter);
    }, [textFilter,tagsFilter])

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
                    const newFiltered = items.filter(item => item._id !== itemId);
                    setItems(newItems);
                    setFilteredItems(newFiltered);
                } else {
                    showInfoAlert("Error", "Cannot delete item. Try again later.");
                }
            })
        }
        console.log(`Delete: ${itemId}`);
    }

    const onTagsFilterChanged = (tags: string[]) => {
        setTagsFilter(tags);
    }

    const onTextChanged = async (text: string) => {
        setTextFilter(text);
    }

    const applyFilters = (tags?: string[], text?: string) => {
        console.log("enetered")
        let newFilters = items;
        if (textFilter) {
            newFilters = items.filter(item => 
                item.name.toLowerCase().indexOf(textFilter.toLowerCase()) === 0    
            )
        }
        if (tagsFilter.length > 0) {
            newFilters = newFilters.filter(item => item.tags &&
                item.tags?.some(tag => tagsFilter.includes(tag))
            )
        }
        setFilteredItems(newFilters);
    }

    const onSortAsc = () => {
        const newFiltered = filteredItems.sort((a: PracticeItem, b: PracticeItem) => {
            return -(a.name.localeCompare(b.name));
        })
        setFilteredItems(newFiltered);
    }

    const onSortDesc = () => {
        const newFiltered = filteredItems.sort((a: PracticeItem, b: PracticeItem) => {
            return a.name.localeCompare(b.name);
        })
        setFilteredItems(newFiltered);
    }

    const onNoSort = () => {
        //Nie działa! Poprawić!
        applyFilters();
    }

    const listItem = (item: ListRenderItemInfo<PracticeItem>) => (
        <ListItem navigation={props.navigation} item={item.item} onDeleteClicked={() => onItemDeleteClicked(item.item._id)}></ListItem>
    )

    return (
        <View style={styles.container}>
            <ItemFilters onSortAsc={onSortAsc} 
                onSortDesc={onSortDesc}
                onNoSort={onNoSort}
                onTextChanged={onTextChanged}
                onTagsChanged={onTagsFilterChanged}
                ownerId={authContext.account?._id}
                userToken={authContext.token}/>
            {(items.length === 0 || filteredItems.length === 0) && <Text>You dont have any items</Text>}
            {(items && filteredItems) && <FlatList
                data={filteredItems}
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