import React, { useState, useEffect } from "react";
import { View, TextInput, Text, Image, Pressable, StyleSheet } from 'react-native';

const CustomTimePicker = ({ label, selectedTime, setSelectedTime }) => {


    useEffect(() => {
        setSelectedTime(selectedTime);
    }, [selectedTime, setSelectedTime]);

    const incrementHours = () => {
        setSelectedTime((prevTime) => {
            const newHours = (prevTime.hours % 12) + 1;
            return { ...prevTime, hours: newHours };
        });
    };

    const decrementHours = () => {
        setSelectedTime((prevTime) => {
            const newHours = prevTime.hours === 1 ? 12 : prevTime.hours - 1;
            return { ...prevTime, hours: newHours };
        });
    };

    const incrementMinutes = () => {
        setSelectedTime((prevTime) => {
            const newMinutes = prevTime.minutes === 59 ? 0 : prevTime.minutes + 1;
            return { ...prevTime, minutes: newMinutes };
        });
    };

    const decrementMinutes = () => {
        setSelectedTime((prevTime) => {
            const newMinutes = prevTime.minutes === 0 ? 59 : prevTime.minutes - 1;
            return { ...prevTime, minutes: newMinutes };
        });
    };

    const toggleDayPart = () => {
        setSelectedTime((prevTime) => {
            const newDayPart = prevTime.dayPart === 'AM' ? 'PM' : 'AM';
            return { ...prevTime, dayPart: newDayPart };
        });
    };


    const handleHourChange = (text) => {
        const newHours = parseInt(text) || 0;
        const clampedHours = Math.min(12, Math.max(1, newHours)); // Ensure the value is between 1 and 12
        setSelectedTime((prevTime) => {
            return { ...prevTime, hours: clampedHours };
        });
    };

    const handleMinuteChange = (text) => {
        const newMinutes = parseInt(text) || 0;
        const clampedMinutes = Math.min(59, Math.max(0, newMinutes)); // Ensure the value is between 0 and 59
        setSelectedTime((prevTime) => {
            return { ...prevTime, minutes: clampedMinutes };
        });
    };


    return (
        <View>
            <View>
                <Text style={styles.text}>{label}</Text>
            </View>
            <View style={styles.timeContainer}>
                <View style={styles.iconContainer}>
                    <Image style={styles.icon} source={require('../assets/clock.png')} />
                </View>
                <View style={styles.timePicker}>
                    <View style={styles.pickerSection}>
                        <Pressable onPress={incrementHours}>
                            <Image style={styles.arrowIcon} source={require('../assets/uparrow.png')} />
                        </Pressable>
                        <TextInput
                            style={styles.timeTextInput}
                            keyboardType="numeric"
                            value={String(selectedTime.hours < 10 ? `0${selectedTime.hours}` : `${selectedTime.hours}`)}
                            onChangeText={handleHourChange}
                        />
                        <Pressable onPress={decrementHours}>
                            <Image style={styles.arrowIcon} source={require('../assets/downArrow.png')} />
                        </Pressable>
                    </View>
                    <View style={styles.separator}>
                        <Text style={styles.timeText}>:</Text>
                    </View>
                    <View style={styles.pickerSection}>
                        <Pressable onPress={incrementMinutes}>
                            <Image style={styles.arrowIcon} source={require('../assets/uparrow.png')} />
                        </Pressable>
                        <TextInput
                            style={styles.timeTextInput}
                            keyboardType="numeric"
                            value={String(selectedTime.minutes < 10 ? `0${selectedTime.minutes}` : `${selectedTime.minutes}`)}
                            onChangeText={handleMinuteChange}
                        />
                        <Pressable onPress={decrementMinutes}>
                            <Image style={styles.arrowIcon} source={require('../assets/downArrow.png')} />
                        </Pressable>
                    </View>
                </View>
                <View style={styles.dayPartContainer}>
                    <Pressable onPress={toggleDayPart} style={styles.dayPartButton}>
                        <Text style={styles.dayPartText}>{selectedTime.dayPart}</Text>
                        <Image style={styles.syncIcon} source={require('../assets/synchronize.png')} />
                    </Pressable>
                </View>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    text: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        letterSpacing: 0.5,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    iconContainer: {
        backgroundColor: 'deepskyblue',
        borderRadius: 3,
        marginRight: 2,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 25,
        height: 25,
        tintColor: '#fff',
    },
    timePicker: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pickerSection: {
        alignItems: 'center',
        marginHorizontal: 5,
    },
    arrowIcon: {
        width: 25,
        height: 25,
        tintColor: 'grey',
    },
    timeTextContainer: {
        height: 40,
        marginVertical: -1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
    },
    separator: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayPartContainer: {
        backgroundColor: 'white',
        elevation: 1,
        paddingHorizontal: 5,
        borderRadius: 3,
        marginLeft: 8,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayPartButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dayPartText: {
        letterSpacing: 2,
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
    },
    syncIcon: {
        width: 18,
        height: 18,
        marginBottom: 2,
        marginLeft: 2,
        tintColor: 'grey',
    },
    timeTextInput: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        textAlign: 'center',
        width: 40,
    },
});

export default CustomTimePicker
