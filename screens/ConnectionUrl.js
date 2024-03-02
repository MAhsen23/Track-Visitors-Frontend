import React, { useState, useEffect } from "react";
import { Text, TextInput, StatusBar, StyleSheet, View, Image, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Color, FontFamily } from "../GlobalStyles";

const ConnectionUrl = (props) => {
    const [url, setUrl] = useState(global.url);

    useEffect(() => {
        setStoredUrl();
    }, []);

    const setStoredUrl = async () => {
        try {
            const storedUrl = await AsyncStorage.getItem("globalUrl");
            if (storedUrl !== null) {
                setUrl(storedUrl);
            }
        } catch (error) {
            console.error("Error retrieving global URL from AsyncStorage:", error);
        }
    };

    const saveUrl = async () => {
        try {
            await AsyncStorage.setItem("globalUrl", url);
            global.url = url;
        } catch (error) {
            console.error("Error saving global URL to AsyncStorage:", error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar
                hidden={true}
                backgroundColor={Color.lightsteelblue}
                barStyle="light-content"
            />
            <View>
                <View style={{ backgroundColor: Color.lightsteelblue, elevation: 2, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, paddingTop: 40, paddingBottom: 22, marginBottom: 20, paddingLeft: 30, paddingRight: 30, flexDirection: 'row', justifyContent: "space-between" }}>
                    <View style={[styles.welcomeContainer]}>
                        <Text style={{ fontFamily: FontFamily.poppinsRegular, fontSize: 20, color: Color.white }}>
                            Connection URL <Text style={{ fontFamily: FontFamily.poppinsMedium, }}></Text>
                        </Text>
                    </View>
                    <Pressable onPress={() => props.navigation.navigate('Login')}>
                        <Image
                            source={require("../assets/Logout.png")}
                            style={{ tintColor: '#fff', width: 30, height: 30 }}
                        />
                    </Pressable>
                </View>
            </View >
            <View style={{ padding: 20, }}>
                <View style={{ elevation: 1, backgroundColor: '#fff', padding: 5, borderRadius: 5, justifyContent: 'center' }}>
                    <TextInput style={{ fontFamily: FontFamily.poppinsRegular, fontSize: 15 }} value={url} onChangeText={val => setUrl(val)} />
                </View>
                <Pressable style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: Color.redishLook, width: '40%', marginTop: 20, height: 40, borderRadius: 30 }} onPress={saveUrl}>
                    <Text style={{ color: '#fff', fontFamily: FontFamily.poppinsMedium }}>Save</Text>
                </Pressable>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    logout: {
        color: '#0081A7',
        textAlign: 'right',
        marginTop: 20,
        marginBottom: 10,
        marginRight: 30,
        fontSize: 16,
        fontFamily: FontFamily.poppinsMedium,
        fontWeight: "500",
    },
    icons: {
        width: 50,
        height: 50,
        marginBottom: 10,
    },
    welcomeContainer: {
        marginBottom: 15,
    },
});

export default ConnectionUrl;
