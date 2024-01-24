import React, { useState, useEffect } from 'react';
import { View, Text, Image, Alert, TouchableOpacity, StyleSheet, Modal, TextInput, Button, FlatList, ScrollView, Pressable } from 'react-native';
import { FontFamily, Color } from '../GlobalStyles';
import url from '../ApiUrl';


const MatrixScreen = (props) => {
    const [adjacencyMatrix, setAdjacencyMatrix] = useState([]);
    const [rowNames, setRowNames] = useState([]);
    const [columnNames, setColumnNames] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);
    const [newTime, setNewTime] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCameraMatrix();
    }, []);

    const fetchCameraMatrix = async () => {
        try {
            const response = await fetch(`${url}GetCameraMatrix`);
            if (response.ok) {
                const data = await response.json();
                setAdjacencyMatrix(data.matrix);
                setRowNames(data.rowNames);
                setColumnNames(data.columnNames);
                setError('');
            } else {
                throw new Error('Failed to fetch camera matrix.');
            }
        } catch (error) {
            setError('An error occurred while fetching camera matrix.');
            console.error('Error occurred during API request:', error);
        }
    };

    const handleSave = async () => {
        if (editMode) {
            try {
                const response = await fetch(`${url}UpdateMatrix`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        matrix: adjacencyMatrix,
                        rowNames: rowNames,
                        columnNames: columnNames,
                    }),
                });
                if (response.ok) {
                    setError('');
                    setEditMode(false);

                    Alert.alert('Success', 'Matrix updated successfully.');
                    fetchCameraMatrix();
                } else {
                    throw new Error('Failed to update matrix.');
                }
            } catch (error) {
                setError('An error occurred while updating matrix.');
                console.error(error);
            }
        }
        else {
            Alert.alert('Warning', 'Please edit the matrix first.');
        }
    };

    const handleEdit = () => {
        if (editMode) {
            Alert.alert(
                'Disable Edit Mode',
                'Are you sure you want to disable edit mode? All your edits will be lost. Press the save button to save your changes.',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Disable',
                        style: 'destructive',
                        onPress: () => {
                            setEditMode(false);
                            fetchCameraMatrix();
                        },
                    },
                ]
            );
        } else {
            setEditMode(true);
        }
    };

    const handleCellPress = (rowIndex, columnIndex) => {
        if (editMode) {
            setSelectedCell({ rowIndex, columnIndex });
            setIsModalVisible(true);
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedCell(null);
        setNewTime('');
    };

    const handleModalDone = () => {
        if (selectedCell) {
            const { rowIndex, columnIndex } = selectedCell;
            const updatedMatrix = [...adjacencyMatrix];
            if (!newTime) {
                updatedMatrix[rowIndex][columnIndex] = -1;
                updatedMatrix[columnIndex][rowIndex] = -1;
            }
            else {
                updatedMatrix[rowIndex][columnIndex] = newTime;
                updatedMatrix[columnIndex][rowIndex] = newTime;
            }
            setAdjacencyMatrix(updatedMatrix);
            handleModalClose();
        }
    };


    const renderRow = (({ item, index }) => {
        return (
            <View style={styles.row}>
                <View style={[styles.headerCell, { width: 130, paddingHorizontal: 1, }]}>
                    <Text style={styles.headerCellText}>{rowNames[index]}</Text>
                </View>
                {item.map((value, colIndex) => (
                    <Pressable
                        key={colIndex}
                        style={[
                            styles.cell,
                            editMode &&
                            (index === colIndex
                                ? null
                                : styles.editableCell),
                        ]}
                        onPress={() => handleCellPress(index, colIndex)}
                        disabled={!editMode || index === colIndex}
                    >
                        <Text style={styles.cellText}>{value >= 0 ? value : '-'}</Text>
                    </Pressable>
                ))}
            </View>
        )
    })

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Pressable onPress={() => { props.navigation.goBack() }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
                </Pressable>
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>CAMERA CONNECTIONS</Text>
                <Image style={{ tintColor: Color.white, width: 30, height: 30, }} source={require('../assets/menu.png')} />
            </View >
            <View style={styles.container}>
                {error !== '' && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
                <ScrollView horizontal>
                    <View style={styles.matrixContainer}>
                        <FlatList
                            data={adjacencyMatrix}
                            ListHeaderComponent={
                                <View style={styles.row}>
                                    <View style={[styles.headerCell, { width: 130 }]} />
                                    {columnNames.map((columnName, index) => {
                                        const columnNameSplit = columnName.split(' ');
                                        const initials = columnNameSplit.map(word => word.charAt(0)).join('');

                                        return (
                                            <View key={index} style={styles.headerCell}>
                                                <Text style={styles.headerCellText}>{initials}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            }
                            renderItem={renderRow}
                            keyExtractor={(_, index) => index.toString()}
                            scrollEnabled={true}
                        />
                    </View>
                </ScrollView>
                <Modal visible={isModalVisible} animationType="slide" transparent>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalHeader}>
                                {selectedCell ? `${rowNames[selectedCell.rowIndex]}-${columnNames[selectedCell.columnIndex]}` : ''}
                            </Text>
                            <Text style={styles.modalSubheader}>Enter new time:</Text>
                            <TextInput
                                style={styles.modalInput}
                                value={newTime}
                                placeholder="Time"
                                onChangeText={setNewTime}
                                keyboardType="numeric"
                            />
                            <Button title="Done" onPress={handleModalDone} />
                        </View>
                    </View>
                </Modal>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button]} onPress={handleEdit}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View >
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
    },
    matrixContainer: {
        flex: 1,
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    cell: {
        width: 52,
        height: 52,
        margin: 5,
        borderWidth: 1,
        borderColor: 'lightgrey',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    cellText: {
        fontSize: 15.5,
        fontFamily: FontFamily.poppinsRegular
    },
    headerCell: {
        width: 52,
        height: 52,
        margin: 5,
        borderWidth: 1,
        borderColor: 'lightgrey',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f2f2f2',
    },
    headerCellText: {
        fontSize: 16,
        fontFamily: FontFamily.poppinsMedium
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontFamily: FontFamily.poppinsSemibold,
        textAlign: 'center',
    },
    editableCell: {
        backgroundColor: 'lightpink',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        paddingHorizontal: 40,
        paddingVertical: 30,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'gray',
    },
    modalHeader: {
        fontSize: 18,
        fontFamily: FontFamily.poppinsRegular,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalSubheader: {
        fontSize: 16,
        fontFamily: FontFamily.poppinsRegular,
        marginBottom: 10,
        textAlign: 'center',
    },
    modalInput: {
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});

export default MatrixScreen;
