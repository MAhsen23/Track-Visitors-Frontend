import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Image, StyleSheet, FlatList } from "react-native";
import url from "../ApiUrl";
import { FontFamily, Color } from "../GlobalStyles";

const Alerts = (props) => {
    const [error, setError] = useState('');
    const [alerts, setAlerts] = useState([]);

    const showError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 5000);
    };

    const fetchAlerts = async () => {
        try {
            const response = await fetch(`${url}GetAllAlerts`);
            if (response.ok) {
                const data = await response.json();
                setAlerts(data);
                console.log(data)
                setError('');
            } else {
                throw new Error('Failed to fetch all alerts.');
            }
        } catch (error) {
            showError('An error occurred while fetching all alerts.');
            console.error('Error occurred during API request:', error);
        }
    };

    useEffect(() => {
        fetchAlerts();

        const refreshInterval = setInterval(() => {
            fetchAlerts();
        }, 30000);

        return () => {
            clearInterval(refreshInterval);
        };
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Pressable onPress={() => { props.navigation.goBack() }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
                </Pressable>
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>ALERTS</Text>
                <Image style={{ tintColor: Color.white, width: 30, height: 30, }} source={require('../assets/menu.png')} />
            </View >
            <View style={styles.container}>
                {alerts.length === 0 ? (
                    <Text style={styles.heading}>No alerts</Text>
                ) : (
                    <FlatList
                        data={alerts}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={[
                                styles.alertItem,
                                item.type === 'warning' ? { backgroundColor: '#FFA172' } : { backgroundColor: '#ffcccc' }
                            ]}>
                                <View style={styles.row}>
                                    <Text style={styles.heading}>Destination: <Text>{item.destinations}</Text></Text>
                                    <Text style={styles.heading}>{item.time}</Text>
                                </View>
                                <Text style={[styles.detail, { textAlign: "right", marginTop: 12 }]}>Camera -- {item.camera_name}</Text>
                                <View style={styles.info}>
                                    <Text style={styles.heading}>Current Location  <Text style={styles.detail}>{item.current_location}</Text></Text>
                                    <Text style={styles.heading}>Visitor name  <Text style={styles.detail}>{item.visitor_name}</Text></Text>
                                    <Text style={styles.heading}>Contact  <Text style={styles.detail}>{item.visitor_contact}</Text></Text>
                                </View>
                            </View>
                        )}
                    />
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    alertItem: {
        paddingVertical: 15,
        paddingHorizontal: 12,
        borderRadius: 8,
        elevation: 2,
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: "space-between",
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
    },
    heading: {
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 16,
    },
    detail: {
        fontSize: 15,
        fontFamily: FontFamily.poppinsMedium,
    }
})

export default Alerts;
