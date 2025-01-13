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

const RegisterScreen = ({ navigation }) => {
    const [firstname, setfirstname] = useState("");
    const [lastname, setlastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleRegister = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!firstname || !lastname || !email || !password) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        if (!emailRegex.test(email)) {
            Alert.alert("Error", "Please enter a valid email address.");
            return;
        }
    
        try {
            const response = await fetch(`${BASE_URL}/api/register/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: password,
                }),
            });
            
            if (response.ok) {
                const data = await response.json();
                Alert.alert("Success", data.message);
                navigation.navigate("OTPVerificationScreen");
            } else {
                const errorData = await response.json();
                console.log(errorData);
                Alert.alert("Error", errorData || "Registration failed.");
            }
        } catch (error) {
            console.error("Error registering user:", error);
            Alert.alert("Error", "Unable to connect to the server.");
        }
    };
    

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.icon}>
                <Icon name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Register</Text>
            <View style={styles.rowContainer}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Icon name="person" size={20} color="gray" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="First Name"
                        placeholderTextColor="gray"
                        value={firstname}
                        onChangeText={setfirstname}
                    />
                </View>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Icon name="person" size={20} color="gray" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Last Name"
                        placeholderTextColor="gray"
                        value={lastname}
                        onChangeText={setlastname}
                    />
                </View>
            </View>
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

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <View style={styles.bottomText}>
                <Text style={styles.alreadyAccountText}>Already have an account?</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate("LoginScreen")}
                    style={styles.loginButton}
                >
                    <Text style={styles.loginText}>Login</Text>
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
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    halfWidth: {
        width: "48%",
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
    alreadyAccountText: {
        fontSize: 14,
        color: "gray",
    },
    loginButton: {
        marginLeft: 5,
    },
    loginText: {
        fontSize: 14,
        color: "blue",
        fontWeight: "600",
    },
});

export default RegisterScreen;
