# CRYPT
A simple web application that demonstrates cryptographic algorithms (ElGamal, RSA, etc.) using a Flask backend and a React frontend.

## Prerequisites
Before you begin, ensure you have the following installed:
- Python 3.8+
- Node.js (v16 or higher) and npm
- Git

## Getting Started
### 1. Clone the repository
```bash
git clone https://github.com/tthuy123/crypt.git
cd crypt
```
### 2. Setting up the backend
#### Navigate to the backend directory:
```bash
cd backend
```
#### Create a virtual environment
``` bash
python -m venv venv
```
#### Activate the virtual environment
 - On Windows
   ```bash
   venv\Scripts\activate
   ```
- On macOS/Linux:
  ```bash
  source venv/bin/activate
  ```
#### Install required dependencies:
```bash
pip install -r requirements.txt
```
#### Run the Flask server
```bash
flask run
```
The backend server should now be running at http://127.0.0.1:5000.
### 3. Setting up the frontend
#### Navigate to the frontend directory:
```bash
cd ../frontend
```
#### Install required dependencies:
```bash
npm install
```
#### Start the React development server:
```bash
npm run dev
```
The frontend should now be running at http://localhost:5173.
