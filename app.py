
from flask import Flask, request, jsonify, session, render_template
from functools import wraps
import os
from auth_service import AuthService
from database import Database


app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "development_secret_key")

# Initialize components
db = Database()
auth_service = AuthService(db)

# Decorator for protected routes
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        session_token = request.headers.get('Authorization')
        
        if not session_token:
            return jsonify({'error': 'Authentication required'}), 401
        
        valid, result = auth_service.validate_session(session_token)
        if not valid:
            return jsonify({'error': 'Invalid session'}), 401
        
        request.user = result
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/Servicios')
def servicios():
    return render_template('servicios.html')

@app.route('/Galeria')
def galeria():
    return render_template('galeria.html')

@app.route('/Proyectos')
def proyectos():
    return render_template('proyectos.html')

@app.route('/Contacto')
def contacto():
    return render_template('contacto.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or 'username' not in data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    success, message = auth_service.register_user(
        data['username'],
        data['email'],
        data['password']
    )
    
    if success:
        return jsonify({'message': message}), 201
    else:
        return jsonify({'error': message}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Missing username or password'}), 400
    
    ip_address = request.remote_addr
    user_agent = request.headers.get('User-Agent')
    
    success, result = auth_service.login(
        data['username'],
        data['password'],
        ip_address
    )
    
    if success:
        return jsonify(result), 200
    else:
        return jsonify({'error': result}), 401

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    session_token = request.headers.get('Authorization')
    auth_service.logout(session_token)
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/profile', methods=['GET'])
@login_required
def profile():
    return jsonify({
        'user_id': request.user['user_id'],
        'username': request.user['username']
    }), 200

@app.route('/request-reset', methods=['POST'])
def request_password_reset():
    data = request.get_json()
    
    if not data or 'email' not in data:
        return jsonify({'error': 'Email required'}), 400
    
    success, message = auth_service.request_password_reset(data['email'])
    
    if success:
        return jsonify({'message': message}), 200
    else:
        return jsonify({'error': message}), 400

@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    
    if not data or 'token' not in data or 'new_password' not in data:
        return jsonify({'error': 'Token and new password required'}), 400
    
    success, message = auth_service.reset_password(
        data['token'],
        data['new_password']
    )
    
    if success:
        return jsonify({'message': message}), 200
    else:
        return jsonify({'error': message}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)