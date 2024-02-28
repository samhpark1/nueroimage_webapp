from flask import Flask, jsonify, request
import json
import paramiko
import os
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

    model_choice_string = request.form.get('modelChoice')
    model_choice = json.loads(model_choice_string)

    return jsonify({'filename': file.filename, 'modelChoices': model_choice})

    file_path = '/tmp/' + file.filename
    file.save(file_path)

    ssh_host = 'remote_server_ip'
    ssh_port = 22
    ssh_username = 'ssh_username'
    ssh_password = 'ssh_password'

    ssh_client = paramiko.SSHClient()
    ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:
        ssh_client.connect(hostname=ssh_host, prt=ssh_port, username=ssh_username, password=ssh_password)

        remote_file_path = '/path/to/destination/' + file.filename
        ftp_client = ssh_client.open_sftp()
        ftp_client.put(file_path, remote_file_path)
        ftp_client.close()

        commands = [
            'conda activate py3',
            'python main.py --run_freesurfer True -run_mriqc True'
        ]

        for command in commands:
            _, stdout, stderr = ssh_client.exec_command(command)
            output = stdout.read().decode()
            error = stderr.read().decode()

        if error:
            return jsonify({'error': error})
        else:
            return jsonify({'result': output})
    except Exception as e:
        return jsonify({'error': str(e)})
    finally:
        ssh_client.close()
        os.remove(file_path)
    

if __name__ == '__main__':
    app.run(debug=True)
