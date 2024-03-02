import React, { useState, useEffect } from "react";
import {
    View, Image,
    StyleSheet, ScrollView, Text, FlatList, Pressable,
} from 'react-native';
import HeaderBar from '../components/header_bar'
import Picker from "../components/one_value_picker_with_mul_labels";
import { Color, FontFamily } from "../GlobalStyles";
import CustomDropdown from '../components/multi_value_picker';
import OneValueDropDown from '../components/one_value_picker'

const App = (props) => {

    const [currentVisitors, setCurrentVisitors] = useState([]);
    const [selectedVisitor, setSelectedVisitor] = useState('');

    const [visitDestinations, setVisitDestinations] = useState([]);
    const [visitData, setVisitData] = useState([]);

    useEffect(() => {
        fetchCurrentVisitors();
    }, [])

    useEffect(() => {
        if (selectedVisitor) {
            fetchVisitDestinations();
        }
    }, [selectedVisitor])



    const fetchVisitDestinations = async () => {
        try {
            const response = await fetch(`${global.url}GetVisitDestinations?id=${selectedVisitor}`);
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
            const response = await fetch(`${global.url}GetCurrentVisitors`);
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
            <HeaderBar title="Visitor Mode" />
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
                    <View>
                        <View style={{ backgroundColor: Color.deepskyblue, paddingVertical: 15, paddingHorizontal: 10, borderRadius: 8, elevation: 1, }}>
                            <Text style={{ color: '#fff', fontFamily: FontFamily.poppinsSemibold, borderBottomColor: Color.white, borderBottomWidth: 1, marginBottom: 10, fontSize: 14, }}>Visitor Destinations</Text>
                            <Text style={{ color: '#fff', fontFamily: FontFamily.poppinsRegular, fontSize: 14, }}>{visitData.visit_destinations_names ? (visitData.visit_destinations_names.join(', ')) : null}</Text>
                        </View>
                        <Pressable onPress={() => {

                            const foundObject = currentVisitors.find(item => item.id === selectedVisitor)
                            let name = null;
                            let id = null;
                            if (foundObject) {
                                id = foundObject.id
                                name = foundObject.name;
                                props.navigation.navigate('VisitorDashboard', { id, name })
                            }

                        }} style={{ borderRadius: 7, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginTop: 15, width: '90%', height: 42, backgroundColor: Color.lightsteelblue, }} >
                            <Text style={{ color: '#fff', fontFamily: FontFamily.poppinsRegular }}>Login as Visitor</Text>
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