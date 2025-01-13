import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const IssueDetailsScreen = ({ route, navigation }) => {
    const { issue } = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.topIcons}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.icon}>
                    <Icon name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
            </View>
            <Text style={styles.header}>Issue Details</Text>

            <View style={styles.visibleContainer}>
                <View style={styles.detailsContainer}>
                    <Text style={styles.detailTitle}>Title:</Text>
                    <Text style={styles.detailValue}>{issue.title}</Text>
                </View>

                <View style={styles.detailsContainer}>
                    <Text style={styles.detailTitle}>Status:</Text>
                    <Text style={[styles.detailValue, { color: getStatusColor(issue.status) }]}>{issue.status}</Text>
                </View>

                <View style={styles.detailsContainer}>
                    <Text style={styles.detailTitle}>Location:</Text>
                    <Text style={styles.detailValue}>{issue.location}</Text>
                </View>

                <View style={styles.detailsContainer}>
                    <Text style={styles.detailTitle}>Description:</Text>
                    <Text style={styles.detailValue}>{issue.description || "No description provided."}</Text>
                </View>
            </View>
        </View>
    );
};

const getStatusColor = (status) => {
    if (status === "Pending") return "orange";
    if (status === "Resolved") return "green";
    return "gray";
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        paddingTop: 10,
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        marginTop: 50,
        justifyContent: "center",
        textAlign: "center",
    },
    visibleContainer: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        marginBottom: 20,
    },
    detailsContainer: {
        marginBottom: 15,
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    detailValue: {
        fontSize: 16,
        color: "gray",
    },
    // backButton: {
    //     marginTop: 20,
    //     backgroundColor: "blue",
    //     padding: 15,
    //     borderRadius: 10,
    //     alignItems: "center",
    // },
    // backButtonText: {
    //     color: "white",
    //     fontSize: 16,
    //     fontWeight: "bold",
    // },
    topIcons: {
        position: "absolute",
        top: 50,
        left: 20,
        right: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        zIndex: 10,
    },
    icon: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 50,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
});

export default IssueDetailsScreen;
