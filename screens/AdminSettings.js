import React, { useState, useRef, useEffect } from "react";
import { Text, StatusBar, StyleSheet, View, Image, Pressable, ScrollView, Alert } from "react-native";
import { FontFamily, Color } from "../GlobalStyles";

const App = (props) => {

    const { id } = props.route.params;

    const [error, setError] = useState('');

    const showError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 5000);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Pressable onPress={() => { props.navigation.goBack() }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
                </Pressable>
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>SETTINGS</Text>
                <Image style={{ tintColor: Color.white, width: 30, height: 30, }} source={require('../assets/menu.png')} />
            </View >
            <View style={styles.container}>
                {error !== '' && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
                <View style={styles.settingItemsContainer}>
                    <Pressable onPress={() => { props.navigation.navigate('Login') }} style={{
                        backgroundColor: '#fff',
                        marginBottom: 10,
                        elevation: 2,
                        padding: 15,
                        borderRadius: 5,
                    }}>
                        <Text style={[styles.settingItemText, { fontFamily: FontFamily.poppinsMedium }]}>Logout</Text>
                    </Pressable>
                </View>
            </View >
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    errorContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    errorText: {
        color: 'red',
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 13,
        textAlign: 'center',
    },
    settingItemsContainer: {
        marginTop: 30,
    },
    settingItemText: {
        fontFamily: FontFamily.poppinsRegular,
    },
})
export default App;