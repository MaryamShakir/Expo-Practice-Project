import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// First, verify Firebase configuration
const checkFirebaseConfig = () => {
  try {
    // Check if Firebase is already initialized
    if (getApps().length === 0) {
      // Your Firebase configuration object
      const firebaseConfig = {
        apiKey: "AIzaSyDoqhmxCvEo5kAuOvQ89-W6fP7pWms50Mc",
        projectId: "expo-practice-95f79",
        storageBucket: "expo-practice-95f79.firebasestorage.app",
        appId: "1:457713483716:android:61b645872c4160c3dcae91",
      };

      // Initialize Firebase
      const app = initializeApp(firebaseConfig);

      // Initialize Auth with AsyncStorage persistence
      initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
      });

      return true;
    }
    return true;
  } catch (error) {
    console.error("Firebase configuration error:", error);
    return false;
  }
};

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    // Reset error state
    setError("");
    setIsLoading(true);

    try {
      // Verify Firebase configuration before proceeding
      const isConfigured = checkFirebaseConfig();

      if (!isConfigured) {
        throw new Error("Firebase is not properly configured");
      }

      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // User is signed up
      const user = userCredential.user;
      console.log("User created successfully:", user.uid);

      // Here you can add additional logic like:
      // - Navigate to another screen
      // - Create a user profile in Firestore
      // - Show success message
    } catch (error) {
      let errorMessage = "An error occurred during signup";

      // Handle specific Firebase Auth errors
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Email/password accounts are not enabled";
          break;
        case "auth/weak-password":
          errorMessage = "Please enter a stronger password";
          break;
        default:
          errorMessage = error.message;
      }

      setError(errorMessage);
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignup}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    marginBottom: 15,
  },
});

export default SignupScreen;
