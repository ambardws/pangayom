console.log("=== PANGAYOM INJECT ===")

window.onerror = function (message, source, lineno, colno, error) {
  console.log("Error captured in MAIN world:", message)
  
  window.postMessage({
    type: "PANGAYOM_ERROR",
    payload: {
      message,
      source,
      lineno,
      colno,
      stack: error?.stack
    }
  }, "*")
}

const originalError = console.error
console.error = function (...args) {
  console.log("Console.error captured in MAIN world:", args)
  
  window.postMessage({
    type: "PANGAYOM_ERROR",
    payload: {
      message: args.join(" ")
    }
  }, "*")
  
  originalError.apply(console, args)
}
