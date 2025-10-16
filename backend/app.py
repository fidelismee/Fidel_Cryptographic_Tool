from flask import Flask, request, jsonify, send_from_directory
from cryptography.fernet import Fernet
import base64
import os
from dotenv import load_dotenv
from flask_cors import CORS



# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder="static", static_url_path="/")

CORS(app)
# Generate or load encryption key
def get_encryption_key():
    key = os.getenv('ENCRYPTION_KEY')
    if not key:
        # Generate a new key if none exists
        key = Fernet.generate_key().decode()
        # In production, you should set this as an environment variable
        print(f"Generated new encryption key: {key}")
    return key.encode()

ENCRYPTION_KEY = get_encryption_key()
fernet = Fernet(ENCRYPTION_KEY)

# Caesar Cipher Implementation
def caesar_cipher(text, shift, encrypt=True):
    result = ""
    for char in text:
        if char.isalpha():
            ascii_offset = ord('a') if char.islower() else ord('A')
            shifted = (ord(char) - ascii_offset + (shift if encrypt else -shift)) % 26
            result += chr(shifted + ascii_offset)
        else:
            result += char
    return result

# Simple Substitution Cipher Implementation
def substitution_cipher(text, key, encrypt=True):
    if encrypt:
        # Create substitution mapping
        alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        mapping = {alphabet[i]: key[i] for i in range(len(alphabet))}
        return ''.join(mapping.get(char, char) for char in text)
    else:
        # Reverse mapping for decryption
        alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        mapping = {key[i]: alphabet[i] for i in range(len(alphabet))}
        return ''.join(mapping.get(char, char) for char in text)

# Encoding/Decoding Functions
def base64_encode(text):
    """Encode text to Base64"""
    try:
        encoded_bytes = base64.b64encode(text.encode('utf-8'))
        return encoded_bytes.decode('utf-8')
    except Exception as e:
        raise Exception(f"Base64 encoding failed: {str(e)}")

def base64_decode(encoded_text):
    """Decode Base64 text"""
    try:
        decoded_bytes = base64.b64decode(encoded_text.encode('utf-8'))
        return decoded_bytes.decode('utf-8')
    except Exception as e:
        raise Exception(f"Base64 decoding failed: {str(e)}")

def hex_encode(text):
    """Encode text to hexadecimal"""
    try:
        return text.encode('utf-8').hex()
    except Exception as e:
        raise Exception(f"Hex encoding failed: {str(e)}")

def hex_decode(hex_text):
    """Decode hexadecimal text"""
    try:
        decoded_bytes = bytes.fromhex(hex_text)
        return decoded_bytes.decode('utf-8')
    except Exception as e:
        raise Exception(f"Hex decoding failed: {str(e)}")

def url_encode(text):
    """URL encode text"""
    try:
        import urllib.parse
        return urllib.parse.quote(text)
    except Exception as e:
        raise Exception(f"URL encoding failed: {str(e)}")

def url_decode(encoded_text):
    """URL decode text"""
    try:
        import urllib.parse
        return urllib.parse.unquote(encoded_text)
    except Exception as e:
        raise Exception(f"URL decoding failed: {str(e)}")

def binary_encode(text):
    """Encode text to binary"""
    try:
        return ' '.join(format(ord(char), '08b') for char in text)
    except Exception as e:
        raise Exception(f"Binary encoding failed: {str(e)}")

def binary_decode(binary_text):
    """Decode binary text"""
    try:
        # Remove spaces and split into 8-bit chunks
        binary_text = binary_text.replace(' ', '')
        chars = []
        for i in range(0, len(binary_text), 8):
            byte = binary_text[i:i+8]
            if len(byte) == 8:
                chars.append(chr(int(byte, 2)))
        return ''.join(chars)
    except Exception as e:
        raise Exception(f"Binary decoding failed: {str(e)}")

