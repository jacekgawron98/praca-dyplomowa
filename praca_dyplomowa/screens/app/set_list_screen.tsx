import { useIsFocused } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ListRenderItemInfo, FlatList } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BACKGROUND_LIGHT, defaultStyles } from "../../common/default_styles";
import { ItemFilters } from "../../components/item_filters";
import { ListSet } from "../../components/list_sets";
import { AuthContext } from "../../contexts/auth-context";
import { showConfirmAlert, showInfoAlert } from "../../helpers/alerts";
import * as setsService from "../../services/sets-service";

const ICON_SIZE = 40

export const SetListScreen = (props: any) => {
    const [sets, setSets] = useState<PracticeSet[]>([]);
    const [filteredSets, setFilteredSets] = useState<PracticeSet[]>([]);
    const [textFilter, setTextFilter] = useState<string>("");

    const authContext = useContext(AuthContext);
    const isFocused = useIsFocused();

    useEffect(() => {
        const getSets = async () => {
            if (authContext.account?._id && authContext.token) {
                try {
                    const fetchedItems = await setsService.getSets(authContext.account?._id, authContext.token);
                    setSets(fetchedItems);
                    setFilteredSets(fetchedItems);
                }catch (error: any) {
                    console.log(error);
                }
            }
        }
        getSets();
    },[isFocused])

    useEffect(() => {
        applyFilters(textFilter);
    }, [textFilter])

    const onTextChanged = async (text: string) => {
        setTextFilter(text);
    }

    const applyFilters = (text?: string) => {
        console.log("enetered")
        let newFilters = sets;
        if (textFilter) {
            newFilters = sets.filter(set => 
                set.name.toLowerCase().indexOf(textFilter.toLowerCase()) === 0    
            )
        }
        setFilteredSets(newFilters);
    }

    const onSortAsc = () => {
        const newFiltered = filteredSets.sort((a: PracticeItem, b: PracticeItem) => {
            return -(a.name.localeCompare(b.name));
        })
        setFilteredSets(newFiltered);
    }

    const onSortDesc = () => {
        const newFiltered = filteredSets.sort((a: PracticeItem, b: PracticeItem) => {
            return a.name.localeCompare(b.name);
        })
        setFilteredSets(newFiltered);
    }

    const onNoSort = () => {
        //Nie działa! Poprawić!
        applyFilters(textFilter);
    }

    const onAddClicked = () => {
        props.navigation.navigate("SetFormScreen",{})
    }

    const onSetDeleteClicked = async (setId?: string) => {
        if (!setId) return;
        const result = await showConfirmAlert("Delete item", "Are you sure you want to delete this set?");
        if (result && authContext.token) {
            setsService.deleteSet(setId, authContext.token).then(result => {
                if (result) {
                    const newItems = sets.filter(set => set._id !== setId);
                    setSets(newItems);
                } else {
                    showInfoAlert("Error", "Cannot delete set. Try again later.");
                }
            })
        }
        console.log(`[log]: Delete set: ${setId}`);
    }

    const onSetClicked = async (set: PracticeSet) => {
        props.navigation.navigate("ExerciseScreen",{set: set})
    }

    const listSet = (setInfo: ListRenderItemInfo<PracticeSet>) => (
        <Pressable onPress={() => onSetClicked(setInfo.item)}>
            <ListSet navigation={props.navigation} set={setInfo.item} onDeleteClicked={() => onSetDeleteClicked(setInfo.item._id)}></ListSet>
        </Pressable>
    )

    return (
        <View style={styles.container}>
            <ItemFilters onSortAsc={onSortAsc} 
                onSortDesc={onSortDesc}
                onNoSort={onNoSort}
                onTextChanged={onTextChanged}
                ownerId={authContext.account?._id}
                userToken={authContext.token}/>
            {filteredSets.length === 0 && <Text style={defaultStyles.standardText}>You dont have any sets</Text>}
            {(sets && filteredSets) && <FlatList
                data={filteredSets}
                renderItem={listSet}
                keyExtractor={set => set._id? set._id : set.name + Date.now()}
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
    }
})