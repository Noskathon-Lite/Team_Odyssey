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
import axios from 'axios'; // Ensure axios is installed for API calls
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config/requiredIP";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);


 const handleLogin = async () => {
    // if (email && password) {
    //   try {


    //     // Send POST request to the login API with the email and password
    //     const response = await axios.post(`${BASE_URL}/api/login/`, {
    //       email,
    //       password

    //     }, {
    //       headers: {
    //         "Content-Type": "application/json",
    //       }
    //     });
  
    //     // If login is successful, you will get a response containing JWT tokens
    //     const { refresh, access } = response.data;
    //     console.log('Refresh token:', refresh);
    //     console.log('Access token:', access);
  
    //     // Store the tokens (e.g., using AsyncStorage)
    //     await AsyncStorage.setItem('refresh_token', refresh);
    //     await AsyncStorage.setItem('access_token', access);
  
        // Navigate to the HomeScreen after successful login
        navigation.navigate("HomeScreen");
    //   } catch (error) {
    //     // Handle errors (e.g., invalid credentials)
    //     if (error.response) {
    //       Alert.alert("Error", error.response.data.error);
    //     } else {
    //       Alert.alert("Error", "An error occurred. Please try again.");
    //     }
    //   }
    // } else {
    //   Alert.alert("Error", "Please fill in all fields.");
    // }
  };
  
  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.icon}>
        <Icon name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputContainer}>
        <Icon name="email" size={20} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="gray"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="gray"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          style={styles.visibilityIcon}
        >
          <Icon
            name={isPasswordVisible ? "visibility" : "visibility-off"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => Alert.alert("Forgot Password", "Feature coming soon!")}
        style={styles.forgotPassword}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.bottomText}>
        <Text style={styles.noAccountText}>Don't have an account?</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("RegisterScreen")}
          style={styles.signupButton}
        >
          <Text style={styles.signupText}>Sign Up</Text>
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
  visibilityIcon: {
    paddingHorizontal: 10,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 10,
  },
  forgotPasswordText: {
    color: "blue",
    fontSize: 14,
    fontWeight: "500",
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
  noAccountText: {
    fontSize: 14,
    color: "gray",
  },
  signupButton: {
    marginLeft: 5,
  },
  signupText: {
    fontSize: 14,
    color: "blue",
    fontWeight: "600",
  },
});

export default LoginScreen;
