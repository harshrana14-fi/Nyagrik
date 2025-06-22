'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'

export default function IntroLoader() {
  const [show, setShow] = useState(true)
  const [fade, setFade] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFade(true), 1800) // start fading out
    const timer = setTimeout(() => setShow(false), 2500) // remove after fade

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(timer)
    }
  }, [])

  if (!show) return null

  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 bg-white flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out',
        fade && 'opacity-0'
      )}
    >
      {/* Logo */}
      <Image
        src="/nyaylogo.jpg"
        alt="Nyay Logo"
        width={100}
        height={100}
        className="mb-6"
        priority
      />

      {/* Title */}
      <h1 className="text-5xl font-bold text-blue-800 mb-2"> न्याय Portal</h1>

      {/* Subtitle */}
      <p className="text-lg text-gray-600 mb-6">Digital Bharat Ke Liye Digital Nyay</p>

      {/* Spinner */}
      <div className="flex space-x-2">
        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:.2s]"></span>
        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:.4s]"></span>
      </div>
    </div>
  )
}
