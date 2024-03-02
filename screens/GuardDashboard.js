// import React, { useEffect } from "react";
// import { Text, BackHandler, StatusBar, StyleSheet, View, Image, TouchableOpacity, ScrollView, Pressable } from "react-native";
// import { Color, FontFamily } from "../GlobalStyles";

// const App = (props) => {
//     const { name, id, duty_location } = props.route?.params;

//     useEffect(() => {
//         const backAction = () => {
//             return true;
//         };
//         const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
//         return () => backHandler.remove();
//     }, []);

//     return (
//         <View style={styles.container}>
//             <StatusBar
//                 backgroundColor={Color.lightsteelblue}
//                 barStyle="light-content"
//             />
//             <View style={{ flex: 1 }}>
//                 <View style={{ backgroundColor: Color.lightsteelblue, elevation: 2, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, paddingTop: 30, paddingBottom: 22, marginBottom: 20, paddingLeft: 30, paddingRight: 30, flexDirection: 'row', justifyContent: "space-between" }}>
//                     <View style={[styles.welcomeContainer]}>
//                         <Text style={{ fontFamily: FontFamily.poppinsRegular, fontSize: 22, color: Color.white }}>
//                             Welcome, <Text style={{ fontFamily: FontFamily.poppinsMedium, }}>{name}</Text>
//                         </Text>
//                         <Text style={{ fontFamily: FontFamily.poppinsRegular, fontSize: 16, color: Color.white }}>Guard</Text>
//                     </View>
//                     <Pressable onPress={() => props.navigation.navigate('GuardSettings', { id })}>
//                         <Image
//                             source={require("../assets/settings.png")}
//                             style={{ tintColor: '#fff', width: 30, height: 30 }}
//                         />
//                     </Pressable>
//                 </View>
//                 <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: 'white' }}>
//                     <View style={styles.buttonContainer}>
//                         <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 }}>
//                             <TouchableOpacity onPress={() => props.navigation.navigate('AddVisitor')} style={styles.buttons}>
//                                 <Image
//                                     style={styles.icons}
//                                     resizeMode="cover"
//                                     source={require("../assets/addIcon.png")}
//                                 />
//                                 <Text style={styles.buttonsText}>Add Visitor</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity onPress={() => props.navigation.navigate('Visit', { id })} style={styles.buttonsRight}>
//                                 <Image
//                                     style={styles.icons}
//                                     resizeMode="cover"
//                                     source={require("../assets/visit.png")}
//                                 />
//                                 <Text style={styles.buttonsText}>New Visit</Text>
//                             </TouchableOpacity>
//                         </View>
//                         <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 }}>
//                             <TouchableOpacity style={styles.buttons} onPress={() => props.navigation.navigate('Alerts')}>
//                                 <Image
//                                     style={styles.icons}
//                                     resizeMode="cover"
//                                     source={require("../assets/notification.png")}
//                                 />
//                                 <Text style={styles.buttonsText}>Alerts</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity onPress={() => { props.navigation.navigate('ExitVisitor') }} style={styles.buttonsRight}>
//                                 <Image
//                                     style={styles.icons}
//                                     resizeMode="cover"
//                                     source={require("../assets/leaveIcon.png")}
//                                 />
//                                 <Text style={styles.buttonsText}>End Visit</Text>
//                             </TouchableOpacity>
//                         </View>
//                         <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 }}>
//                             <TouchableOpacity onPress={() => props.navigation.navigate('CurrentVisitors')} style={styles.buttons}>
//                                 <Image
//                                     style={styles.icons}
//                                     resizeMode="cover"
//                                     source={require("../assets/listicon.png")}
//                                 />
//                                 <Text style={styles.buttonsText}>Current Visitors</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity onPress={() => { props.navigation.navigate('VisitorMode') }} style={styles.buttonsRight}>
//                                 <Image
//                                     style={styles.icons}
//                                     resizeMode="cover"
//                                     source={require("../assets/eye_checked.png")}
//                                 />
//                                 <Text style={styles.buttonsText}>Visitor Mode</Text>
//                             </TouchableOpacity>
//                         </View>

//                     </View>
//                 </ScrollView >
//             </View >
//         </View >
//     );
// }


// styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     buttonContainer: {
//         paddingBottom: 20,
//     },
//     buttons: {
//         width: '40%',
//         height: 150,
//         backgroundColor: "#8CD6FA",
//         borderRadius: 8,
//         padding: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginLeft: 30,
//         elevation: 2,
//     },
//     buttonsRight: {
//         width: '40%',
//         height: 150,
//         backgroundColor: "#8CD6FA",
//         borderRadius: 8,
//         padding: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginRight: 30,
//         elevation: 2,
//     },
//     buttonsText: {
//         color: '#ffffff',
//         fontSize: 19,
//         fontWeight: "500",
//         fontFamily: FontFamily.poppinsMedium,
//         textAlign: "center"
//     },
//     logout: {
//         color: '#0081A7',
//         textAlign: 'right',
//         marginTop: 20,
//         marginBottom: 10,
//         marginRight: 30,
//         fontSize: 16,
//         fontFamily: FontFamily.poppinsMedium,
//         fontWeight: "500",
//     },
//     icons: {
//         width: 50,
//         height: 50,
//         marginBottom: 10,
//     },
//     welcomeContainer: {
//         marginBottom: 15,
//     },
// })

// export default App;


import React from 'react'
import { View, Text, StatusBar, StyleSheet, Pressable, Image } from 'react-native'
import { Color, FontFamily } from '../GlobalStyles';


const GuardDashboard = (props) => {
    const { name, id, duty_location } = props.route?.params;
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar
                backgroundColor={Color.lightsteelblue}
                barStyle="light-content"
            />
            <View>
                <View style={{ backgroundColor: Color.lightsteelblue, elevation: 2, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, paddingTop: 30, paddingBottom: 22, marginBottom: 20, paddingLeft: 30, paddingRight: 30, flexDirection: 'row', justifyContent: "space-between" }}>
                    <View style={[styles.welcomeContainer]}>
                        <Text style={{ fontFamily: FontFamily.poppinsRegular, fontSize: 22, color: Color.white }}>
                            Welcome, <Text style={{ fontFamily: FontFamily.poppinsMedium, }}>{name}</Text>
                        </Text>
                        <Text style={{ fontFamily: FontFamily.poppinsRegular, fontSize: 16, color: Color.white }}>Guard</Text>
                    </View>
                    <Pressable onPress={() => props.navigation.navigate('GuardSettings', { id })}>
                        <Image
                            source={require("../assets/settings.png")}
                            style={{ tintColor: '#fff', width: 30, height: 30 }}
                        />
                    </Pressable>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <Pressable onPress={() => props.navigation.navigate('AddVisitor')} style={styles.button}>
                    <Image style={styles.icon} source={require("../assets/addIcon.png")} />
                    <Text style={styles.buttonText}>Add Visitor</Text>
                </Pressable>
                <Pressable onPress={() => props.navigation.navigate('Visit', { id })} style={styles.button}>
                    <Image
                        style={styles.icon}
                        resizeMode="cover"
                        source={require("../assets/visit.png")}
                    />
                    <Text style={styles.buttonText}>New Visit</Text>
                </Pressable>
                <Pressable onPress={() => props.navigation.navigate('Alerts')} style={styles.button}>
                    <Image
                        style={styles.icon}
                        resizeMode="cover"
                        source={require("../assets/leaveIcon.png")}
                    />
                    <Text style={styles.buttonText}>Alerts</Text>
                </Pressable>
                <Pressable onPress={() => { props.navigation.navigate('ExitVisitor') }} style={styles.button}>
                    <Image
                        style={styles.icon}
                        resizeMode="cover"
                        source={require("../assets/notification.png")}
                    />
                    <Text style={styles.buttonText}> End Visit</Text>
                </Pressable>
                <Pressable onPress={() => props.navigation.navigate('CurrentVisitors')} style={styles.button}>
                    <Image
                        style={styles.icon}
                        resizeMode="cover"
                        source={require("../assets/listicon.png")}
                    />
                    <Text style={styles.buttonText}>Current Visitors</Text>
                </Pressable>
                {/* <Pressable onPress={() => { props.navigation.navigate('VisitorMode') }} style={styles.button}>
                    <Image
                        style={styles.icon}
                        resizeMode="cover"
                        source={require("../assets/visitor_mode.png")}
                    />
                    <Text style={styles.buttonText}>Visitor Mode</Text>
                </Pressable> */}
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    button: {
        width: '45%',
        height: 115,
        elevation: 2,
        backgroundColor: '#fcfcfc',
        marginHorizontal: 5,
        marginVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 14,
    },
    icon: {
        width: 40,
        height: 40,
        marginBottom: 10,
        tintColor: '#757575',
        opacity: 0.8,
    }
})


export default GuardDashboard