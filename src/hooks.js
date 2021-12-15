import {
  ApplicationContext,
  FacemojiAPI,
  FaceTracker,
  FPS,
  Logger,
  LogLevel,
  Quaternion,
  ResourceFileSystem,
  Vec2,
} from '@facemoji/mocap4face'
import { useFrame } from '@react-three/fiber'
import React, { useEffect, useMemo, useState } from 'react'
import { suspend } from 'suspend-react'

/**
 * @param {React.RefObject<HTMLVideoElement>} videoRef
 */
export function useFacetracking(videoRef, fn = () => {}) {
  const asyncTracker = useMemo(() => {
    const context = new ApplicationContext('https://cdn.jsdelivr.net/npm/@facemoji/mocap4face@0.2.0') // Set a different URL here if you host application resources elsewhere
    const fs = new ResourceFileSystem(context)

    // Initialize the API and activate API key
    // Note that without an API key the SDK works only for a short period of time
    FacemojiAPI.initialize(import.meta.env.VITE_FACEMOJI_KEY, context).then((activated) => {
      if (activated) {
        console.info('API successfully activated')
      } else {
        console.info('API could not be activated')
      }
    })

    const asyncTracker = FaceTracker.createVideoTracker(fs)
      .then((tracker) => {
        console.log('Started tracking')
        window.tracker = tracker
        return tracker
      })
      .logError('Could not start tracking')

    return asyncTracker
  }, [])

  useFrame(() => {
    try {
      const tracker = asyncTracker.currentValue
      const lastResult = tracker.track(videoRef.current)
      fn(Object.fromEntries(lastResult.blendshapes))
    } catch (e) {}
  })
}
