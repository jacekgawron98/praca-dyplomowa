import { useIsFocused } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { BACKGROUND_DARK, BACKGROUND_LIGHT, defaultStyles, MIDDLE_COLOR, PLACEHOLDER_COLOR } from "../common/default_styles";
import { margin, padding } from "../helpers/style_helper";
import * as itemsService from "../services/items-service";

interface FiltersProps {
    userToken?: string;
    ownerId?: string;
    onTagsChanged?: (tags: string[]) => void;
    onTextChanged: (text: string) => void;
    onSortDesc: () => void;
    onSortAsc: () => void;
    onNoSort: () => void;
}

export const ItemFilters = (props: FiltersProps) => {
    const [filterText, setFilterText] = useState<string>("");
    const [allTags, setAllTags] = useState<string[]>([]);
    const isFocused = useIsFocused();

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState([]);
    const [items, setItems] = useState([
      {label: '', value: ''},
    ]);

    const [openSort, setOpenSort] = useState(false);
    const [valueSort, setValueSort] = useState("none");
    const [itemsSort, setItemsSort] = useState([
        {label: 'None', value: 'none'},
        {label: 'Name ascending', value: 'name-asc'},
        {label: 'Name descending', value: 'name-desc'},
    ]);


    useEffect(() => {
        const getItems = async () => {
            if (props.userToken && props.ownerId) {
                try {
                    const fetchedItems = await itemsService.getTags(props.ownerId, props.userToken);
                    setAllTags(fetchedItems)
                    setItems(fetchedItems.map(item => {
                        return {
                            label: item,
                            value: item
                        }
                    }))
                }catch (error: any) {
                    console.log(error);
                }
            }
        }
        getItems();
    },[isFocused])

    useEffect(() => {
        if (props.onTagsChanged) {
            props.onTagsChanged(value);
        }
    },[value])

    useEffect(() => {
        switch (valueSort) {
            case "none": {
                props.onNoSort();
                break;
            }
            case "name-asc": {
                props.onSortAsc();
                break;
            }
            case "name-desc": {
                props.onSortDesc();
                break;
            }
        }
    },[valueSort])

    return (
        <View style={styles.container}>
            <View style={{flexDirection:"row", alignItems:"center"}}>
                <View style={{...margin(0,10)}}>
                    <TextInput value={filterText} 
                        onChangeText={(text: string) => {setFilterText(text); props.onTextChanged(text)}}
                        placeholder="Filter by item name"
                        placeholderTextColor={PLACEHOLDER_COLOR}
                        style={defaultStyles.textInput}/>
                </View>
                <View>
                    <DropDownPicker 
                        theme="DARK"
                        zIndex={1000}
                        open={openSort}
                        value={valueSort}
                        items={itemsSort}
                        setOpen={setOpenSort}
                        setValue={setValueSort}
                        setItems={setItemsSort}
                        arrowIconStyle={{borderColor: "#fff", shadowColor: "#fff"}}
                        placeholder={"Sort"}
                        style={styles.mainDropDownStyle}
                        dropDownContainerStyle={styles.dropdownContainerStyle}
                        textStyle={styles.dropdownTextStyle}
                    />
                </View>
            </View>
            {props.onTagsChanged && <DropDownPicker 
                    theme="DARK"
                    zIndex={900}
                    multiple={true}
                    min={0}
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    arrowIconStyle={{borderColor: "#fff", shadowColor: "#fff"}}
                    multipleText={`${value.length} tag(s) have been selected`}
                    placeholder={"Select tags"}
                    style={[styles.mainDropDownStyle, {width: Dimensions.get("window").width * 0.9}]}
                    dropDownContainerStyle={styles.dropdownContainerStyle}
                    textStyle={styles.dropdownTextStyle}
                />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        ...padding(15),
    },

    mainDropDownStyle: {
        backgroundColor: MIDDLE_COLOR,
        borderColor: MIDDLE_COLOR,
        width: Dimensions.get("window").width * 0.4,
        ...margin(5)
    },

    dropdownContainerStyle: {
        backgroundColor: BACKGROUND_DARK
    },

    dropdownTextStyle: {
        color: "#fff"
    }
})