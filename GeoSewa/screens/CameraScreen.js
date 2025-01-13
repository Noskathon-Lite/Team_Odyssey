import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';

const CameraScreen= ({ navigation }) =>{
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [flashMode, setFlashMode] = useState('off'); // Flash mode state
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  function toggleFlashMode() {
    setFlashMode((current) => {
      if (current === 'off') return 'on';
      if (current === 'on') return 'auto';
      return 'off';
    });
  }

const handleTakePhoto = async () => {
  if (cameraRef.current) {
    const options = {
      quality: 1,
      base64: true,
      exif: false,
      flash: flashMode, // Use the selected flash mode
    };
    const takenPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(takenPhoto);
    console.log('Photo URI:', takenPhoto.uri); // Log the URI of the taken photo
  }
};

const handleRetakePhoto = () => setPhoto(null);


const handleImagePicker = async () => {
  // Request media library permissions
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    alert("Permission to access media library is required!");
    return;
  }

  // Launch image picker
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaType: "photo",
    allowsEditing: true,
    aspect: [4, 3],
  });

  // If the user selects an image, set it to state
  if (!result.canceled && result.assets && result.assets.length > 0) {
    const selectedImage = result.assets[0];
    setPhoto({ uri: selectedImage.uri }); // Ensure the state is an object with a `uri` key
    console.log('Selected Image URI:', selectedImage.uri); // Log the URI for debugging
  }
};

const handlePhotoSelect = () => {}


  if (photo) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: photo.uri }} style={styles.previewImage} />
        <View style={styles.previewButtons}>
          <TouchableOpacity style={[styles.button, styles.retakeButton]} onPress={handleRetakePhoto}>
            <Icon name="camera" size={24} color="white" />
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handlePhotoSelect}>
            <Icon name="save" size={24} color="white" />
            <Text style={styles.buttonText}>Select</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} flash={flashMode} />
      {/* Top Buttons */}
      <View style={styles.topButtons}>
        <TouchableOpacity style={styles.flashButton} onPress={toggleFlashMode}>
          <Icon
            name={flashMode === 'off' ? 'flash-off' : flashMode === 'on' ? 'flash-on' : 'flash-auto'}
            size={30}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
          <Icon name="close" size={30} color="white" />
        </TouchableOpacity>
      </View>
      {/* Bottom Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={[styles.controlButton, styles.imageButton]} onPress={handleImagePicker}>
          <Icon name="image" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlButton, styles.captureButton]} onPress={handleTakePhoto}>
          <Icon name="camera" size={40} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlButton, styles.toggleButton]} onPress={toggleCameraFacing}>
          <Icon name="cameraswitch" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 40,
    width: '100%',
    paddingHorizontal: 20,
  },
  flashButton: {
    padding: 10,
    backgroundColor: 'rgba(50, 50, 50, 0.7)',
    borderRadius: 25,
  },
  exitButton: {
    padding: 10,
    backgroundColor: 'rgba(50, 50, 50, 0.7)',
    borderRadius: 25,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    padding: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  controlButton: {
    padding: 15,
    borderRadius: 50,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageButton: {
    backgroundColor: '#6c757d', // Muted gray
  },
  toggleButton: {
    backgroundColor: '#495057', // Slightly darker gray
  },
  captureButton: {
    backgroundColor: '#343a40', // Dark gray
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  previewImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText:{
    color:'white',
  },
  retakeButton: {
    backgroundColor: '#6c757d', // Muted gray
  },
  saveButton: {
    backgroundColor: '#495057', // Slightly darker gray
  },
});

export default CameraScreen;