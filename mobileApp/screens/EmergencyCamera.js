import { CameraView, useCameraPermissions , CameraType, FlashMode} from 'expo-camera';
import { useState,  useRef, useEffect} from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as MediaLibrary from 'expo-media-library';


export default function EmergencyCamera({}) {
  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const cameraRef = useRef(null);

  
  useEffect(() => {
    (async () => {
      if (!permission) {
        await requestPermission();
      }
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, [permission]);


  if (!permission || !permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedPhoto(photo.uri);
    }
};


function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  function toggleFlash() {
    setFlash(current => (current === 'off' ? 'on' : 'off'));
  }


const saveImage = async () => {
    if (capturedPhoto) {
      try {
        const asset = await MediaLibrary.createAssetAsync(capturedPhoto);
        if (asset) {
          alert('Photo saved successfully! 🎉');
          setCapturedPhoto(null); 
        }
      } catch (error) {
        console.log('Error saving photo:', error);
      }
    }
  };


  return (
    <View style={styles.container}>
    {!capturedPhoto ? (
      <CameraView 
      ref={cameraRef}
      style={styles.camera} 
      facing={facing} 
      flash={flash}
      />

    ) : (

        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedPhoto }} style={styles.previewImage} key={capturedPhoto} />
          <View style={styles.overlay}>
            <TouchableOpacity style={styles.buttonAction} onPress={() => setCapturedPhoto(null)}>
              <Icon name="refresh" size={24} color="#fff" />
              <Text style={styles.buttonText}>Re-take</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonAction} onPress={saveImage}>
              <Icon name="save" size={24} color="#fff" />
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

            {!capturedPhoto && (
                <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                <Icon name="camera-reverse" size={40} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <Icon name="camera" size={50} color="white" />
                </TouchableOpacity>
                </View>
            )}

        <View style={styles.flashContainer}>
        <TouchableOpacity onPress={toggleFlash}>
            <Icon name={flash === 'off'? 'flash-off' : 'flash'} size={30} color="white" />
          </TouchableOpacity>
        </View>
        </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'flex-end',
        position: 'relative',
        alignItems: 'center',
    },
    camera: {
      flex: 1,
      width: '100%',
      justifyContent: 'flex-end',
    },
    flashContainer: {
      position: 'absolute',
      top: 30,
      right: 20,
    },
    flashContainer: {
        position: 'absolute',
        top: 30,
        right: 20,
      },
    buttonContainer: {
        position: 'absolute',
        bottom: 50, 
        left: 0,
        right: 0,
        backgroundColor: 'black',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
        paddingRight:100,
        height: 150 ,
        paddingHorizontal: 20,
        marginHorizontal: 0,
        marginVertical: -50,
        marginTop: 0,
    },
    buttonActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    flipButton: {
        width: 60, 
        height: 60,
        backgroundColor: 'rgba(255,255,255,0.3)', 
        padding: 5,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        marginRight: 40,
    },
    captureButton: {
        width: 90, 
        height: 90,
        backgroundColor: '#800000', 
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        padding: 15,
    },
    text: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '700', 
        textAlign: 'center',
      },
    captureText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
      },
    previewContainer: {
        position: 'absolute', 
        top: '10%',
        left: '50%',
        transform: [{ translateX: -150 }],
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    previewContainer: {
        flex: 1,
        width: '100%',
        height: '80',
        position: 'relative',
      },
    overlay: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        marginVertical: -50,
        height: 100 ,
        paddingVertical: 10,
      },
    previewImage: {
        flex: 1,
        width: '100%',
        resizeMode: 'cover',
    },
    buttonAction: {
        alignItems: 'center',

      },
    buttonText: {
        color: 'white',
        marginTop: 5,
    },
  });