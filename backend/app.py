from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/api/uploadFile', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'no file part'})
    
    file = request.files['file']

    if file.filename == '':
        return jsonify({'error':'no selected file'})

    return jsonify({'filename' : file.filename})
    

if __name__ == '__main__':
    app.run(debug=True)
