import { useIsFocused } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, SectionList, Dimensions, Pressable } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BACKGROUND_DARK, BACKGROUND_LIGHT, defaultStyles, MIDDLE_COLOR } from "../../common/default_styles";
import { AuthContext } from "../../contexts/auth-context";
import { margin, padding } from "../../helpers/style_helper";
import * as setsService from "../../services/sets-service";

const ICON_SIZE = 28

export const CalendarScreen = (props: any) => {
    const [calendar, setCalendar] = useState<Calendar>({
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
    });
    const [nextItem, setNextItem] = useState<PracticeSet>()
    const authContext = useContext(AuthContext);
    const isFocused = useIsFocused();

    useEffect(() => {
        const getCalendar = async () => {
            if (authContext.account?._id && authContext.token) {
                try {
                    const fetchedItems = await setsService.getCalendar(authContext.account?._id, authContext.token);
                    if  (fetchedItems) {
                        setCalendar(fetchedItems);
                    }
                }catch (error: any) {
                    console.log(error);
                }
            }
        }
        getCalendar();
    },[isFocused])

    const listData = [
        {
            title: "Monday",
            data: calendar.monday
        },
        {
            title: "Tuesday",
            data: calendar.tuesday
        },
        {
            title: "Wednesday",
            data: calendar.wednesday
        },
        {
            title: "Thursday",
            data: calendar.thursday
        },
        {
            title: "Friday",
            data: calendar.friday
        },
        {
            title: "Saturday",
            data: calendar.saturday
        },
        {
            title: "Sunday",
            data: calendar.sunday
        },
    ]

    const onStartClicked = (set: PracticeSet) => {
        console.log("start")
        props.navigation.navigate("ExerciseScreen",{set: set})
    }

    const NoItem = () => (
        <View style={styles.listItem}>
            <Text style={[defaultStyles.standardText]}>No sets were scheduled on that day</Text>
        </View>
    );
    
    const renderNoContent = ({section}: any) => {
        if(section.data.length == 0){
           return <NoItem/>
        }
        return null
     }

    return (
        <View style={styles.container}>
            <View style={{alignItems: "center", ...margin(10,0)}}>
                <Text style={[defaultStyles.standardText, {fontSize: 32}]}>Next exercise</Text>
                {(nextItem && nextItem.plannedTime) && <View><View style={styles.listItem}>
                    <View style={[styles.content, styles.timer]}>
                        <Text style={[defaultStyles.standardText, styles.itemName]}>{nextItem.plannedTime.hour}:{nextItem.plannedTime.minute}</Text>
                    </View>
                    <View style={styles.content}>
                        <Text style={[defaultStyles.standardText, styles.itemName]}>{nextItem.name}</Text>
                    </View>
                    </View>
                    <Pressable style={defaultStyles.standardButton} onPress={() => onStartClicked(nextItem)}>
                        <Text style={[defaultStyles.standardText]}>Start now</Text>
                        <MaterialIcons name="play-arrow" color={"#fff"} size={ICON_SIZE}/>
                    </Pressable>
                </View>}
                {!nextItem && <View>
                    <Text style={[defaultStyles.standardText, styles.itemName]}>No sets were scheduled</Text>
                </View>}
            </View>
            <SectionList
                sections={listData}
                keyExtractor={(item: PracticeSet, index: number) => item._id? item._id : index.toString()}
                renderItem={({item}: any) => <View style={styles.listItem}>
                    <View style={[styles.content, styles.timer]}>
                        <Text style={[defaultStyles.standardText, styles.itemName]}>{item.plannedTime.hour}:{item.plannedTime.minute}</Text>
                    </View>
                    <View style={styles.content}>
                        <Text style={[defaultStyles.standardText, styles.itemName]}>{item.name}</Text>
                    </View>
                    <View style={styles.listItemButtons}>
                        <Pressable onPress={() => onStartClicked(item)}>
                            <MaterialIcons name="play-arrow" color={"#fff"} size={ICON_SIZE}/>
                        </Pressable>
                    </View>
                </View>}
                renderSectionHeader={({ section: { title } } : any) => (
                    <Text style={[defaultStyles.standardText,styles.listHeader]}>{title}</Text>
                )}
                renderSectionFooter={renderNoContent}
                />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: BACKGROUND_LIGHT,
        ...padding(10,0)
    },

    timer: {
        backgroundColor: MIDDLE_COLOR, 
        borderRadius: 15, 
        ...padding(8,14)
    },

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

    itemName: {
        fontSize: 24
    },

    listItemButtons: {
        flexShrink: 1,
        flexDirection: "row"
    },

    listHeader: {
        fontSize: 22
    }
})