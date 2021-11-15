import { useIsFocused } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ListRenderItemInfo } from "react-native";
import { BACKGROUND_LIGHT } from "../../common/default_styles";
import { ItemFilters } from "../../components/item_filters";
import { ListStats } from "../../components/list_stats";
import { AuthContext } from "../../contexts/auth-context";
import * as itemsService from "../../services/items-service";

export const StatisticsScreen = (props: any) => {
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
                    const fetchedItems = await itemsService.getItems(authContext.account?._id, authContext.token,true);
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
    
    const onTagsFilterChanged = (tags: string[]) => {
        setTagsFilter(tags);
    }

    const onTextChanged = async (text: string) => {
        setTextFilter(text);
    }

    const applyFilters = (tags?: string[], text?: string) => {
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
        <ListStats navigation={props.navigation} item={item.item}></ListStats>
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