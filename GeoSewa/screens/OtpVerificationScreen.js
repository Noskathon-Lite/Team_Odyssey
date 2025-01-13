import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { BASE_URL } from "../config/requiredIP";

const OTPVerificationScreen = ({ navigation }) => {
  const [otp, setOtp] = useState("");
  const handleVerify = async () => {
    if (otp.length === 6) {
      try {
        const response = await fetch(`${BASE_URL}/api/verify-otp/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ otp }), // Sending OTP as part of the request body
        });
  
        const data = await response.json();
  
        if (response.ok) {
          Alert.alert("Success", data.message || "OTP verified successfully.");
          navigation.navigate("LoginScreen"); // Navigate to the Login screen after verification
        } else {
          Alert.alert("Error", data.error || "Failed to verify OTP.");
        }
      } catch (error) {
        console.error('Error verifying OTP:', error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } else {
      Alert.alert("Error", "Please enter a valid 6-digit OTP.");
    }
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.icon}>
        <Icon name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to your email.
      </Text>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          placeholderTextColor="gray"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
          maxLength={6}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
      <View style={styles.bottomText}>
        <Text style={styles.resendText}>Didn't receive the code?</Text>
        <TouchableOpacity style={styles.resendButton}>
          <Text style={styles.resendLink}>Resend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    justifyContent: "center",
  },
  icon: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  inputIcon: {
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 5,
    color: "black",
  },
  button: {
    backgroundColor: "blue",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  bottomText: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: "gray",
  },
  resendButton: {
    marginLeft: 5,
  },
  resendLink: {
    fontSize: 14,
    color: "blue",
    fontWeight: "600",
  },
});

export default OTPVerificationScreen;
