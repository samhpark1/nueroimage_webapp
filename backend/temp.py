import paramiko
import sys

def ssh_connection(private_key_path, username, hostname, port=22):
    try:
        # Create a new SSH client
        ssh_client = paramiko.SSHClient()

        # Automatically add host keys
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        # Load the private key
        private_key = paramiko.RSAKey.from_private_key_file(private_key_path)

        # Connect to the server
        ssh_client.connect(hostname=hostname, port=port, username=username, pkey=private_key)

        print("SSH connection established successfully.")

        # Invoke a shell
        ssh_shell = ssh_client.invoke_shell()

        # Send commands one at a time
        commands = ['cd projects', 'cd visualize', 'ls']
        for command in commands:
            ssh_shell.send(command + '\n')
            output = ''
            while not output.endswith('$ '):  # Assuming that the shell prompt ends with '$ '
                output += ssh_shell.recv(1024).decode()
            print(output)

        # Close the connection
        ssh_client.close()

    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: python ssh_connection.py <private_key_path> <username> <hostname> <port>")
        sys.exit(1)

    private_key_path = sys.argv[1]
    username = sys.argv[2]
    hostname = sys.argv[3]
    port = int(sys.argv[4])

    ssh_connection(private_key_path, username, hostname, port)
