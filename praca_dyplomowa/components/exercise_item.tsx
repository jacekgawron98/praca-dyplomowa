import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/core";
import { Dimensions, GestureResponderEvent, View, StyleSheet, Text, Pressable, TextInput } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BACKGROUND_DARK, defaultStyles, MIDDLE_COLOR, PLACEHOLDER_COLOR } from "../common/default_styles";
import { margin, padding } from "../helpers/style_helper";
import { getTimeString, youtubeParser } from "../helpers/types_helper";
import YoutubePlayer from "react-native-youtube-iframe";

const ICON_SIZE = 24

interface ListSetProps {
    item: PracticeItem
    isFinished: boolean
    isActive: boolean
    isLast?: boolean
    navigation: any
    onNextClicked: (itemId:string, statValue?: string) => void
    onRepeatClicked?: (event: GestureResponderEvent) => void

}

export const ExerciseItem = (props: ListSetProps) => {
    const [itemFinished, setItemFinished] = useState<boolean>(false);
    const [itemStarted, setItemStarted] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
    const [statValue, setStatValue] = useState<string>("0");

    let timer: any;

    useEffect(() => {
        if (props.isActive) {
            setItemStarted(false);
            setItemFinished(false);
            setStatValue("0");
            if (props.item.duration) {
                setCurrentTime(props.item.duration);
            }
        }
    }, [props.isActive])

    useEffect(() => {
        if (props.isActive) {
            if (props.item.duration) {
                timer = setInterval(() => {manageTimer(1)},1000);
            }
        }
        return timer? () => {clearInterval(timer);} : () => clearInterval();
    })

    const manageTimer = (interval: number) => {
        if (itemStarted) {
            console.log(currentTime - interval);
            if (currentTime - interval <= 0) {
                setItemFinished(true);
                setItemStarted(false);
            }
            setCurrentTime(currentTime - interval);
        }
    }

    const onTimerButtonClicked = () => {
        setItemStarted(!itemStarted);
    }

    const onRepeatClicked = (event: GestureResponderEvent) => {
        if(props.onRepeatClicked) {
            props.onRepeatClicked(event);
        }
        setItemFinished(false);
        setItemStarted(false);
    }

    const onDoneClicked = () => {
        setItemStarted(false);
        setItemFinished(true);
    }

    const onVideoStateChange = (state: any) => {
        if (state === "ended") {
            setVideoPlaying(false);
        }
    }

    return (
        <View style={[styles.listItem, props.isFinished? styles.finishedItem : {}]}>
            <Text style={[defaultStyles.standardText,styles.itemName]}>{props.item.name}</Text>
            {(props.isActive && !itemFinished) && <View style={[styles.activeContent]}>
                <View style={styles.activeSubContent}>
                    {props.item.duration && <View>
                        <Text style={[defaultStyles.standardText, styles.repeatsDurationText]}>{getTimeString(currentTime)}</Text>
                        <Pressable onPress={onTimerButtonClicked}
                            style={[defaultStyles.standardButton, {...margin(5)}]}>
                            <MaterialIcons name={itemStarted? "pause" : "play-arrow"} color={"#fff"} size={ICON_SIZE}/>
                        </Pressable>
                    </View>}
                    {props.item.repeats && <View>
                        <Text style={[defaultStyles.standardText, styles.repeatsDurationText]}>{props.item.repeats} repeats</Text>
                    </View>}
                </View>
                <View style={styles.activeSubContent}>
                    <Text style={[defaultStyles.standardText]}>{props.item.description}</Text>
                    <Pressable onPress={onDoneClicked}
                        style={[defaultStyles.standardButton, {...margin(5)}]}>
                        <Text style={defaultStyles.buttonText}>Mark as done</Text>
                    </Pressable>
                </View>
            </View>}
            {(props.isActive && !itemFinished && props.item.videoLink) && <View>
                <Text style={[defaultStyles.standardText, {fontSize: 16, ...margin(5,0)}]}>Related video</Text>
                <YoutubePlayer  
                    height={200}        
                    play={videoPlaying}        
                    videoId={youtubeParser(props.item.videoLink)}        
                    onChangeState={onVideoStateChange}/>
            </View>}
            {(props.isActive && itemFinished) && <View style={[styles.activeContent]}>
                <View style={styles.content}>
                    <Text style={[defaultStyles.standardText,styles.itemName]}>Exercise finished!</Text>
                    {props.item.statisticName && <View style={{flexDirection: "row", ...margin(20,0)}}>
                        <Text style={[defaultStyles.standardText,{fontSize: 20}]}>{props.item.statisticName}: </Text>
                        <TextInput value={statValue} 
                                keyboardType="numeric"
                                onChangeText={text => { setStatValue(text)}}
                                style={[defaultStyles.textInput, {width: "25%", textAlign:"center"}]}/>
                    </View>}
                    <View style={{flexDirection: "row"}}>
                        <Pressable onPress={onRepeatClicked}
                            style={[defaultStyles.standardButton,{...margin(10)}]}>
                            <Text style={defaultStyles.buttonText}>Repeat</Text>
                        </Pressable>
                        <Pressable onPress={() => props.onNextClicked(props.item._id!,props.item.statisticName? statValue : undefined)}
                            style={[defaultStyles.standardButton,{...margin(10)}]}>
                            <Text style={defaultStyles.buttonText}>{props.isLast? "Finish" : "Next"}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>}
            {props.isFinished && <View style={styles.listItemButtons}>
                <MaterialIcons style={styles.checksign} name="check" color={"#fff"} size={ICON_SIZE}/>
            </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    listItem: {
        width: Dimensions.get('window').width * 0.9,
        flex:1,
        backgroundColor: BACKGROUND_DARK,
        borderRadius: 15,
        ...padding(10),
        ...margin(10,5,0)
    },

    finishedItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    content: {
        flexShrink: 2
    },

    activeContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    activeSubContent: {
        width: "50%",
        alignItems: "center",
    },

    listItemButtons: {
        flexShrink: 1,
        flexDirection: "row"
    },

    checksign: {
        borderRadius: 100,
        backgroundColor: MIDDLE_COLOR,
        ...padding(5),
        ...margin(5),
    },

    repeatsDurationText: {
        fontSize: 24,
        ...margin(15,0)
    },

    itemName: {
        fontSize: 24
    },
})
