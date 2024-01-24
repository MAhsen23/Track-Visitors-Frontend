import React, { useState, useEffect } from "react";
import { Text, Alert, StyleSheet, Pressable, View, Image, TextInput, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontFamily } from "../GlobalStyles";
import { Color } from "../GlobalStyles";
import { FontSize } from "../GlobalStyles";
import url from '../ApiUrl';
import { useNavigation } from "@react-navigation/native";

const Login = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);


    const navigation = useNavigation();

    useEffect(() => {
        const unback = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
        });
        return unback;
    }, [navigation])

    useEffect(() => {
        const loadCredentials = async () => {
            try {
                const savedUsername = await AsyncStorage.getItem("username");
                const savedPassword = await AsyncStorage.getItem("password");

                if (savedUsername && savedPassword) {
                    setUsername(savedUsername);
                    setPassword(savedPassword);
                }
            } catch (error) {
                console.error("Error loading credentials", error);
            }
        };

        loadCredentials();
    }, []);

    const handleLogin = async () => {
        try {
            const response = await fetch(`${url}Login`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error("Invalid Username or Password");
            }

            await AsyncStorage.setItem("username", username);
            await AsyncStorage.setItem("password", password);

            const data = await response.json();

            if (data.length > 0) {

                const user = data[0];
                const name = user.name;
                const id = user.id;
                const duty_location = user.duty_location;

                if (user.role === "Guard") {
                    props.navigation.navigate("GuardDashboard", { name, id, duty_location });
                } else if (user.role === "Admin") {
                    props.navigation.navigate("AdminDashboard", { name, id });
                } else if (user.role === "Monitor") {
                    props.navigation.navigate("MonitorDashboard", { name, id });
                }
            } else {
                throw new Error("Invalid Username or Password");
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };


    return (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.logoIcon}
                        resizeMode="cover"
                        source={require("../assets/loginIcon.png")}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.headingText}>Welcome{'\n'}Back!</Text>
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.inputField}>
                        <Text style={styles.labelText}>Username</Text>
                        <TextInput style={styles.textInput} value={username} onChangeText={username => setUsername(username)} />
                    </View>
                    <View style={styles.inputField}>
                        <Text style={styles.labelText}>Password</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                style={styles.textInput}
                                value={password}
                                onChangeText={(password) => setPassword(password)}
                                secureTextEntry={!showPassword}
                            />
                            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconContainer}>
                                <Image
                                    source={showPassword ? require('../assets/eye1.png') : require('../assets/hide1.png')}
                                    style={{ width: 24, height: 24, tintColor: Color.deepskyblue, opacity: 0.7 }}
                                />
                            </Pressable>
                        </View>
                    </View>
                </View>

                <Pressable style={styles.button} onPress={handleLogin}>
                    {/* <Pressable style={styles.button} onPress={() => props.navigation.navigate("GuardDashboard", { name: "Ali" })}> */}
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>
                <Text style={styles.forgotText}>Forgot your password?</Text>
            </View >
        </ScrollView>
    );
}

export default Login;

const styles = StyleSheet.create({
    logoIcon: {
        width: 215,
        height: 215,
    },
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
        width: "100%",
        height: '100%',
        overflow: "hidden",
        alignItems: "center",
        paddingHorizontal: 30,
    },
    imageContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    textContainer: {
        marginTop: 25,
        alignSelf: "flex-start",
    },
    headingText: {
        fontSize: 26,
        fontWeight: "500",
        fontFamily: 'Poppins-Medium',
        textAlign: "left",
        color: '#0081a7',
    },
    inputContainer: {
        marginTop: 24,
        alignSelf: "flex-start",
    },
    labelText: {
        fontSize: 16,
        fontFamily: FontFamily.poppinsRegular,
        textAlign: "left",
        color: Color.steelblue,
        letterSpacing: 0.3,
    },
    textInput: {
        borderBottomWidth: 1,
        borderColor: Color.deepskyblue,
        minWidth: '100%',
        padding: 0,
        color: 'grey',
        fontSize: 14,
        fontFamily: FontFamily.poppinsRegular,
    },
    inputField: {
        marginBottom: 35,
    },
    button: {
        width: '100%',
        backgroundColor: Color.deepskyblue,
        height: 57,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontSize: FontSize.size_base,
        fontWeight: "600",
        fontFamily: FontFamily.poppinsSemibold,
        color: Color.white
    },
    forgotText: {
        marginTop: 23,
        fontSize: 15,
        fontFamily: FontFamily.poppinsRegular,
        textAlign: "left",
        color: Color.steelblue,
        letterSpacing: 0.3,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eyeIconContainer: {
        position: 'absolute',
        right: 0,
        bottom: 5,
    },

})
