import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
// import MapView, { Marker } from "react-native-maps";
import Icon from "react-native-vector-icons/MaterialIcons";
import BottomNav from "../components/BottomNav";


const HomeScreen = ({ navigation }) => {
    const recentReports = [
        { id: "1", title: "Pothole on Ring Road", status: "Pending", location: "Balkumari" },
        { id: "2", title: "Broken Streetlight", status: "Resolved", location: "Lokanthali" },
        { id: "3", title: "Broken Pole", status: "Resolved", location: "Lokanthali" },
        { id: "4", title: "Broken Streetlight", status: "Resolved", location: "Lokanthali" },
        { id: "5", title: "Broken Streetlight", status: "Resolved", location: "Lokanthali" },
        // Add more dummy data as needed
    ];

    const getStatusColor = (status) => {
        if (status === "Pending") return "orange";
        if (status === "Resolved") return "green";
        return "gray";
    };

    return (
        <View style={styles.container}>
            <View style={styles.topIcons}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.icon}>
                    <Icon name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
            </View>
            <Text style={styles.sectionTitle}>Recent Reports</Text>
            <FlatList
                data={recentReports}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.reportCard}>
                        <Text style={styles.reportTitle}>{item.title}</Text>
                        <Text style={[styles.reportStatus, { color: getStatusColor(item.status) }]}>
                            Status: {item.status}
                        </Text>
                        <Text style={styles.reportLocation}>Location: {item.location}</Text>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate("IssueDetailsScreen", { issue: item })}
                        >
                            <Text style={styles.actionText}>View Issue</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            {/* <View style={styles.quickActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("MapScreen")}>
                    <Text style={styles.actionText}>Report an Issue</Text>
                </TouchableOpacity>
            </View> */}
            <BottomNav navigation={navigation} />
        </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        padding: 10,
    },
    // quickActions: {
    //     flexDirection: "row",
    //     justifyContent: "space-between",
    //     marginBottom: 15,
    // },
    actionButton: {
        flex: 1,
        backgroundColor: "blue",
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 5,
        alignItems: "center",
    },
    actionText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        marginTop: 50,
        justifyContent: "center",
        textAlign: "center",
    },
    reportCard: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        elevation: 3,
        marginBottom: 10,
    },
    reportTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    reportStatus: {
        marginTop: 5,
        fontWeight: "600",
    },
    reportLocation: {
        color: "gray",
        marginTop: 5,
        marginBottom: 10,
    },
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

export default HomeScreen;
