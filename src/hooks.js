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
import React, { useEffect } from 'react'

/**
 * @param {React.RefObject<HTMLVideoElement>} videoRef
 */
export function useFacetracking(videoRef) {
  useEffect(() => {
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

    const asyncTracker = FaceTracker.createVideoTracker(fs).then((tracker) => {
      console.log('Started tracking')
      window.tracker = tracker
      return tracker
    })
  }, [])
}
