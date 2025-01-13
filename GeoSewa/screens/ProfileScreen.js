import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNav from '../components/BottomNav';

const ProfileScreen = ({ navigation }) => {
    const user = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '+977-9812345678',
    };

    return (
        <View style={styles.container}>
            <View style={styles.topIcons}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.icon}>
                    <MaterialIcons name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
            </View>

            {/* Profile Header */}
            <View style={styles.profileHeader}>
            <TouchableOpacity style={styles.profilePicture}>
                <Ionicons name="person-circle-outline" size={120} color="#d0d0d0" />
            </TouchableOpacity>
            </View>

            <View style={styles.profileHeader}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userPhone}>{user.phone}</Text>
            </View>

            {/* Profile Options */}
            <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.optionItem}>
                    <MaterialIcons name="edit" size={24} color="#4C9BF1" />
                    <Text style={styles.optionText}>Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionItem}>
                    <MaterialIcons name="lock" size={24} color="#4C9BF1" />
                    <Text style={styles.optionText}>Change Password</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionItem}>
                    <MaterialIcons name="settings" size={24} color="#4C9BF1" />
                    <Text style={styles.optionText}>Settings</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionItem}>
                    <MaterialIcons name="logout" size={24} color="#F44336" />
                    <Text style={[styles.optionText, styles.logoutText]}>Logout</Text>
                </TouchableOpacity>
            </View>
            <BottomNav navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
        paddingTop: 50,
        
    },
    topIcons: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 10,
    },
    icon: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 50,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F1F1F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4C9BF1',
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 16,
        color: '#A0A0A0',
        marginBottom: 2,
    },
    userPhone: {
        fontSize: 16,
        color: '#A0A0A0',
    },
    optionsContainer: {
        marginTop: 20,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F1F1',
    },
    optionText: {
        fontSize: 16,
        marginLeft: 10,
        color: '#4C9BF1',
    },
    logoutText: {
        color: '#F44336',
    },
});

export default ProfileScreen;
