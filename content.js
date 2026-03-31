console.log("=== PANGAYOM TEST ===")
console.log("Content script is running!")

// Kosongkan riwayat error dan memori jawaban AI setiap kali halaman dimuat ulang (refresh)
chrome.storage.local.set({ errors: [], lastGeneratedErrorMsg: null, lastExplanation: null })

const pangayomErrors = []

window.addEventListener("message", (event) => {
  // Hanya proses message dari PANGAYOM_ERROR
  if (event.source !== window || !event.data || event.data.type !== "PANGAYOM_ERROR") {
    return
  }
  
  const errorPayload = event.data.payload
  console.log("Storing error from content script:", errorPayload.message)
  
  // Ambil existing errors dari storage dulu jika perlu, 
  // atau tambahkan saja ke array lokal dan save
  chrome.storage.local.get(["errors"], (data) => {
    let errors = data.errors || []
    errors.push(errorPayload)
    chrome.storage.local.set({ errors: errors })
  })
})
