import { Suspense, useRef } from 'react'
import { OrbitControls, TorusKnot } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useFacetracking } from './hooks'
import { Webcam } from './Webcam'

export default function App() {
  const videoRef = useRef()
  return (
    <>
      <Canvas>
        <color attach="background" args={['black']} />
        <OrbitControls />
        <Thing />
        <Suspense fallback={null}>
          <Facetracker videoRef={videoRef} />
        </Suspense>
      </Canvas>
      <Webcam ref={videoRef} play style={{ position: 'fixed', zIndex: 1, top: 1, transform: 'scale(-1, 1)' }} width={300} />
    </>
  )
}

function Thing() {
  const ref = useRef()
  useFrame(() => (ref.current.rotation.y += 0.01))
  return (
    <TorusKnot ref={ref} args={[1, 0.3, 128, 16]}>
      <meshNormalMaterial />
    </TorusKnot>
  )
}

function Facetracker({ videoRef }) {
  useFacetracking(videoRef)
  return null
}
