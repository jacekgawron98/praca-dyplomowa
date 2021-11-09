import { useIsFocused } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Dimensions, ListRenderItemInfo, FlatList, Switch } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BACKGROUND_DARK, BACKGROUND_LIGHT, defaultStyles, LIGHT_COLOR, MIDDLE_COLOR, PLACEHOLDER_COLOR } from "../../common/default_styles";
import { ListItem } from "../../components/list_items";
import { AuthContext } from "../../contexts/auth-context";
import { margin, padding } from "../../helpers/style_helper";
import { clamp } from "../../helpers/types_helper";
import * as itemsService from "../../services/items-service";
import * as setsService from "../../services/sets-service";

const ICON_SIZE = 32

export const SetFormScreen = ({ route, navigation }: any) => {
    const [set, setSet] = useState<PracticeSet>({name:"test name",ownerId:"",items: []});
    const [items, setItems] = useState<PracticeItem[]>([]);
    const [isNew, setIsNew] = useState<boolean>(false);
    const [isError, setError] = useState<boolean>(false);
    const [nameError, setNameError] = useState<boolean>(false);
    const [dateError, setDateError] = useState<boolean>(false);
    const [isScheduled, setIsScheduled] = useState<boolean>(false);
    const [lastSchedule, setLastSchedule] = useState<SetTime|undefined>(undefined);
    
    const [hours, setHours] = useState<string>("0");
    const [minutes, setMinutes] = useState<string>("0");
    const [day, setDay] = useState<string>("monday");
    const authContext = useContext(AuthContext);
    const isFocused = useIsFocused();
    
    const days = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ]
    
    useEffect(() => {
        if (authContext.account?._id) {
            if (route.params.set) {
                setSet(route.params.set);
                if (route.params.set.plannedTime) {
                    setIsScheduled(true);
                    setHours(route.params.set.plannedTime.hour.toString())
                    setMinutes(route.params.set.plannedTime.minute.toString())
                    setDay(route.params.set.plannedTime.day)
                }
            } else {
                setSet({
                    name: "",
                    ownerId: authContext.account._id,
                    items: []
                }),
                setIsNew(true);
            }
        }
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

    const onConfirmClicked = () => {
        if (validateForm() && authContext.token) {
            if (isNew) {
                try {
                    console.log(set);
                    setsService.addSet(set,authContext.token);
                    navigation.navigate("SetsScreen");
                } catch (error: any){
                    console.log(error);
                    setError(true);
                }
            } else {
                if (authContext.account?._id && authContext.token){
                    try {
                        setsService.updateSet(set, authContext.account?._id, authContext.token);
                        navigation.navigate("SetsScreen");
                    } catch (error: any){
                        console.log(error);
                        setError(true);
                    }
                }
            }
        }
    }

    const onReturnClicked = () => {
        navigation.goBack();
    }

    const validateForm = () => {
        let result = true;
        if (!set.name) {
            setNameError(true);
            result = false;
        }
        return result;
    }

    const onAddItemClicked = (item: PracticeItem) => {
        const newSet = set;
        newSet.items = [...newSet.items, item];
        setSet(newSet);
    }

    const onItemDelete = (index: number) => {
        console.log(`removing ${index}`);
        const newSet = set;
        newSet.items.splice(index,1);
        setSet(newSet);
    }

    const switchValues = (value: boolean) => {
        setDateError(false);
        if (!value) {
            setLastSchedule(set.plannedTime);
            setSet({...set, plannedTime: undefined})
        } else {
            setSet({...set, plannedTime: lastSchedule})
        }
        setIsScheduled(value);
    }

    const findDay = (current: string, checkBackwards: boolean) => {
        let index = days.findIndex(day => day === current);
        index = checkBackwards? index - 1 : index + 1;
        if (!checkBackwards && index >= days.length) index = 0;
        if (checkBackwards && index < 0) index = days.length-1;
        return days[index];
    }

    const setTime = (hour: string, minute: string, day: string) => {
        let h = parseInt(hour);
        let m = parseInt(minute);
        if (!isNaN(h) && !isNaN(m)){
            h = clamp(h,0,23)
            m = clamp(m,0,59)
            setDay(day);
            setHours(h.toString());
            setMinutes(m.toString());
            setSet({...set, plannedTime: {
                day: day,
                hour: h,
                minute: m,
                isWeekly: true
            }})
        } else {
            setHours(hour);
            setMinutes(minute);
            setDateError(true);
        }
    }

    const fullListItem = (item: PracticeItem) => (
        <ListItem key={item._id} navigation={navigation} isAdder={true} item={item} onAddClicked={() => onAddItemClicked(item)}></ListItem>
    )

    const addedItem = (item: PracticeItem, index: number) => (
        <View key={index} style={styles.addedITem}>
            <Text style={defaultStyles.standardText}>{item.name}</Text>
            <Pressable
                onPress={() => onItemDelete(index)}
                style={styles.removeButton}>
                <MaterialIcons name="close" color={"#fff"} size={15}/>
            </Pressable>
        </View>
    )

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Pressable onPress={onReturnClicked}>
                        <MaterialIcons name="chevron-left" color={"#fff"} size={ICON_SIZE}/>
                    </Pressable>
                </View>
                <View>
                    <Pressable onPress={onConfirmClicked}
                        style={defaultStyles.standardButton}>
                        <Text style={defaultStyles.buttonText}>Done</Text>
                    </Pressable>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.scroll}>
                {isError && <Text style={defaultStyles.alertText}>Cannot connect to the server</Text>}
                <View style={defaultStyles.inputView}>
                    <TextInput value={set?.name} 
                        onChangeText={text => {setSet({...set,name: text}); setNameError(false)}}
                        placeholder="Enter set name"
                        placeholderTextColor={PLACEHOLDER_COLOR}
                        style={defaultStyles.textInput}/>
                    {nameError && <Text style={defaultStyles.alertText}>Name cannot be empty</Text>}
                </View>
                <View style={styles.section}>
                    <View>
                        <View style={{flexDirection:"row", alignItems:"center", justifyContent: "space-between"}}>
                            <Text style={styles.sectionTitle}>Scheduled day</Text>
                            <Switch
                                style={defaultStyles.switch}
                                trackColor={{ false: "#767577", true: LIGHT_COLOR }}
                                thumbColor={MIDDLE_COLOR}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => switchValues(!isScheduled)}
                                value={isScheduled}>
                            </Switch>
                        </View>
                        {isScheduled && <View style={{flexDirection: "row", alignItems: "center"}}>
                            <Pressable onPress={() =>{ setTime(hours,minutes,findDay(day,true)); setDateError(false)}}>
                                <MaterialIcons name="chevron-left" color={"#fff"} size={ICON_SIZE}/>
                            </Pressable>
                            <Text style={defaultStyles.standardText}>{day}</Text>
                            <Pressable onPress={() =>{ setTime(hours,minutes,findDay(day,false)); setDateError(false)}}>
                                <MaterialIcons name="chevron-right" color={"#fff"} size={ICON_SIZE}/>
                            </Pressable>
                            <TextInput value={hours.toString()} 
                                keyboardType="numeric"
                                onChangeText={text => { setTime(text, minutes, day); setDateError(false)}}
                                placeholderTextColor={PLACEHOLDER_COLOR}
                                style={[defaultStyles.textInput, {width: "25%", textAlign:"center"}]}/>
                            <Text style={[defaultStyles.standardText,{fontSize: 20}]}> :</Text>
                            <TextInput value={minutes.toString()} 
                                keyboardType="numeric"
                                onChangeText={text => { setTime(hours, text, day); setDateError(false)}}
                                placeholderTextColor={PLACEHOLDER_COLOR}
                                style={[defaultStyles.textInput, {width: "25%", textAlign:"center"}]}/>
                        </View>}
                        {!isScheduled && <Text style={defaultStyles.standardText}>
                            This set is not scheduled
                        </Text>}
                        {dateError && <Text style={defaultStyles.alertText}>Invalid time</Text>}
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Items</Text>
                    {set.items.length === 0 && <Text style={defaultStyles.standardText}>
                        This set does not have any items
                    </Text>}
                    {set.items.length > 0 && set.items.map((item,index) => {
                        return addedItem(item,index);
                    })}
                </View>
                <View style={{flex:1, paddingBottom: 25}}>
                    <Text style={styles.sectionTitle}>Full catalogue</Text>
                    {items.length === 0 && <Text style={defaultStyles.standardText}>
                        You don't have any items
                    </Text>}
                    {items.map(item => {
                        return fullListItem(item);
                    })}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_LIGHT,
        ...padding(0,0)
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        ...padding(10,15)
    },

    scroll: {
        alignItems: "center"
    },

    sectionTitle: {
        fontSize: 20,
        color: "#bbb",
        marginBottom: 5
    },

    section: {
        backgroundColor: BACKGROUND_DARK,
        borderRadius: 15,
        width: Dimensions.get("window").width * 0.9,
        ...padding(15),
        ...margin(10,0)
    },

    addedITem: {
        flexDirection:"row", 
        justifyContent:"space-between",
        alignItems:"center",
        backgroundColor: BACKGROUND_LIGHT,
        width: "100%",
        borderRadius: 15,
        ...padding(5,10,5,5),
        ...margin(0,0,5,0)
    },

    removeButton: {
        borderRadius: 100,
        backgroundColor: "#f33",
        ...padding(5)
    }
})