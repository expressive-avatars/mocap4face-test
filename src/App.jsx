import { Suspense, useRef } from 'react'
import { Environment, OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useFacetracking } from './hooks'
import * as THREE from 'three'
import { Webcam } from './Webcam'
import { facemoji2arkit } from './blendShapes'

export default function App() {
  const videoRef = useRef()
  return (
    <>
      <Canvas camera={{ fov: 35, position: [0, 0, 3] }}>
        <color attach="background" args={['black']} />
        <OrbitControls />
        <Suspense fallback={null}>
          <Environment preset="warehouse" background />
          <Model videoRef={videoRef} />
          <Environment preset="warehouse" background />
        </Suspense>
      </Canvas>
      <Webcam ref={videoRef} play style={{ position: 'fixed', zIndex: 1, top: 1 }} width={300} />
    </>
  )
}

function Facetracker({ videoRef }) {
  useFacetracking(videoRef)
  return null
}

// const avatarURL = 'https://d1a370nemizbjq.cloudfront.net/54a8ca1e-1759-4cf9-ab76-bec155d6c83c.glb'

const avatarURL = 'https://d1a370nemizbjq.cloudfront.net/b2572c50-a10a-42b6-ab30-694f60fed40f.glb'

function Model({ videoRef }) {
  const { scene, nodes } = useGLTF(avatarURL)
  /** @type {THREE.Mesh} */
  const face = nodes.Wolf3D_Head

  /** @type {THREE.Mesh} */
  const teeth = nodes.Wolf3D_Teeth

  /** @type {THREE.Bone} */
  const headBone = nodes.Head

  /** @type {THREE.Bone} */
  const eyeLeft = nodes.LeftEye

  /** @type {THREE.Bone} */
  const eyeRight = nodes.RightEye

  window.face = face

  useFacetracking(videoRef, (blendShapes, quaternion) => {
    window.blendShapes = blendShapes
    for (let key in blendShapes) {
      const i = face.morphTargetDictionary[facemoji2arkit[key]]
      face.morphTargetInfluences[i] = blendShapes[key]
      teeth.morphTargetInfluences[i] = blendShapes[key]
    }

    eyeRight.rotation.set(
      -Math.PI / 2 + blendShapes['eyeLookDown_R'] * 0.5 - blendShapes['eyeLookUp_R'] * 0.5,
      0,
      Math.PI - blendShapes['eyeLookOut_R'] + blendShapes['eyeLookOut_L']
    )
    eyeLeft.rotation.copy(eyeRight.rotation)

    headBone.quaternion.fromArray(quaternion)
  })

  return <primitive object={scene} position={[0, -2.4, 0]} scale={4} />
}
