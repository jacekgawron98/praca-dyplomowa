import { useIsFocused } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ListRenderItemInfo, FlatList } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BACKGROUND_LIGHT, defaultStyles } from "../../common/default_styles";
import { ListSet } from "../../components/list_sets";
import { AuthContext } from "../../contexts/auth-context";
import { showConfirmAlert, showInfoAlert } from "../../helpers/alerts";
import * as setsService from "../../services/sets-service";

const ICON_SIZE = 40

export const SetListScreen = (props: any) => {
    const [sets, setSets] = useState<PracticeSet[]>([]);
    const authContext = useContext(AuthContext);
    const isFocused = useIsFocused();

    useEffect(() => {
        const getSets = async () => {
            if (authContext.account?._id && authContext.token) {
                try {
                    const fetchedItems = await setsService.getSets(authContext.account?._id, authContext.token);
                    setSets(fetchedItems);
                }catch (error: any) {
                    console.log(error);
                }
            }
        }
        getSets();
    },[isFocused])

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
            {sets.length === 0 && <Text style={defaultStyles.standardText}>You dont have any sets</Text>}
            {sets && <FlatList
                data={sets}
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