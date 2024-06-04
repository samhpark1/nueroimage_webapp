from flask import Flask, jsonify, request, make_response, send_file
import paramiko
import os
from flask_cors import CORS
import time
import io
 

app = Flask(__name__)
CORS(app)

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

@app.route('/api/upload', methods=['POST'])
def uploadFile():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        private_key_path = '/Users/sampark/.ssh/id_rsa'
        username = 'david'
        hostname = 'walnut.fap.li'
        port = 2223

        # Save the file locally
        file_path = '/tmp/' + file.filename
        file.save(file_path)

        # Create a new SSH client
        ssh_client = paramiko.SSHClient()

        # Automatically add host keys
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        # Load the private key
        private_key = paramiko.RSAKey.from_private_key_file(private_key_path)

        # Connect to the server
        ssh_client.connect(hostname=hostname, port=port, username=username, pkey=private_key)

        print("SSH connection established successfully.")

        # Create an SFTP session
        sftp = ssh_client.open_sftp()

        # Navigate to a certain directory
        remote_directory = '/home/david/projects/visualize'
        sftp.chdir(remote_directory)

        # Upload the file
        remote_file_path = os.path.join(remote_directory, file.filename)
        sftp.put(file_path, remote_file_path)
        print(f"File uploaded to {remote_file_path}")

        # Execute commands
        brain_extract_file = 'extract_' + file.filename
        python_script_command =f'/home/{username}/anaconda3/envs/py3flask/bin/python BrainExtraction.py --in_file ./{file.filename} --out_file ./{brain_extract_file}' 

        command = f'''
        cd projects/visualize &&
        export FREESURFER_HOME=/mnt/prolabnas/fs741 &&
        export FSLOUTPUTTYPE=NIFTI &&
        source /usr/share/fsl/5.0/etc/fslconf/fsl.sh &&
        {python_script_command}
        '''


        
        stdin, stdout, stderr = ssh_client.exec_command(command)
        stdout.channel.recv_exit_status()
        print(stderr.read().decode('utf-8'))

        remote_brain_extract_file_path = f'{remote_directory}/{brain_extract_file}'
        local_brain_extract_file_path = f'/tmp/{brain_extract_file}'
        while True:
            if sftp.listdir(remote_directory):
                print('loading...')
                if brain_extract_file in sftp.listdir(remote_directory):
                    sftp.get(remote_brain_extract_file_path, local_brain_extract_file_path)
                    break
            time.sleep(1)
        print('downloaded')


        # Close the SFTP session and the SSH connection
        sftp.remove(remote_brain_extract_file_path)
        sftp.remove(remote_file_path)

        sftp.close()
        ssh_client.close()


        with open(local_brain_extract_file_path, "rb") as f:
            file_content = f.read()
        print('file content read')

        os.remove(local_brain_extract_file_path)
        print('local extract file removed')
        os.remove(file_path)
        print('local og file removed')

        response = make_response(file_content)
        response.headers['Content-Type'] = 'application/octet-stream'
        response.headers['Content-Disposition'] = f'attachment; filename={brain_extract_file}'
        print('response created')
        return response, 200

    except Exception as e:
        return jsonify({'error' : str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
