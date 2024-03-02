import React, { useEffect } from "react";
import {
    Text,
    StyleSheet,
    Pressable,
    View,
    ImageBackground,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { FontFamily } from "../GlobalStyles";
import { Color } from "../GlobalStyles";
import { FontSize } from "../GlobalStyles";

const Splash = (props) => {

    return (
        <View style={styles.splashscreenandroid}>
            <StatusBar
                backgroundColor="white"
                barStyle="dark-content"
            />
            <ImageBackground
                style={styles.logo3Icon}
                resizeMode="cover"
                source={require("../assets/logo.png")}
            />
            <Text style={styles.visitorTrackingSystem}>Visitor Tracking System</Text>
            <Text style={styles.smartTrackingFor}>
                Smart tracking for safer and efficient university visits
            </Text>
            <Pressable style={styles.button} onPress={() => {
                props.navigation.navigate('Login');
            }}>
                <Text style={styles.getStarted}>
                    Get Started
                </Text>
            </Pressable>
        </View >
    );
};

const styles = StyleSheet.create({
    logo3Icon: {
        width: 125,
        height: 128,
        marginTop: 152,
    },

    visitorTrackingSystem: {
        fontSize: 26,
        fontWeight: "500",
        fontFamily: 'Poppins-Medium',
        textAlign: "center",
        color: '#0081a7',
        marginTop: 37,
    },
    smartTrackingFor: {
        fontSize: 15,
        fontFamily: FontFamily.poppinsRegular,
        textAlign: "center",
        color: Color.steelblue,
        marginTop: 8,
        letterSpacing: 0.3,
    },
    splashscreenandroid: {
        backgroundColor: '#ffffff',
        flex: 1,
        width: "100%",
        height: 800,
        overflow: "hidden",
        alignItems: "center",
        paddingLeft: 30,
        paddingRight: 30,
    },
    button: {
        width: '100%',
        backgroundColor: Color.deepskyblue,
        height: 57,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 70,
    },
    getStarted: {
        fontSize: FontSize.size_base,
        fontWeight: "600",
        fontFamily: FontFamily.poppinsSemibold,
        color: Color.white
    }
});

export default Splash;