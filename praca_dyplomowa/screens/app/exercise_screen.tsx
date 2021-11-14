import { useIsFocused } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList, ListRenderItemInfo, Pressable, Dimensions } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BACKGROUND_LIGHT, defaultStyles } from "../../common/default_styles";
import { ButtonHeader } from "../../components/button_header";
import { ExerciseItem } from "../../components/exercise_item";
import { AuthContext } from "../../contexts/auth-context";
import { showInfoAlert } from "../../helpers/alerts";
import { padding } from "../../helpers/style_helper";
import { getTimeString } from "../../helpers/types_helper";
import * as itemsService from "../../services/items-service";

interface ItemInfo {
    item: PracticeItem,
    isFinished: boolean
}

export const ExerciseScreen = ({ route, navigation }: any) => {
    const [set, setSet] = useState<PracticeSet>({name:"test name",ownerId:"",items: []});
    const [buttonState, setButtonState] = useState<string>("Start");
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [startTime, setStartTime] = useState<number>(0);
    const authContext = useContext(AuthContext);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (route.params.set) {
            setSet(route.params.set);
        }
    }, [isFocused])

    const listSet = (itemInfo: ListRenderItemInfo<ItemInfo>) => (
        <ExerciseItem onNextClicked={onNextClicked}
            onRepeatClicked={onRepeatClicked}
            item={itemInfo.item.item}
            isFinished={itemInfo.item.isFinished}
            isActive={itemInfo.index === activeIndex}
            isLast={itemInfo.index === set.items.length - 1}
            navigation={navigation}/>  
    )

    const onStartClicked = () => {
        setActiveIndex(0);
        setStartTime(Date.now());
        setButtonState("Reset");
    }

    const onResetClicked = () => {
        setActiveIndex(-1);
        setStartTime(0);
        setButtonState("Start");
    }

    const onNextClicked = async (itemId: string, statValue?: string) => {
        const time = (Date.now() - startTime);
        if (statValue) {
            try {
                const val = parseFloat(statValue);
                const newStat: Stat = {
                    date: Date.now(),
                    finishTime: time,
                    value: val
                }
                if (authContext.account?._id && authContext.token) {
                    const value = await itemsService.addStat(newStat, itemId, authContext.account?._id,authContext.token);
                    console.log(value);
                } else {
                    throw Error("Not authorized");
                }
            } catch {
                console.log("update error")
            }
        }
        if (activeIndex + 1 === set.items.length) {
            showInfoAlert("Set finished", `You finished set in ${getTimeString(time/1000)}`);
            // TO DO zapisywanie w historii + wyświetlenie podsumowania
        }
        setActiveIndex(activeIndex + 1)
    }

    const onRepeatClicked = () => {
        setActiveIndex(activeIndex);
    }

    return (
        <View style={styles.container}>
            <ButtonHeader navigation={navigation}
                onButtonClicked={buttonState === "Start"? onStartClicked : onResetClicked}
                buttonText={buttonState}>
            </ButtonHeader>
            <View style={{alignItems: "center"}}>
                <Text style={[defaultStyles.standardText, {fontSize: 24}]}>
                    {set.name} ({activeIndex < 0? 0 : activeIndex}/{set.items.length})
                </Text>
            </View>
            <View style={{alignItems:"center"}}>

                {set.items && <FlatList
                    data={set.items.map((item,index) => {
                        return {
                            item: item,
                            isFinished: index < activeIndex? true : false
                        }
                    })}
                    renderItem={listSet}
                    keyExtractor={(item,index) => index.toString()}
                />}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: BACKGROUND_LIGHT,
        ...padding(0,0)
    }
})