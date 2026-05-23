// Suppress known development errors that don't affect functionality
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalError = console.error
  console.error = (...args) => {
    // Suppress "Failed to fetch" errors from HMR/Turbopack
    if (args[0]?.message?.includes('Failed to fetch')) {
      return
    }
    // Suppress scroll-behavior warnings
    if (args[0]?.includes('scroll-behavior')) {
      return
    }
    originalError.apply(console, args)
  }
}

export {}
