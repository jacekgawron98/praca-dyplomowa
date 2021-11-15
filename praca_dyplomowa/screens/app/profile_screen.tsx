import { useIsFocused } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, FlatList, ListRenderItemInfo, Dimensions } from "react-native";
import { BACKGROUND_DARK, BACKGROUND_LIGHT, defaultStyles } from "../../common/default_styles";
import { AuthContext } from "../../contexts/auth-context";
import { margin, padding } from "../../helpers/style_helper";
import { getTimeString } from "../../helpers/types_helper";
import * as setsService from "../../services/sets-service";

export const ProfileScreen = (props: any) => {
    const [history, setHistory] = useState<PracticeHistory[]>([]);
    
    const authContext = useContext(AuthContext);
    const isFocused = useIsFocused();

    useEffect(() => {
        const getItems = async () => {
            if (authContext.account?._id && authContext.token) {
                try {
                    const fetchedHistory = await setsService.getHistory(authContext.account?._id, authContext.token);
                    setHistory(fetchedHistory.reverse());
                }catch (error: any) {
                    console.log(error);
                }
            }
        }
        getItems();
    },[isFocused])
    
    const onSignoutClicked = async () => {
        await authContext.signout();
    }

    const getDate = (dateNum: number) => {
        const date = new Date(dateNum)
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    } 

    const listItem = (item: ListRenderItemInfo<PracticeHistory>) => (
        <View style={styles.listItem}>
            <Text style={[defaultStyles.standardText, {fontSize: 24}]}>{item.item.set.name}</Text>
            <Text style={[defaultStyles.standardText, {fontSize: 14}]}>Finished: {getDate(item.item.date)}</Text>
            <Text style={[defaultStyles.standardText, {fontSize: 14}]}>Total exercise time: {getTimeString(item.item.finishTime/1000)}</Text>
        </View>
    )
    
    return (
        <View style={styles.container}>
            <View style={styles.mainContent}>
                <View>
                    <Text style={[defaultStyles.standardText,{fontSize: 24}]}>Signed as</Text>
                    <Text style={[defaultStyles.standardText,{fontSize: 24}]}>{authContext.account?.login}</Text>
                </View>
                <View>
                    <Pressable onPress={onSignoutClicked}
                        style={defaultStyles.standardButton}>
                        <Text style={defaultStyles.buttonText}>Sign out</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.history}>
                <Text style={[defaultStyles.standardText,{fontSize: 28}]}>My practice history</Text>
                {(history.length === 0) && <Text style={defaultStyles.standardText}>You don't have any history</Text>}
                {(history) && <FlatList
                    data={history}
                    renderItem={listItem}
                    keyExtractor={item => item._id? item._id : item.set.name + Date.now()}
                />}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: BACKGROUND_LIGHT,
        ...padding(15)
    },

    mainContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    history: {
        ...margin(10,0)
    },

    listItem: {
        width: Dimensions.get('window').width * 0.9,
        backgroundColor: BACKGROUND_DARK,
        borderRadius: 15,
        ...padding(10),
        ...margin(10,5,0)
    },
})