import {useState, useEffect} from 'react';


const APITest = (props) => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const apiUrl = 'http://127.0.0.1:5000/api/upload'

    useEffect(() => {
        if (props.file){
            const uploadFile = async () => {
                const formData = new FormData();
                formData.append('file', props.file);
                const modelChoice = JSON.stringify(["AD", "Age"]);
                formData.append('modelChoice', modelChoice);
        
                try{
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        body: formData,
                    });
        
                    if (response.ok){
                        const data = await response.json();
                        setResponse(data);
                    }
                    else{
                        setError('Failed to submit form');
                    }
        
                }
                catch (error){
                    setError(error.message);
                }
            }

            uploadFile();
        }
    }, [props.file])

    return (
        <div>
            {response && <p>Response: {JSON.stringify(response)}</p>}
            {error && <p>Error: {error}</p>}
        </div>
    )

//     const [hostname, setHostname] = useState('');
//   const [username, setUsername] = useState('');
//   const [result, setResult] = useState(null);

//   const testSSHConnection = async (event) => {
//     event.preventDefault();

//     const formData = new FormData();
//     formData.append('hostname', hostname);
//     formData.append('username', username);

//     try {
//       const response = await fetch('http://localhost:5000/test_ssh_connection', {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();
//       setResult(data.success ? 'Connection successful' : 'Connection failed');
//     } catch (error) {
//       console.error('Error:', error);
//       setResult('An error occurred while connecting');
//     }
//   };

//   return (
//     <div>
//       <h1>Test SSH Connection</h1>
//       <form onSubmit={testSSHConnection}>
//         <div>
//           <label>Hostname: </label>
//           <input type="text" value={hostname} onChange={(e) => setHostname(e.target.value)} />
//         </div>
//         <div>
//           <label>Username: </label>
//           <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
//         </div>
//         <button type="submit">Test Connection</button>
//       </form>
//       <div>{result && <p>{result}</p>}</div>
//     </div>
//   );
}

export default APITest;