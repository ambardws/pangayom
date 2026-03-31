const errorContainer = document.getElementById("errors")
const resultBox = document.getElementById("result")
const apiKeyInput = document.getElementById("apiKey")

let latestError = null
let apiKey = ""

// Ambil setup dari storage, beserta log jawaban AI terakhir
chrome.storage.local.get(["apiKey", "errors", "lastGeneratedErrorMsg", "lastExplanation"], (data) => {
  apiKey = data.apiKey || ""
  document.getElementById("apiKey").value = apiKey

  const errors = data.errors || []

  if (errors.length > 0) {
    latestError = errors[errors.length - 1]
    errorContainer.innerText = latestError.message || JSON.stringify(latestError)
    
    // CEK PENTING: Apakah hasil penjelasan AI terakhir adalah untuk error yang persis sama dengan sekarang?
    if (data.lastGeneratedErrorMsg === latestError.message && data.lastExplanation) {
      document.getElementById("result").innerHTML = parseMarkdownToHtml(data.lastExplanation)
    }
  } else {
    errorContainer.innerText = "No errors found"
    // Hapus juga riwayat lama di tampilan kalau memang layar sudah di clear
    document.getElementById("result").innerHTML = "Belum ada penjelasan."
  }
})

// Simpan pengaturan
document.getElementById("saveKey").addEventListener("click", () => {
  apiKey = document.getElementById("apiKey").value.trim()
  chrome.storage.local.set({ apiKey })
  alert("API Key tersimpan!")
})

document.getElementById("explain").addEventListener("click", async () => {
  if (!latestError) return
  if (!apiKey) {
    alert("Masukkan API Key dulu!")
    return
  }
  
  const codeSnippet = document.getElementById("codeSnippet").value.trim()

  resultBox.innerHTML = "<em>Proses mencari solusi AI...</em>"

  const explanation = await askAI(latestError.message, codeSnippet)
  
  // SIMPAN HASIL KE CACHE (Storage), sehingga tidak hilang meski Popup ditutup asalkan Error-nya sama
  chrome.storage.local.set({
    lastGeneratedErrorMsg: latestError.message,
    lastExplanation: explanation
  })

  // Konversi format Markdown ke HTML visual
  const formattedHtml = parseMarkdownToHtml(explanation)

  resultBox.innerHTML = formattedHtml
})

// Event Listener pintar untuk tombol Copy di dalam hasil Markdown API
document.getElementById("result").addEventListener("click", (e) => {
  if (e.target.classList.contains("copy-btn")) {
    const codeContent = e.target.nextElementSibling.textContent.trim()
    navigator.clipboard.writeText(codeContent)
    
    // Ganti teksnya sejenak
    e.target.innerText = "Copied!"
    setTimeout(() => {
      e.target.innerText = "Copy"
    }, 2000)
  }
})

function parseMarkdownToHtml(text) {
  let html = text || "No response"
  
  // Hindari injeksi HTML atau tag error yang hilang
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  
  // 1. Ekstrak blok kode terlebih dahulu untuk mengamankan line break mereka
  const codeBlocks = []
  html = html.replace(/```[a-z]*\n([\s\S]*?)```/gi, (match, code) => {
    codeBlocks.push(code)
    return `___CODE_BLOCK_${codeBlocks.length - 1}___`
  })
  
  // 2. Format baris baru untuk teks biasa (Rapatkan jika ada enter ganda yang bikin jarak kejauhan)
  html = html.replace(/\n\n+/g, "\n")
  html = html.replace(/\n/g, "<br/>")
  
  // 3. Kembalikan blok kode tadi dalam bentuk div yang sangat ketat (tanpa spasi liar)
  html = html.replace(/___CODE_BLOCK_(\d+)___/g, (match, idx) => {
    const code = codeBlocks[idx]
    return `<div class="code-container"><button class="copy-btn">Copy</button><code class="code-block">${code}</code></div>`
  })
  
  // 4. Format kode satuan (inline)
  html = html.replace(/`([^`]+)`/g, '<span class="inline-code">$1</span>')
  
  // 5. Format tebal
  html = html.replace(/\*\*(.*?)\*\*/g, '<span class="markdown-bold">$1</span>')
  
  return html
}

async function askAI(errorMessage, codeSnippet = "") {
  try {
    const contextText = codeSnippet ? `\n\nCODE KONTEKS DARI SAYA:\n${codeSnippet}` : ""
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://pangayom.ai",  // OpenRouter identifier opsional
        "X-Title": "Pangayom Extension"
      },
      body: JSON.stringify({
        model: "openrouter/auto", // Tetap menggunakan glm-4-flash sebagai model
        max_tokens: 1500, // Membatasi output agar sesuai kuota limit API gratis 
        messages: [
          {
            role: "user",
            content: `
Anda adalah Web Developer. 
Tugas Anda HANYA memperbaiki error ini:

ERROR MESSAGE:
${errorMessage}${contextText}

BERIKAN JAWABAN DENGAN FORMAT SUPER RINGKAS:
1. Penyebab: [1 kalimat singkat langsung pada intinya]
2. Kode Error: 
\`\`\`javascript
[Potongan kode salah yang memicu error]
\`\`\`
3. Kode Benar: 
\`\`\`javascript
[Cuplikan KODE SINGKAT yang diperbaiki SAJA]
\`\`\`

Dilarang menggunakan kalimat pembuka/penutup!
`
          }
        ]
      })
    })

    const data = await response.json()

    if (!response.ok) {
      // Jika API menolak request (misal: API key salah, model tidak ditemukan)
      return `API Error: ${data.error?.message || response.statusText }`
    }

    return data.choices?.[0]?.message?.content || "No response (Empty response from AI)"

  } catch (error) {
    // Jika ada masalah koneksi
    return `Network Error: ${error.message}`
  }
}