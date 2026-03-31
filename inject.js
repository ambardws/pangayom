console.log("--- PANGAYOM INJECT ---")

// 1. Tangkap Uncaught Exceptions (Error Javascript biasa)
window.onerror = function (message, source, lineno, colno, error) {
  console.log("Error tertangkap Pangayom:", message)
  
  window.postMessage({
    type: "PANGAYOM_ERROR",
    payload: {
      message: error?.stack || `${message} di baris ${lineno} (${source})`
    }
  }, "*")
}

// 2. Tangkap Promise Rejections (Error di Async/Await atau Axios/Fetch - ini yang terjadi di Nuxt Anda!)
window.addEventListener('unhandledrejection', function(event) {
  console.log("Promise Error tertangkap Pangayom:", event.reason)

  window.postMessage({
    type: "PANGAYOM_ERROR",
    payload: {
      message: event.reason?.stack || event.reason?.message || String(event.reason)
    }
  }, "*")
})

// 3. Tangkap manual Console.error() (Peringatan merah bikinan Vue/Developer)
const originalError = console.error
console.error = function (...args) {
  const errorStrings = args.map(arg => {
    if (arg instanceof Error) return arg.stack || arg.message
    if (typeof arg === 'object') {
      try { return JSON.stringify(arg) } catch(e) { return String(arg) }
    }
    return String(arg)
  })

  window.postMessage({
    type: "PANGAYOM_ERROR",
    payload: {
      message: errorStrings.join(" | ")
    }
  }, "*")
  
  originalError.apply(console, args)
}