@app.route('/api/encrypt', methods=['POST'])
def encrypt_text():
    try:
        data = request.get_json()
        text = data.get('text', '')
        algorithm = data.get('algorithm', 'caesar')
        key = data.get('key', '3')  # Default shift for Caesar
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        result = ""
        
        if algorithm == 'caesar':
            try:
                shift = int(key)
                result = caesar_cipher(text, shift, encrypt=True)
            except ValueError:
                return jsonify({'error': 'Invalid shift value for Caesar cipher'}), 400
                
        elif algorithm == 'aes':
            try:
                encrypted = fernet.encrypt(text.encode())
                result = encrypted.decode()
            except Exception as e:
                return jsonify({'error': f'AES encryption failed: {str(e)}'}), 400
                
        elif algorithm == 'substitution':
            if len(key) != 52:
                return jsonify({'error': 'Substitution key must be 52 characters (a-zA-Z)'}), 400
            result = substitution_cipher(text, key, encrypt=True)
            
        else:
            return jsonify({'error': 'Invalid algorithm'}), 400
            
        return jsonify({'encrypted_text': result})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/decrypt', methods=['POST'])
def decrypt_text():
    try:
        data = request.get_json()
        text = data.get('text', '')
        algorithm = data.get('algorithm', 'caesar')
        key = data.get('key', '3')  # Default shift for Caesar
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        result = ""
        
        if algorithm == 'caesar':
            try:
                shift = int(key)
                result = caesar_cipher(text, shift, encrypt=False)
            except ValueError:
                return jsonify({'error': 'Invalid shift value for Caesar cipher'}), 400
                
        elif algorithm == 'aes':
            try:
                decrypted = fernet.decrypt(text.encode())
                result = decrypted.decode()
            except Exception as e:
                return jsonify({'error': f'AES decryption failed: {str(e)}'}), 400
                
        elif algorithm == 'substitution':
            if len(key) != 52:
                return jsonify({'error': 'Substitution key must be 52 characters (a-zA-Z)'}), 400
            result = substitution_cipher(text, key, encrypt=False)
            
        else:
            return jsonify({'error': 'Invalid algorithm'}), 400
            
        return jsonify({'decrypted_text': result})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/algorithms', methods=['GET'])
def get_algorithms():
    return jsonify({
        'algorithms': [
            {'name': 'Caesar Cipher', 'value': 'caesar', 'requires_key': True, 'key_description': 'Shift amount (integer)'},
            {'name': 'AES Encryption', 'value': 'aes', 'requires_key': False, 'key_description': 'Not required (uses secure key)'},
            {'name': 'Substitution Cipher', 'value': 'substitution', 'requires_key': True, 'key_description': '52-character substitution key (a-zA-Z)'}
        ]
    })

@app.route('/api/encode', methods=['POST'])
def encode_text():
    try:
        data = request.get_json()
        text = data.get('text', '')
        encoding_type = data.get('encoding_type', 'base64')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        result = ""
        
        if encoding_type == 'base64':
            result = base64_encode(text)
        elif encoding_type == 'hex':
            result = hex_encode(text)
        elif encoding_type == 'url':
            result = url_encode(text)
        elif encoding_type == 'binary':
            result = binary_encode(text)
        else:
            return jsonify({'error': 'Invalid encoding type'}), 400
            
        return jsonify({'encoded_text': result})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/decode', methods=['POST'])
def decode_text():
    try:
        data = request.get_json()
        text = data.get('text', '')
        encoding_type = data.get('encoding_type', 'base64')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        result = ""
        
        if encoding_type == 'base64':
            result = base64_decode(text)
        elif encoding_type == 'hex':
            result = hex_decode(text)
        elif encoding_type == 'url':
            result = url_decode(text)
        elif encoding_type == 'binary':
            result = binary_decode(text)
        else:
            return jsonify({'error': 'Invalid encoding type'}), 400
            
        return jsonify({'decoded_text': result})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/encoding_types', methods=['GET'])
def get_encoding_types():
    return jsonify({
        'encoding_types': [
            {'name': 'Base64', 'value': 'base64', 'description': 'Base64 encoding for binary data'},
            {'name': 'Hexadecimal', 'value': 'hex', 'description': 'Hexadecimal representation of bytes'},
            {'name': 'URL Encoding', 'value': 'url', 'description': 'Percent-encoding for URLs'},
            {'name': 'Binary', 'value': 'binary', 'description': 'Binary representation (8-bit chunks)'}
        ]
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Encryption API is running'})

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

def create_app():
    return app

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
