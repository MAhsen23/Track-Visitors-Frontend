import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    FlatList,
    StyleSheet,
    Image,
    Pressable,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { FontFamily } from '../GlobalStyles';
import url from '../ApiUrl';
import { Color } from '../GlobalStyles';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';


const roles = [
    { "label": 'Admin', "value": "Admin" },
    { "label": 'Guard', "value": "Guard" },
    { "label": 'Monitor', "value": "Monitor" }
];

const MyScreen = (props) => {
    const [users, setUsers] = useState([]);
    const [role, setRole] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [buttonState, setButtonState] = useState('Add');
    const [searchMode, setSearchMode] = useState(false);
    const [searchUsers, setSearchUsers] = useState([]);


    const [editUserId, setEditUserId] = useState('');

    const [showPassword, setShowPassword] = useState(false);


    const mainSearchRef = useRef();

    useEffect(() => {
        fetchUsers();
    }, []);

    const showError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 5000);
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${url}GetAllUsers`);
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
                setSearchUsers(data);
                setError('');
            } else {
                throw new Error('Failed to fetch users.');
            }

        } catch (error) {
            showError('An error occurred while fetching users.');
            console.error('Error occurred during API request:', error);
        }
    };


    const onMainSearch = (txt) => {
        if (txt !== '') {
            let tempData = users.filter((item) => {
                for (let key in item) {
                    if (key !== 'id' && typeof item[key] === 'string')
                        if (item[key].toLowerCase().includes(txt.toLowerCase())) {
                            return true;
                        }
                }
                return false;
            });
            setSearchUsers(tempData);
        } else {
            setSearchUsers(users);
        }
    }


    const deleteUser = async (id) => {
        try {
            const response = await fetch(`${url}/DeleteUser/${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                setError('');
                if (buttonState === 'Edit') {

                    setEditUserId('');
                    setName('');
                    setRole('');
                    setUsername('');
                    setPassword('');
                    setButtonState('Add');

                }
                Alert.alert('Success', 'User deleted successfully.');
                fetchUsers();
            } else {
                throw new Error('Failed to delete user.');
            }
        } catch (error) {
            showError('An error occurred while deleting the user.');
        }
    }

    const insertUser = async () => {
        if (!name || !username || !password || !role) {
            Alert.alert('Error', 'Please enter data first!');
            return;
        }

        try {
            const response = await fetch(`${url}AddUser`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    username: username,
                    password: password,
                    role: role,
                }),
            });
            if (response.ok) {
                setError('');
                setName('');
                setUsername('');
                setPassword('');
                setRole('');
                Alert.alert('Success', 'User inserted successfully.');
                fetchUsers();
            } else {
                throw new Error('Failed to insert user.');
            }
        } catch (error) {
            showError('An error occurred while inserting user.');
            console.error(error);
        }
    };



    const updateUser = async () => {
        if (!name || !username || !password || !role || !editUserId) {
            Alert.alert('Error', 'Please enter data first!');
            return;
        }
        try {
            const response = await fetch(`${url}/UpdateUser/${editUserId}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    username: username,
                    password: password,
                    role: role,
                }),
            });
            if (response.ok) {
                setError('');
                setEditUserId('');
                setButtonState('Add')
                setName('');
                setRole('');
                setUsername('');
                setPassword('');
                Alert.alert('Success', 'User updated successfully.');
                fetchUsers();
            } else {
                throw new Error('Failed to update user.');
            }
        } catch (error) {
            showError('An error occurred while updating the user.');
        }
    }


    let rowRefs = new Map();

    const renderItem = ({ item }) => (
        <GestureHandlerRootView >

            <Swipeable renderRightActions={(progress, dragX) => rightActions(progress, dragX, item.id)}
                key={item.id}
                ref={ref => {
                    if (ref && !rowRefs.get(item.id)) {
                        rowRefs.set(item.id, ref);
                    }
                }}
                onSwipeableWillOpen={() => {
                    [...rowRefs.entries()].forEach(([key, ref]) => {
                        if (key !== item.id && ref) ref.close();
                    });
                }}
            >
                <View style={styles.row}>
                    <Text style={styles.itemText}>{item.name}</Text>
                    <Text style={styles.itemText}>{item.username}</Text>
                    <Text style={styles.itemText}>{item.role}</Text>
                </View>
            </Swipeable>
        </GestureHandlerRootView >
    );



    const rightActions = (progress, dragX, id) => {

        const rowScale = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [1, 0.7],
            extrapolate: 'clamp'
        });



        return (
            <Animated.View style={{
                flexDirection: 'row', transform: [{ scale: rowScale }],
            }} >
                <TouchableOpacity onPress={() => {

                    setEditUserId(id);
                    const foundUser = users.find(obj => obj.id === id);
                    setName(foundUser.name);
                    setRole(foundUser.role);
                    setUsername(foundUser.username);
                    setPassword(foundUser.password);
                    setButtonState('Edit')

                }} style={{ backgroundColor: 'white', height: '100%', padding: 11, marginLeft: 5, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/editing2.png')} style={{ width: 20, height: 20, tintColor: '#33B5E6' }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    Alert.alert(
                        'Confirmation',
                        'Are you sure you want to delete this user?',
                        [
                            {
                                text: 'Cancel',
                                style: 'cancel',
                            },
                            {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: () => deleteUser(id),
                            },
                        ]
                    );
                }}
                    style={{ backgroundColor: 'white', height: '100%', padding: 11, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/delete7.png')} style={{ width: 20, height: 20, tintColor: 'red' }} />
                </TouchableOpacity>
            </Animated.View >
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ alignItems: 'center', backgroundColor: Color.white, elevation: 2, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, height: 65, marginBottom: 5, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: "space-between" }}>
                <Pressable onPress={() => { props.navigation.goBack() }}>
                    <Image style={{ tintColor: Color.lightsteelblue, width: 32, height: 32, }} source={require('../assets/back.png')} />
                </Pressable>
                <Text style={{ fontFamily: FontFamily.poppinsMedium, fontSize: 19.5, letterSpacing: .4, color: Color.lightsteelblue }}>USERS</Text>
                <Image style={{ tintColor: Color.white, width: 30, height: 30, }} source={require('../assets/menu.png')} />
            </View >

            <View style={styles.container}>
                {error !== '' && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
                {buttonState === "Edit" && (
                    <View style={styles.editModeBar}>
                        <Text style={styles.editModeText}>Edit Mode Enabled</Text>
                        <TouchableOpacity onPress={() => {

                            setButtonState("Add");
                            setName("");
                            setRole("");
                            setUsername("");
                            setPassword("");
                            setEditUserId("");

                        }}>
                            <Image source={require('../assets/multiply.png')} style={styles.editModeIcon} />
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput style={styles.input} value={name} onChangeText={setName} />
                    </View>
                    <Text style={styles.label}>Role</Text>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        itemTextStyle={styles.textItem}
                        data={roles}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select role"
                        searchPlaceholder="Search..."
                        value={role}
                        onChange={item => {
                            setRole(item.value);
                        }}
                    />
                    <View style={styles.inlineInputContainer}>
                        <View style={styles.inlineInputLeft}>
                            <Text style={styles.label}>Username</Text>
                            <TextInput style={styles.input} value={username} onChangeText={setUsername} />
                        </View>
                        <View style={styles.inlineInputRight}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.passwordInputContainer}>
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconContainer}>
                                    <Image
                                        source={showPassword ? require('../assets/eye1.png') : require('../assets/hide1.png')}
                                        style={{ width: 20, height: 20, tintColor: Color.deepskyblue, opacity: 0.7 }}
                                    />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    <Button title={buttonState === 'Edit' ? 'Update' : 'Insert'} onPress={() => {
                        if (buttonState == 'Add') {
                            insertUser();
                        }
                        else {
                            updateUser();
                        }
                    }} />
                </View>

                <View style={styles.headerTopBar}>
                    <Text style={styles.headerTopBarText}>Saved Users</Text>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={() => {
                            setSearchMode(!searchMode)
                        }}>
                            <Image style={styles.mainIcon} source={require('../assets/search2.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                {searchMode &&
                    <View style={styles.searchBar}>
                        <TextInput
                            ref={mainSearchRef}
                            style={styles.searchInput}
                            placeholder="Search"
                            onChangeText={txt => onMainSearch(txt)}
                        />
                    </View>
                }

                <View style={styles.listContainer}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Name</Text>
                        <Text style={styles.headerText}>Username</Text>
                        <Text style={styles.headerText}>Role</Text>
                    </View>

                    <FlatList style={styles.flatList} data={searchUsers} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    inputContainer: {
        marginBottom: 10,
    },
    inlineInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    inlineInputLeft: {
        flex: 1,
        marginRight: 6,
    },
    inlineInputRight: {
        flex: 1,
        marginLeft: 6,
    },
    label: {
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 15,
        marginBottom: 5,
    },
    input: {
        height: 47,
        borderColor: '#e1e1e1',
        borderWidth: 1,
        paddingHorizontal: 10,
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 13,
        borderRadius: 5,
    },
    searchBar: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    searchInput: {
        borderColor: '#e1e1e1',
        borderRadius: 15,
        borderWidth: 1,
        paddingHorizontal: 12,
        fontFamily: FontFamily.poppinsMedium,
        paddingVertical: 7,
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1',
    },
    headerText: {
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 15,
        flex: 1,
    },
    item: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1',
    },
    itemText: {
        fontFamily: FontFamily.poppinsRegular,
        fontSize: 14,
        flex: 1,
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
    flatList: {
        marginBottom: 35,
    },
    headerTopBar: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: Color.deepskyblue,
        marginHorizontal: 20,
        marginVertical: 10,
        elevation: 2,
        borderRadius: 7,
    },
    headerTopBarText: {
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 16,
        color: 'white'
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginRight: 10,
    },
    mainIcon: {
        marginLeft: 18,
        width: 18,
        height: 18,
        tintColor: 'white',
    },
    tickIcon: {
        marginLeft: 10,
        width: 15,
        height: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
        marginHorizontal: 1,
        elevation: 1,
        borderRadius: 3,
        paddingVertical: 10,
        backgroundColor: "#fff",
        paddingHorizontal: 6,
    },
    cell: {
        fontSize: 15,
        fontFamily: FontFamily.poppinsRegular,
        textAlign: 'left',
        flex: 1,
        color: '#000'
    },
    editModeBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F35469',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginVertical: 8,
        marginHorizontal: 5,
        borderRadius: 5,
    },
    editModeText: {
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 15,
        color: 'white',
    },
    editModeIcon: {
        width: 22,
        height: 22,
        tintColor: 'white',
    },









    dropdown: {
        height: 47,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        marginBottom: 10,
        borderColor: '#e1e1e1',
        borderWidth: 1,
        borderRadius: 5,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 14,
        fontFamily: FontFamily.poppinsRegular,
    },
    placeholderStyle: {
        fontSize: 14,
        fontFamily: FontFamily.poppinsRegular,
    },
    selectedTextStyle: {
        fontSize: 14,
        fontFamily: FontFamily.poppinsMedium,
    },
    inputSearchStyle: {
        fontSize: 13,
        fontFamily: FontFamily.poppinsRegular,
        textAlignVertical: "center"
    },


    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eyeIconContainer: {
        position: 'absolute',
        right: 10,
    },

});

export default MyScreen;
