import {useEffect, useState} from 'react';
import NiftiView from './NiftiView';

const BrainExtractViewer = (props) => {

    const [files, setFiles] = useState([]);
    const [targetFile, setTargetFile] = useState(null);
    const [extractFile, setExtractFile] = useState(null);

    useEffect(() => {
        if (props.selectedFiles !== undefined){
            setFiles(props.selectedFiles)
        }
    }, [props.selectedFiles, extractFile])

    const onSubmit = () => {
        if (targetFile !== null){
            const brainExtractURL = 'http://127.0.0.1:5000/api/upload';
            const uploadFile = async () => {
                const formData = new FormData();
                formData.append('file', files[targetFile]);

                try{
                    const response = await fetch(brainExtractURL, {
                        method: 'POST',
                        body: formData,
                    });

                    if (response.ok){
                        const blob = await response.blob();
                        const newFile = new File([blob], 'extract_' + files[targetFile].name, {type: 'application/octet_stream'});
                        setExtractFile(newFile);
                    }
                    else{
                        console.log("failed to submit form")
                    }
                }
                catch(error){
                    console.log(error.message);
                }
            }

            uploadFile();
        }
        else{
            alert("Select file first");
        }
        
    }

    return(
        <div>
            <section>
                <h2 className='text-3xl font-bold text-gray-600 text-shadow'>Brain Extract</h2>
                <h3 className='text-xl text-gray-600 my-3'>
                    Performs brain extraction on a NIfTI file, producing a NIfTI file 
                    containing only the brain tissue while removing non-brain structures 
                    such as the skull and skin.
                </h3>

                <select onChange={(e) => setTargetFile(e.target.value)}>
                    <option value="">Select a file</option>
                    {files.map((option, index) => (
                    <option key={index} value={index}>
                        {option.name}
                    </option>
                    ))}
                </select>

                <button onClick={onSubmit}>Run Brain Extract</button>
            </section>
            <section>
                {extractFile && <NiftiView id={extractFile.name} file={extractFile}/>}
                {!extractFile && 
                    <div className='flex justify-center items-center w-full h-96 border border-gray-200 text-red-500 underline px-10 rounded-lg shadow-lg'>
                        Upload File(s) to View
                    </div>
                }
            </section>
        </div>
    )
}

export default BrainExtractViewer;