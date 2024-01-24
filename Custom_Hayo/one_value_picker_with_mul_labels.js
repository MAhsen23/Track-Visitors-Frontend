import React, { useState } from 'react';
import { View, Image, Modal, TouchableOpacity, TextInput, Text, ScrollView, Pressable } from 'react-native';
import { Color, FontFamily } from '../GlobalStyles';

const Picker = ({ placeholder, width, height, options, selectedValue, onValueSelect, labelKeys, valueKey, selectedValueLabels }) => {
    const [searchText, setSearchText] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleValueSelect = (value) => {
        onValueSelect(value);
        setIsDropdownOpen(!isDropdownOpen)
    };

    return (
        <View style={{ marginBottom: 20 }}>
            <Pressable
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                    backgroundColor: 'white',
                    borderRadius: 5,
                    padding: 14,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 1.41,
                    elevation: 1,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{ fontFamily: FontFamily.poppinsRegular, fontSize: 14, }}
                >
                    {selectedValue ? selectedValueLabels.map((key) => options.find((obj) => obj[valueKey] === selectedValue)[key]).join('  -  ') : placeholder}
                </Text>
                <Image
                    source={require('../assets/expand.png')}
                    style={{
                        width: 12.5,
                        height: 12.5,
                    }}
                />
            </Pressable>
            <View>
                <Modal
                    animationType="fade"
                    visible={isDropdownOpen}
                    onRequestClose={() => setIsDropdownOpen(false)}
                    transparent
                >
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <View
                            style={{
                                borderRadius: 8,
                                paddingVertical: 20,
                                paddingHorizontal: 15,
                                maxHeight: height,
                                backgroundColor: '#fff',
                                elevation: 1,
                                width: width,
                            }}
                        >
                            <TextInput
                                placeholder="Search..."
                                value={searchText}
                                onChangeText={(text) => setSearchText(text)}
                                style={{
                                    fontFamily: FontFamily.poppinsMedium,
                                    fontSize: 13,
                                    borderWidth: 1,
                                    borderColor: 'lightgrey',
                                    padding: 5,
                                    borderRadius: 20,
                                    marginBottom: 20,
                                    paddingLeft: 20,
                                }}
                            />

                            <ScrollView>
                                {options
                                    .filter((option) => labelKeys.some((key) => option[key].toString().toLowerCase().includes(searchText.toLowerCase())))
                                    .map((option) => (
                                        <TouchableOpacity
                                            key={option[valueKey]}
                                            onPress={() => handleValueSelect(option[valueKey])}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginBottom: 5,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    borderWidth: 1,
                                                    borderColor: selectedValue === option[valueKey] ? '#3A9EBB' : 'gray',
                                                    marginRight: 10,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {selectedValue === option[valueKey] && (
                                                    <Text
                                                        style={{
                                                            marginBottom: 1, color: selectedValue === option[valueKey] ? '#3A9EBB' : 'gray',
                                                        }}
                                                    >
                                                        ✓
                                                    </Text>
                                                )}
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                {labelKeys.map((key) =>
                                                (
                                                    <Text style={{ fontFamily: FontFamily.poppinsRegular, fontSize: 14, marginBottom: 1, paddingRight: 5, flex: (labelKeys.length === 2) ? 0 : 1 }}>
                                                        {option[key]}
                                                    </Text>
                                                ))}
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                            </ScrollView>
                            <Pressable style={{ marginTop: 15, }} onPress={() => {
                                setIsDropdownOpen(!isDropdownOpen)
                            }} >
                                <Text style={{ fontFamily: FontFamily.poppinsMedium, alignSelf: 'center' }}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
};


export default Picker;
