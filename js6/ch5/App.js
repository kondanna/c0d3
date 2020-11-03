import React, { useState, useEffect } from 'react'
import { Text, View, Button, Image } from 'react-native'
import { Camera } from 'expo-camera'

export default function App() {
  const [hasPermission, setHasPermission] = useState(null)
  const [images, setImages] = useState([])

  const takePicture = async () => {
    const photo = await this.camera.takePictureAsync({ base64: true, quality: 0 })
    fetch('http://9f50665e74b2.ngrok.io/api/images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        img: photo.base64
      })
    }).then(r => r.json()).then(data =>
      setImages([...images, data.imgUrl])
    )
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted')
    })()

    fetch('http://9f50665e74b2.ngrok.io/api/images').then(r => r.json()).then(filesArr => {
      setImages(filesArr)
    })
  }, [])

  useEffect(() => {
    console.log('re render')
    console.log(images)
  }, [images])

  if (hasPermission === null) {
    return <View />
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.5 }}>
        {images.map((filename, idx)=> {
          return (
            <Image 
              key={idx}
              source={{ uri: `http://9f50665e74b2.ngrok.io/images/${filename}` }}
              style={{ flex: 0.25, width: '25%', height: '100%' }}
            />
          )
        })}
      </View>
      <Camera
        style={{ flex: 0.5 }}
        type={Camera.Constants.Type.front}
        ref={ref => {
          this.camera = ref
        }}>
      </Camera>
      <Button
        style={{ flex: 0.1 }}
        title="Take Picture"
        color="ffffff"
        onPress={takePicture}
      />
      <Text>
        Permission of camera is: {hasPermission ? 'Granted' : 'Rejected'}
      </Text>
    </View>
  );
}