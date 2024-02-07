import React, { useState, useEffect } from "react";
import {
    View, Image,
    StyleSheet, ScrollView, Text, FlatList, Pressable,
} from 'react-native';
import HeaderBar from '../components/header_bar'
import Picker from "../components/one_value_picker_with_mul_labels";
import url from "../ApiUrl";
import { Color, FontFamily } from "../GlobalStyles";
import CustomDropdown from '../components/multi_value_picker';
import OneValueDropDown from '../components/one_value_picker'

const App = () => {

    const [currentVisitors, setCurrentVisitors] = useState([]);
    const [selectedVisitor, setSelectedVisitor] = useState('');

    const [visitData, setVisitData] = useState([]);
    const [visitDestinations, setVisitDestinations] = useState([]);

    const [locations, setLocations] = useState([]);
    const [newSource, setNewSource] = useState('');

    useEffect(() => {
        fetchLocations();
        fetchCurrentVisitors();
    }, [])

    useEffect(() => {
        if (selectedVisitor) {
            fetchVisitDestinations();
        }
    }, [selectedVisitor])


    const fetchLocations = async () => {
        try {
            const response = await fetch(`${url}GetAllLocations`);
            if (response.ok) {
                const data = await response.json();
                setLocations(data);
            } else {
                throw new Error('Failed to fetch locations.');
            }
        } catch (error) {
            console.error('Error occurred during API request:', error);
        }
    };

    const fetchVisitDestinations = async () => {
        try {
            const response = await fetch(`${url}GetVisitDestinations?id=${selectedVisitor}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data.visit_destinations)
                setVisitDestinations(data.visit_destinations)
                console.log(data)
                setVisitData(data);
            } else {
                throw new Error('Failed to fetch visit destinations.');
            }
        } catch (error) {
            console.error('Error occurred during API request:', error);
        }
    }

    const fetchCurrentVisitors = async () => {
        try {
            const response = await fetch(`${url}GetCurrentVisitors`);
            if (response.ok) {
                const data = await response.json();
                setCurrentVisitors(data);
            } else {
                throw new Error('Failed to fetch current visitors.');
            }
        } catch (error) {
            console.error('Error occurred during API request:', error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <HeaderBar title="Re Route Visitor" />
            <View style={styles.container}>
                <Picker
                    options={currentVisitors}
                    selectedValue={selectedVisitor}
                    onValueSelect={setSelectedVisitor}
                    labelKeys={["name", "phone"]}
                    valueKey="id"
                    placeholder="Select Visitor"
                    height={350}
                    width='92%'
                    selectedValueLabels={["name"]}
                />
                {visitDestinations.length > 0 &&
                    <View style={{ backgroundColor: Color.deepskyblue, paddingVertical: 15, paddingHorizontal: 10, borderRadius: 8, elevation: 1, }}>
                        <Text style={{ color: '#fff', fontFamily: FontFamily.poppinsSemibold, borderBottomColor: Color.white, borderBottomWidth: 1, marginBottom: 10, fontSize: 14, }}>Current Destinations</Text>
                        <Text style={{ color: '#fff', fontFamily: FontFamily.poppinsRegular, fontSize: 14, }}>{visitData.visit_destinations_names ? (visitData.visit_destinations_names.join(', ')) : null}</Text>
                    </View>
                }
                {visitDestinations.length > 0 &&
                    <View style={{ marginTop: 20, }}>
                        <View>
                            <CustomDropdown
                                options={locations}
                                selectedValues={visitDestinations}
                                onValuesSelect={setVisitDestinations}
                                labelKey="name"
                                valueKey="id"
                                placeholder="Select New Destinations"
                                height={350}
                                width='92%'
                            />
                        </View>
                        <View style={{ marginTop: 7, }}>
                            <Text style={{ fontFamily: FontFamily.poppinsMedium }}>Source Location</Text>
                            <OneValueDropDown
                                options={locations}
                                selectedValue={newSource}
                                onValueSelect={setNewSource}
                                labelKey="name"
                                valueKey="id"
                                placeholder="Select Source"
                                height={350}
                                width='92%'
                            />
                        </View>
                        <Pressable style={{ backgroundColor: Color.redishLook, width: '70%', alignSelf: 'center', height: 45, alignItems: 'center', justifyContent: 'center', borderRadius: 40, }}>
                            <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 13, color: '#fff' }}>Re Route</Text>
                        </Pressable>
                    </View>
                }
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    }
})

export default App;