import React, { useState } from "react";
import { ListRenderItemInfo, View, Text, Pressable, Dimensions, StyleSheet, GestureResponderEvent } from "react-native";
import { LineChart } from "react-native-chart-kit";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BACKGROUND_DARK, BACKGROUND_LIGHT, DARK_COLOR, defaultStyles, LIGHT_COLOR, MIDDLE_COLOR } from "../common/default_styles";
import { margin, padding } from "../helpers/style_helper";

const ICON_SIZE = 28

interface ListItemProps {
    item: PracticeItem
    navigation: any
}

export const ListStats = (props: ListItemProps) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [count, setCount] = useState<number>(5);
    const [val, setVal] = useState<string>("5");

    const values = ["5","10","50","All"];

    const tagsList = props.item.tags?.map((tag) => (
        <View style={styles.tag} key={tag}>
            <Text style={defaultStyles.standardText}>{tag}</Text>
        </View>
    ))

    const getDate = (item: PracticeItem) => {
        const date = new Date(item.stats![item.stats!.length-1].date)
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    } 

    const data = {
        labels: props.item.stats!.slice(Math.max(props.item.stats!.length-count,0))
            .map(item => {return new Date(item.date).toLocaleDateString()}),
        datasets: [
            {
                data: props.item.stats!.slice(Math.max(props.item.stats!.length-count,0)).map(item => {return item.value}),
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                strokeWidth: 2 // optional
            }
        ],
        legend: [`${props.item.statisticName}`] // optional
    };

    const findCount = (current: string, checkBackwards: boolean) => {
        let index = values.findIndex(val => val === current);
        index = checkBackwards? index - 1 : index + 1;
        if (!checkBackwards && index >= values.length) index = 0;
        if (checkBackwards && index < 0) index = values.length-1;
        setVal(values[index]);
        if (values[index] === "All") return props.item.stats?.length;
        return parseFloat(values[index]);
    }

    const hexToRgbA = (hex: string, a: number) =>{
        let c: any;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+ a +')';
        }
        throw new Error('Bad Hex');
    }

    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => hexToRgbA(LIGHT_COLOR, opacity),
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };

    return (
        <View style={styles.listItem}>
            <Pressable style={styles.row} onPress={() => setIsExpanded(!isExpanded)}>
                <View style={styles.content}>
                    <Text style={[defaultStyles.standardText, styles.itemName]}>{props.item.name}</Text>
                    {props.item.stats && <Text style={[defaultStyles.standardText]}>Registered stats: {props.item.stats!.length}</Text>}
                    <Text style={[defaultStyles.standardText]}>Last exercise: {getDate(props.item)}</Text>
                </View>
                <View style={styles.listItemButtons}>
                    <MaterialIcons name={isExpanded? "keyboard-arrow-up" : "keyboard-arrow-down"} color={"#fff"} size={ICON_SIZE}/>
                </View>
            </Pressable>
            {isExpanded && <View style={styles.chartView}>
                <View style={{flexDirection: "row", alignItems:"center", ...padding(10)}}>
                    <Text style={defaultStyles.standardText}>Display: </Text>
                    <Pressable onPress={() =>{ setCount(findCount(val, true)!)}}>
                        <MaterialIcons name="chevron-left" color={"#fff"} size={ICON_SIZE}/>
                    </Pressable>
                    <Text style={defaultStyles.standardText}>{val === "All"? val : `Last ${val}`} records</Text>
                    <Pressable onPress={() =>{ setCount(findCount(val, false)!)}}>
                        <MaterialIcons name="chevron-right" color={"#fff"} size={ICON_SIZE}/>
                    </Pressable>
                </View>
                <LineChart 
                    data={data}
                    width={Dimensions.get("window").width * 0.85}
                    height={220}
                    bezier
                    chartConfig={chartConfig}
                />
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

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    content: {
        flexShrink: 3
    },

    listItemButtons: {
        flexShrink: 1,
        flexDirection: "row"
    },

    itemName: {
        fontSize: 20
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

    chartView: {
        justifyContent:"center",
        alignItems: "center",
        ...padding(15,0,0)
    }
})