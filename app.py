
from flask import Flask, request, jsonify, session, render_template
from functools import wraps
import os



app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "development_secret_key")




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



if __name__ == '__main__':
    app.run(debug=True, port=5000)