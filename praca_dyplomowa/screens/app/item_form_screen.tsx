import React, { useContext, useEffect, useState } from "react"
import { View, Text, StyleSheet, TextInput, Dimensions, Switch, ScrollView, Pressable } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BACKGROUND_DARK, BACKGROUND_LIGHT, defaultStyles, MIDDLE_COLOR, PLACEHOLDER_COLOR } from "../../common/default_styles";
import { ButtonHeader } from "../../components/button_header";
import { AuthContext } from "../../contexts/auth-context";
import { margin, padding } from "../../helpers/style_helper";
import * as itemsService from "../../services/items-service";

const ICON_SIZE = 32

export const ItemFormScreen = ({ route, navigation }: any) => { 
    const [item,setItem] = useState<PracticeItem>({name:"", ownerId:""});
    const [isNew, setIsNew] = useState<boolean>(false);
    const [nameError, setNameError] = useState<boolean>(false);
    const [repDurError, setRepDurError] = useState<boolean>(false);
    const [isDuration, setIsDuration] = useState<boolean>(false);
    const [isError, setError] = useState<boolean>(false);

    const [hours, setHours] = useState<string>("0");
    const [minutes, setMinutes] = useState<string>("0");
    const [seconds, setSeconds] = useState<string>("0");

    const [tag, setTag] = useState<string>("")

    const authContext = useContext(AuthContext);

    useEffect(() => {
        if (authContext.account?._id) {
            if (route.params.item) {
                setItem(route.params.item);
                if (route.params.item.duration) {
                    const duration = route.params.item.duration
                    setIsDuration(true);
                    setHours((Math.floor(duration/3600)).toString())
                    setMinutes((Math.floor((duration%3600)/60)).toString())
                    setSeconds(((duration%3600)%60).toString())
                }
            } else {
                setItem({
                    name: "",
                    ownerId: authContext.account._id 
                }),
                setIsNew(true);
            }
        }
    }, [])

    const switchValues = (value: boolean) => {
        setRepDurError(false);
        if (isDuration) {
            setItem({...item, duration: undefined})
        } else {
            setItem({...item, repeats: undefined})
        }
        setIsDuration(value);
    }

    const setRepeats = (value: string) => {
        const repeats = parseInt(value);
        if (isNaN(repeats)) setItem({...item, repeats: repeats})
        setItem({...item, repeats: repeats});
    }

    const validateForm = () => {
        let result = true;
        if (!item.name) {
            setNameError(true);
            result = false;
        }
        if (!item.repeats && !isDuration) {
            setRepDurError(true);
            result = false;
        }
        if (!item.duration && isDuration) {
            setRepDurError(true);
            result = false;
        }
        return result;
    }

    const onConfirmClicked = () => {
        if (validateForm() && authContext.token) {
            if (isNew) {
                try {
                    itemsService.addItem(item, authContext.token);
                    navigation.navigate("ItemsScreen");
                } catch (error: any){
                    console.log(error);
                    setError(true);
                }
            } else {
                if (authContext.account?._id && authContext.token){
                    try {
                        itemsService.updateItem(item, authContext.account?._id, authContext.token);
                        navigation.navigate("ItemsScreen");
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
    
    const setTime = (hour: string, minute: string, second: string) => {
        setHours(hour);
        setMinutes(minute);
        setSeconds(second);
        let h = parseInt(hour);
        let m = parseInt(minute);
        let s = parseInt(second);
        if (isNaN(h)) h = 0;
        if (isNaN(m)) m = 0;
        if (isNaN(s)) s = 0;
        const result = h*3600 + m*60 + s;
        setItem({...item, duration: result})
    }

    const removeChip = (tag: string) => {
        const newArray = item.tags? [...item.tags] : [];
        const newItem = {...item, tags: newArray.filter(item => item !== tag)}
        setItem(newItem);
    }

    const addTag = () => {
        if (!tag) return;
        const newArray = item.tags? [...item.tags] : [];
        const newItem = {...item, tags: [...newArray, tag]}
        setTag("");
        setItem(newItem);
    }

    const tagsList = item.tags?.map((tag) => (
        <TouchableOpacity style={styles.tag} key={tag} onPress={() => removeChip(tag)}>
            <View style={{flexDirection: "row", alignItems:"center"}}>
                <Text style={defaultStyles.standardText}>{tag}</Text>
                <View style={styles.chipCloseBtn}><Text style={styles.chipCloseBtnTxt}>x</Text></View>
            </View>
        </TouchableOpacity>
    ))

    return (
        <View style={styles.container}>
            <ButtonHeader navigation={navigation}
                onButtonClicked={onConfirmClicked}
                buttonText={"Done"}>
            </ButtonHeader>
            <ScrollView contentContainerStyle={styles.scroll}>
                {isError && <Text style={defaultStyles.alertText}>Cannot connect to the server</Text>}
                <View style={defaultStyles.inputView}>
                    <TextInput value={item?.name} 
                        onChangeText={text => {setItem({...item,name: text}); setNameError(false)}}
                        placeholder="Enter item name"
                        placeholderTextColor={PLACEHOLDER_COLOR}
                        style={defaultStyles.textInput}/>
                    {nameError && <Text style={defaultStyles.alertText}>Name cannot be empty</Text>}
                </View>
                <View style={styles.section}>
                    <View style={defaultStyles.inputView}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <TextInput value={item?.description} 
                            onChangeText={text => {setItem({...item,description: text})}}
                            multiline
                            maxLength={250}
                            numberOfLines={5}
                            textAlignVertical={'top'}
                            placeholder="Enter item description"
                            placeholderTextColor={PLACEHOLDER_COLOR}
                            style={defaultStyles.textInput}/>
                    </View>
                </View>
                <View style={styles.switchSection}>
                    <Text style={[defaultStyles.standardText, styles.switchText]}>Repeats</Text>
                    <Switch
                        style={defaultStyles.switch}
                        trackColor={{ false: "#767577", true: "#767577" }}
                        thumbColor={MIDDLE_COLOR}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => switchValues(!isDuration)}
                        value={isDuration}>
                    </Switch>
                    <Text style={[defaultStyles.standardText, styles.switchText]}>Duration</Text>
                </View>
                {!isDuration && <View style={styles.section}>
                    <View style={defaultStyles.inputView}>
                        <Text style={styles.sectionTitle}>Number of repeats</Text>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <TextInput value={item?.repeats?.toString()} 
                                keyboardType="numeric"
                                onChangeText={text => {setRepeats(text); setRepDurError(false)}}
                                placeholderTextColor={PLACEHOLDER_COLOR}
                                style={[defaultStyles.textInput, {width: "25%"}]}/>
                            <Text style={[defaultStyles.standardText,{fontSize: 20}]}> repeats</Text>
                        </View>
                        
                        {repDurError && <Text style={defaultStyles.alertText}>Item must have at least 1 repeat</Text>}
                    </View>
                </View>}
                {isDuration && <View style={styles.section}>
                    <View style={defaultStyles.inputView}>
                        <Text style={styles.sectionTitle}>Duration</Text>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <TextInput value={hours.toString()} 
                                keyboardType="numeric"
                                onChangeText={text => { setTime(text,minutes,seconds); setRepDurError(false)}}
                                placeholderTextColor={PLACEHOLDER_COLOR}
                                style={[defaultStyles.textInput, {width: "25%", textAlign:"center"}]}/>
                            <Text style={[defaultStyles.standardText,{fontSize: 20}]}> h</Text>
                            <TextInput value={minutes.toString()} 
                                keyboardType="numeric"
                                onChangeText={text => { setTime(hours, text, seconds); setRepDurError(false)}}
                                placeholderTextColor={PLACEHOLDER_COLOR}
                                style={[defaultStyles.textInput, {width: "25%", textAlign:"center"}]}/>
                            <Text style={[defaultStyles.standardText,{fontSize: 20}]}> m</Text>
                            <TextInput value={seconds.toString()} 
                                keyboardType="numeric"
                                onChangeText={text => { setTime(hours, minutes, text); setRepDurError(false)}}
                                placeholderTextColor={PLACEHOLDER_COLOR}
                                style={[defaultStyles.textInput, {width: "25%", textAlign:"center"}]}/>
                            <Text style={[defaultStyles.standardText,{fontSize: 20}]}> s</Text>
                        </View>
                        {repDurError && <Text style={defaultStyles.alertText}>Duration cannot be less than 1 second</Text>}
                    </View>
                </View>}
                <View style={styles.section}>
                    <View style={defaultStyles.inputView}>
                        <Text style={styles.sectionTitle}>Tags</Text>
                        <TextInput value={tag} 
                            onChangeText={text => setTag(text)}
                            placeholder="Enter tag name"
                            placeholderTextColor={PLACEHOLDER_COLOR}
                            onSubmitEditing={addTag}
                            style={defaultStyles.textInput}/>
                    </View>
                    <View style={styles.tagsList}>
                        {tagsList}
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={defaultStyles.inputView}>
                        <Text style={styles.sectionTitle}>Statistic name</Text>
                        <TextInput value={item?.statisticName} 
                            onChangeText={text => setItem({...item, statisticName: text})}
                            placeholder="Enter tags"
                            placeholderTextColor={PLACEHOLDER_COLOR}
                            style={defaultStyles.textInput}/>
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={defaultStyles.inputView}>
                        <Text style={styles.sectionTitle}>Example video</Text>
                        <TextInput value={item?.videoLink} 
                            onChangeText={text => setItem({...item, videoLink: text})}
                            placeholder="Enter video link"
                            placeholderTextColor={PLACEHOLDER_COLOR}
                            style={defaultStyles.textInput}/>
                    </View>
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

    scroll: {
        alignItems: "center"
    },

    section: {
        backgroundColor: BACKGROUND_DARK,
        borderRadius: 15,
        width: Dimensions.get("window").width * 0.9,
        ...padding(15),
        ...margin(10,0)
    },

    switchSection: {
        flexDirection: "row",
        alignItems: "center"
    },

    switchText: {
        fontSize: 18,
        fontWeight: "bold",
    },

    sectionTitle: {
        fontSize: 20,
        color: "#bbb",
        marginBottom: 5
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
    },

    chipCloseBtn: {
        borderRadius: 8,
        width: 16,
        height: 16,
        backgroundColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center'
    },

    chipCloseBtnTxt: {
        color: '#555',
        paddingBottom: 3
    }
})