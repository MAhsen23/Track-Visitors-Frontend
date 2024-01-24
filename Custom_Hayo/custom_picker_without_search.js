import React from 'react';
import { View, Pressable, Text, FlatList, Image, Modal, StyleSheet } from 'react-native';
import { FontFamily } from '../GlobalStyles';

const CustomPicker = ({ visible, setVisible, selectedValue, onValueChange, data }) => {
    const handleSelection = (item) => {
        onValueChange(item);
        setVisible(false);
    };

    const renderItem = ({ item }) => {
        const isSelected = selectedValue === item;

        return (
            <Pressable
                style={[styles.dropdownitem, isSelected && styles.selectedItem]}
                onPress={() => handleSelection(item)}
            >
                <Text style={[styles.dropdownText, isSelected && styles.selectedItemText]}>
                    {item}
                </Text>
                {isSelected && (
                    <Image
                        source={require('../assets/tick.png')}
                        style={styles.tickIcon}
                    />
                )}
            </Pressable>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.dropdownarea}>
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
        </Modal>
    );
};


const styles = StyleSheet.create({
    dropdownselector: {
        height: 40,
        width: '100%',
        borderWidth: 1,
        borderColor: '#e1e1e1',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    selectedValue: {
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 13,
    },
    icon: {
        width: 14,
        height: 14,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dropdownarea: {
        width: '85%',
        maxHeight: 200,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 15,
    },
    dropdownitem: {
        paddingVertical: 10,
        paddingHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownText: {
        flex: 1,
        color: 'grey',
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 13,
    },
    selectedItem: {
        backgroundColor: '#fff',
    },
    selectedItemText: {
        color: 'black',
    },
    tickIcon: {
        width: 12.5,
        height: 12.5,
        marginLeft: 10,
    },
})

export default CustomPicker;