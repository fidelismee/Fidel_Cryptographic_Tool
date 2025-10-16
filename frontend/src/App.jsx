import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [algorithm, setAlgorithm] = useState('caesar')
  const [encodingType, setEncodingType] = useState('base64')
  const [key, setKey] = useState('3')
  const [algorithms, setAlgorithms] = useState([])
  const [encodingTypes, setEncodingTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('encryption') // 'encryption' or 'encoding'

  useEffect(() => {
    fetchAlgorithms()
    fetchEncodingTypes()
  }, [])

  const fetchEncodingTypes = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/encoding_types')
      const data = await response.json()
      setEncodingTypes(data.encoding_types)
    } catch (error) {
      console.error('Failed to fetch encoding types:', error)
    }
  }

  const fetchAlgorithms = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/algorithms')
      const data = await response.json()
      setAlgorithms(data.algorithms)
    } catch (error) {
      console.error('Failed to fetch algorithms:', error)
      setError('Failed to connect to backend server')
    }
  }

  const handleEncrypt = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to encrypt')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('http://localhost:5001/api/encrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          algorithm: algorithm,
          key: key
        })
      })

      const data = await response.json()

      if (response.ok) {
        setOutputText(data.encrypted_text)
        setSuccess('Text encrypted successfully!')
      } else {
        setError(data.error || 'Encryption failed')
      }
    } catch (error) {
      setError('Failed to connect to encryption service')
    } finally {
      setLoading(false)
    }
  }

  const handleDecrypt = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to decrypt')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('http://localhost:5001/api/decrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          algorithm: algorithm,
          key: key
        })
      })

      const data = await response.json()

      if (response.ok) {
        setOutputText(data.decrypted_text)
        setSuccess('Text decrypted successfully!')
      } else {
        setError(data.error || 'Decryption failed')
      }
    } catch (error) {
      setError('Failed to connect to decryption service')
    } finally {
      setLoading(false)
    }
  }

  const handleEncode = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to encode')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('http://localhost:5001/api/encode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          encoding_type: encodingType
        })
      })

      const data = await response.json()

      if (response.ok) {
        setOutputText(data.encoded_text)
        setSuccess('Text encoded successfully!')
      } else {
        setError(data.error || 'Encoding failed')
      }
    } catch (error) {
      setError('Failed to connect to encoding service')
    } finally {
      setLoading(false)
    }
  }

  const handleDecode = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to decode')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('http://localhost:5001/api/decode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          encoding_type: encodingType
        })
      })

      const data = await response.json()

      if (response.ok) {
        setOutputText(data.decoded_text)
        setSuccess('Text decoded successfully!')
      } else {
        setError(data.error || 'Decoding failed')
      }
    } catch (error) {
      setError('Failed to connect to decoding service')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    setSuccess('Copied to clipboard!')
  }

  const handleClear = () => {
    setInputText('')
    setOutputText('')
    setError('')
    setSuccess('')
  }

  const currentAlgorithm = algorithms.find(algo => algo.value === algorithm)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent gradient-text-fix">
            Fidel Cryptographic Tool
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mt-2">
            Secure text encryption, decryption, and encoding with multiple cryptographic algorithms
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <button
            onClick={() => setActiveTab('encryption')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-200 ${
              activeTab === 'encryption'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-inner'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Encryption/Decryption
            </div>
          </button>
          <button
            onClick={() => setActiveTab('encoding')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-200 ${
              activeTab === 'encoding'
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-inner'
                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              Encoding/Decoding
            </div>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          {activeTab === 'encryption' ? (
            <>
              {/* Algorithm Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Encryption Algorithm
                  </label>
                  <select
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {algorithms.map((algo) => (
                      <option key={algo.value} value={algo.value}>
                        {algo.name}
                      </option>
                    ))}
                  </select>
                </div>

                {currentAlgorithm?.requires_key && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Encryption Key {currentAlgorithm?.key_description && `(${currentAlgorithm.key_description})`}
                    </label>
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      placeholder="Enter encryption key"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Encoding Type Selection */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Encoding Type
                </label>
                <select
                  value={encodingType}
                  onChange={(e) => setEncodingType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {encodingTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.name} - {type.description}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Input Text Area */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Input Text
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to encrypt or decrypt..."
              rows={6}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 shadow-sm hover:shadow-md font-mono text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            {activeTab === 'encryption' ? (
              <>
                <button
                  onClick={handleEncrypt}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-3 font-semibold"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Encrypting...
                    </>
                  ) : (
                    'Encrypt'
                  )}
                </button>
                <button
                  onClick={handleDecrypt}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-3 font-semibold"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Decrypting...
                    </>
                  ) : (
                    'Decrypt'
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEncode}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-3 font-semibold"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Encoding...
                    </>
                  ) : (
                    'Encode'
                  )}
                </button>
                <button
                  onClick={handleDecode}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-xl hover:from-pink-700 hover:to-pink-800 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-3 font-semibold"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Decoding...
                    </>
                  ) : (
                    'Decode'
                  )}
                </button>
              </>
            )}
            <button
              onClick={handleClear}
              className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-3 font-semibold"
            >
              Clear All
            </button>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{success}</span>
              </div>
            </div>
          )}

          {/* Output Result */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-semibold text-gray-800">
                Result
              </label>
              {outputText && (
                <button
                  onClick={handleCopy}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy to Clipboard
                </button>
              )}
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 min-h-[150px]">
              {outputText ? (
                <pre className="text-gray-800 break-words font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  {outputText}
                </pre>
              ) : (
                <p className="text-gray-400 italic text-center py-8">
                  Your encrypted or decrypted text will appear here...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Algorithm Information */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">About the Algorithms</h2>
          
          {/* Encryption Algorithms */}
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Encryption Algorithms</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-blue-800 mb-3">Caesar Cipher</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                A simple substitution cipher where each letter is shifted by a fixed number of positions in the alphabet.
              </p>
              <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                <strong>Key:</strong> Shift amount (integer)
              </div>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-bold text-green-800 mb-3">AES Encryption</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Advanced Encryption Standard - a secure symmetric encryption algorithm used worldwide for sensitive data protection. Uses 128-bit encryption.
              </p>
              <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                <strong>Key:</strong> Automatically generated (secure)
              </div>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </div>
              <h3 className="font-bold text-purple-800 mb-3">Substitution Cipher</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Each letter is replaced with another letter according to a fixed substitution pattern or mapping for both uppercase and lowercase letters.
              </p>
              <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                <strong>Key:</strong> 52-character substitution key (a-zA-Z)
              </div>
            </div>
          </div>

          {/* Encoding Algorithms */}
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Encoding/Decoding Algorithms</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mb-3">
                <span className="text-white text-xs font-bold">B64</span>
              </div>
              <h3 className="font-bold text-orange-800 mb-2 text-sm">Base64</h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                Encodes binary data into ASCII characters using 64 different characters. Commonly used for email attachments and data URLs.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mb-3">
                <span className="text-white text-xs font-bold">HEX</span>
              </div>
              <h3 className="font-bold text-red-800 mb-2 text-sm">Hexadecimal</h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                Represents binary data using 16 distinct symbols (0-9, A-F). Each byte is represented as two hexadecimal digits.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mb-3">
                <span className="text-white text-xs font-bold">URL</span>
              </div>
              <h3 className="font-bold text-indigo-800 mb-2 text-sm">URL Encoding</h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                Percent-encoding for URLs. Replaces unsafe ASCII characters with "%" followed by two hexadecimal digits.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center mb-3">
                <span className="text-white text-xs font-bold">BIN</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2 text-sm">Binary</h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                Represents text using binary digits (0s and 1s). Each character is converted to its 8-bit binary representation.
              </p>
            </div>
          </div>

          {/* Algorithm Details */}
          <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">How the Algorithms Work</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p><strong>Encryption vs Encoding:</strong> Encryption requires a key to secure data, while encoding simply converts data to a different format without security.</p>
              <p><strong>Caesar Cipher:</strong> Shifts each letter by a fixed number. For example, with shift 3: A→D, B→E, etc.</p>
              <p><strong>AES:</strong> Uses symmetric key encryption with block cipher technology for secure data transmission.</p>
              <p><strong>Substitution:</strong> Maps each letter to another letter based on a custom substitution key.</p>
              <p><strong>Base64:</strong> Uses 64 characters (A-Z, a-z, 0-9, +, /) to represent binary data in text format. Example: "Hello" → "SGVsbG8="</p>
              <p><strong>Hexadecimal:</strong> Represents each byte as two hex digits (0-9, A-F). Example: "Hello" → "48656c6c6f"</p>
              <p><strong>URL Encoding:</strong> Replaces special characters with % followed by hex code. Example: "hello world" → "hello%20world"</p>
              <p><strong>Binary:</strong> Converts each character to 8-bit binary. Example: "A" → "01000001"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
