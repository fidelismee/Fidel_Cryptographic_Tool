# Fidel_Cryptographic_Tool

A web application with React frontend and Python Flask backend that allows users to encrypt/decrypt text using various algorithms and encode/decode text using multiple encoding formats.

## Features

- **Multiple Encryption Algorithms**:
  - Caesar Cipher (with customizable shift)
  - AES Encryption (secure symmetric encryption)
  - Substitution Cipher (custom substitution pattern)

- **Multiple Encoding Formats**:
  - Base64 encoding/decoding
  - Hexadecimal encoding/decoding
  - URL encoding/decoding
  - Binary encoding/decoding

- **Clean UI**: Built with React and styled with Tailwind CSS v3
- **RESTful API**: Python Flask backend with CORS support
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

### Frontend
- React 19
- Vite
- Tailwind CSS v3
- JavaScript/ES6+

### Backend
- Python 3
- Flask
- Flask-CORS
- Cryptography library (for AES encryption)
- python-dotenv (for environment variable management)

## Setup Instructions

### Prerequisites
- Node.js (for frontend)
- Python 3.11+ (for backend)
- pip (Python package manager)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Start the backend server:
   ```bash
   python app.py
   ```
   The backend will run on http://localhost:5000

### Environment Variables

The application uses environment variables for configuration. Create a `.env` file in the backend directory with the following optional variables:

```env
ENCRYPTION_KEY=your_encryption_key_here
```

- `ENCRYPTION_KEY`: A Fernet encryption key for AES encryption. If not provided, the application will generate one automatically on first run.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on http://localhost:5173

## API Endpoints

### Encryption/Decryption
- `GET /api/algorithms` - Get list of available encryption algorithms
- `POST /api/encrypt` - Encrypt text using selected algorithm
- `POST /api/decrypt` - Decrypt text using selected algorithm

### Encoding/Decoding
- `GET /api/encoding_types` - Get list of available encoding types
- `POST /api/encode` - Encode text using selected encoding type
- `POST /api/decode` - Decode text using selected encoding type

### Utility
- `GET /health` - Health check endpoint

## Usage

### Encryption/Decryption
1. Open your browser and go to http://localhost:5173
2. Select an encryption algorithm from the dropdown
3. Enter the encryption key (if required by the algorithm)
4. Type or paste your text in the input field
5. Click "Encrypt" or "Decrypt" to process the text
6. View the result in the output area

### Encoding/Decoding
1. Open your browser and go to http://localhost:5173
2. Select an encoding type from the dropdown
3. Type or paste your text in the input field
4. Click "Encode" or "Decode" to process the text
5. View the result in the output area

## Algorithm Details

### Encryption Algorithms

#### Caesar Cipher
- Requires: Integer shift value (default: 3)
- Shifts each letter by the specified number of positions in the alphabet

#### AES Encryption
- Uses: Secure symmetric encryption with generated key
- No key input required from user
- Industry-standard encryption

#### Substitution Cipher
- Requires: 52-character substitution key (a-zA-Z mapping)
- Each letter is replaced according to the substitution pattern

### Encoding Types

#### Base64 Encoding
- Encodes binary data to ASCII text format
- Commonly used for data transmission and storage

#### Hexadecimal Encoding
- Converts text to hexadecimal representation
- Each character represented by two hex digits

#### URL Encoding
- Percent-encoding for safe URL transmission
- Replaces special characters with %XX codes

#### Binary Encoding
- Converts text to binary representation (8-bit chunks)
- Each character represented as 8 binary digits

## Project Structure

```
Fidel_Cryptographic_Tool/
├── backend/
│   ├── app.py              # Flask application with encryption/encoding APIs
│   ├── requirements.txt    # Python dependencies
│   └── venv/              # Virtual environment
└── frontend/
    ├── src/
    │   ├── App.jsx         # Main React component
    │   ├── App.css         # Additional styles
    │   └── index.css       # Tailwind CSS imports
    ├── package.json        # Node.js dependencies
    └── tailwind.config.js  # Tailwind configuration
```

## Development

The backend uses Flask with automatic reloading for development. The frontend uses Vite with hot module replacement for fast development.

Both servers need to be running simultaneously for the full application to work.

Email : farisikhwanjalali@gmail.com
