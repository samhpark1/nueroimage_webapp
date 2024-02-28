import {useState, useEffect} from 'react';


const APITest = (props) => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const apiUrl = 'http://127.0.0.1:5000/api/uploadFile'

    useEffect(() => {
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
    }, [props.file])

    return (
        <div>
            {response && <p>Response: {JSON.stringify(response)}</p>}
            {error && <p>Error: {error}</p>}
        </div>
    )
}

export default APITest;