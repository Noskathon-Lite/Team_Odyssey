import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Button,
  Modal,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/MaterialIcons";
import { BASE_URL } from "../config/requiredIP";

const MapScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false); // For action sheet/modal
  const mapRef = useRef(null);

  // Request location permissions
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          setHasPermission(true);
        } else {
          Alert.alert("Permission Denied", "Location access is required.");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to request location permissions.");
      }
    };

    requestLocationPermission();
  }, []);

  // Fetch the current location
  useEffect(() => {
    if (hasPermission) {
      (async () => {
        try {
          const { coords } = await Location.getCurrentPositionAsync({});
          setLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        } catch (error) {
          Alert.alert("Error", "Unable to fetch current location.");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [hasPermission]);

  const handleMapPress = (e) => {
    setSelectedLocation(e.nativeEvent.coordinate);
  };

  const logCoordinates = async () => {
    if (selectedLocation) {
      try {
        // Perform reverse geocoding for the selected location
        const [address] = await Location.reverseGeocodeAsync(selectedLocation);
        const generalAddress = `${address.name || "Unnamed Area"}, ${address.city || ""}, ${address.region || ""}, ${address.street || ""}, ${address.subregion || ""}, ${address.district || ""}`;
        
        // Creating a structured address JSON object
        const addressData = {
          city: address.city || "",
          province: address.region || "",
          street: address.street || "",
          district: address.subregion || "",
          name: address.district || "",
        };
  
        // Prepare data for the backend
        const locationData = {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          address: addressData,
        };
  
        Alert.alert(
          "Confirm Location",
          `Location confirmed: ${generalAddress}`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "OK",
              onPress: async () => {
                console.log("Data being sent to backend:", JSON.stringify(locationData, null, 2));
                try {
                  // Replace 'YOUR_BACKEND_URL' with your actual backend endpoint
                  const response = await fetch(`${BASE_URL}/api/generate-map/`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(locationData),
                  });
  
                  if (response.ok) {
                    const responseData = await response.json();
                    console.log('Backend Response:', responseData);
                    Alert.alert('Success', 'Location sent successfully!');
                    navigation.navigate("CameraScreen")
                  } else {
                    console.error('Failed to send location:', response.status);
                    Alert.alert('Error', 'Failed to send location to the server.');
                  }
                } catch (error) {
                  console.error('Error:', error);
                  Alert.alert('Error', 'An error occurred while sending location.');
                }
              },
            },
          ]
        );
      } catch (error) {
        console.log("Error in reverse geocoding:", error);
        Alert.alert("Error", "Unable to fetch address for the selected location.");
      }
    } else {
      Alert.alert("No Location Selected", "Please select a location on the map.");
    }
  };
  
  
  
  

  const goToCurrentLocation = () => {
    if (location && mapRef.current) {
      setSelectedLocation(location); // Set the marker at the current location
      mapRef.current.animateToRegion({
        ...location,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const handleModalOption = (option) => {
    setIsModalVisible(false);
    if (option === "current") {
      goToCurrentLocation();

    } else if (option === "select") {
      Alert.alert("Instruction", "Tap on the map to select a location.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topIcons}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.icon}>
          <Icon name="arrow-back" size={30} color="black" />
        </TouchableOpacity>

        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search location"
          placeholderTextColor="gray"
        />

        <TouchableOpacity onPress={() => setSelectedLocation(null)} style={styles.icon}>
          <Icon name="refresh" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={location}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton={false}
        toolbarEnabled={false}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            draggable
            onDragEnd={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
          />
        )}
      </MapView>

      <View style={styles.buttonContainer}>
        <Button
          title={selectedLocation ? "Confirm Location" : "Select Location"}
          color="blue"
          onPress={selectedLocation ? logCoordinates : () => setIsModalVisible(true)}
        />
      </View>

      {/* Action Sheet/Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Location</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleModalOption("current")}
            >
              <Icon name="my-location" size={24} color="white" style={styles.modalIcon} />
              <Text style={styles.modalButtonText}>Use Current Location</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleModalOption("select")}
            >
              <Icon
                name="place"
                size={24}
                color="white"
                style={styles.modalIcon}
              />
              <Text style={styles.modalButtonText}>Select Location on Map</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
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
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "white",
    borderRadius: 20,
    paddingLeft: 15,
    height: 50,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: "10%",
    right: "10%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  locationButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "blue",
    borderRadius: 50,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  modalCancelButton: {
    marginTop: 10,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 16,
    color: "red",
  },
});

export default MapScreen;
