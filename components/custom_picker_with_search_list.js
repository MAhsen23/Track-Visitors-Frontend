import React from 'react';
import { View, Pressable, Text, FlatList, Image, Modal, StyleSheet, TextInput } from 'react-native';
import { FontFamily } from '../GlobalStyles';

const CustomPickerWithSearch_List = ({ visible, setVisible, selectedValues, onValueChange, data, onSearchData, searchRef }) => {
    return (
        <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={() => setVisible(false)}>
            <View style={styles.modalContainer}>
                <View style={styles.dropdownarea}>
                    <TextInput
                        ref={searchRef}
                        placeholder="Search"
                        style={styles.searchInputDd}
                        onChangeText={(txt) => onSearchData(txt)}
                    />
                    <FlatList
                        data={data}
                        renderItem={({ item }) => {
                            const isSelected = selectedValues.includes(item);
                            return (
                                <Pressable
                                    style={[
                                        styles.dropdownitem,
                                        isSelected && styles.selectedItem,
                                    ]}
                                    onPress={() => onValueChange(item)}
                                >
                                    <Text style={{ color: isSelected ? 'black' : 'grey', fontSize: 13, fontFamily: FontFamily.poppinsRegular }}>{item}</Text>
                                    {isSelected && (
                                        <Image
                                            source={require('../assets/tick.png')}
                                            style={styles.tickIcon}
                                        />
                                    )}
                                </Pressable>
                            );
                        }}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <View style={{ marginHorizontal: 20 }}>
                        <Pressable onPress={() => {
                            setVisible(!visible)
                        }} >
                            <Text style={{ fontFamily: FontFamily.poppinsMedium, alignSelf: 'center' }}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    dropdownarea: {
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        width: '85%',
        height: 300,
        borderRadius: 7,
        marginTop: 10,
        backgroundColor: '#fff',
        elevation: 3,
        alignSelf: 'center',
    },
    dropdownitem: {
        width: '100%',
        alignSelf: 'center',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 0.2,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    searchInputDd: {
        width: '85%',
        height: 50,
        borderBottomColor: '#00bfff',
        borderBottomWidth: 0.6,
        alignSelf: 'center',
        padding: 0,
        marginBottom: 7,
    },
    tickIcon: {
        width: 12.5,
        height: 12.5,
        marginRight: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
})

export default CustomPickerWithSearch_List;

