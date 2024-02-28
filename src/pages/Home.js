import {useEffect, useState} from 'react';
import NiftiUploadView from '../components/NiftiUploadView';

const Home = () => {

    const [selectedModels, setSelectedModels] = useState([]);
    const [modelLoading, setModelLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const apiURL = 'http://127.0.0.1:5000/api/uploadFile'

    const handleModelChoice = (e) => {
        const selectedModel = e.target.value;
        if (selectedModels.includes(selectedModel)){
            setSelectedModels(selectedModels.filter(model => model !== selectedModel));
        }
        else{
            setSelectedModels([...selectedModels, selectedModel]);
        }
    }


    const uploadFile = async (file) => {
        const formdata = new FormData();
        formdata.append('file', file);

        const modelChoice = JSON.stringify(selectedModels);
        formdata.append('modelChoice', modelChoice);

        try{
            const response = await fetch(apiURL, {
                method: 'POST',
                body: formdata,
            });

            if (response.ok){
                const data = await response.json();
                console.log(JSON.stringify(data));
            }
            else{
                console.error('Failed to submit form');
            }
        }
        catch (error) {
            console.error('Error: ', error);
        }
    }

    const submitModelHandler = () => {
        if (modelLoading){
            alert("Currently running model on file(s)")
        }
        else if (selectedModels.length <= 0){
            alert("Please select at least one prediction model.")
        }
        else if (selectedFiles.length <= 0){
            alert("Please select at least one file.")
        }
        else{ 
            for (let i = 0; i < selectedFiles.length; i++){
                setModelLoading(true);
                uploadFile(selectedFiles[i]);
            }
        }
    }

    return (
        <div className="flex flex-col items-center">
            <section>
                <NiftiUploadView selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles}/>
            </section>
            <h2>Choose Prediction Model(s) to Run</h2>
            <section className="flex flex-auto">
                <label>
                    <h4>AD</h4>
                    <input 
                        type="checkbox"
                        name="model"
                        value="AD"
                        onChange={handleModelChoice}
                    />
                </label>

                <label>
                    <h4>Age</h4>
                    <input 
                        type="checkbox"
                        name="model"
                        value="age"
                        onChange={handleModelChoice}
                    />
                </label>

                <label>
                    <h4>AB/LBD</h4>
                    <input 
                        type="checkbox"
                        name="model"
                        value="AD/LBD"
                        onChange={handleModelChoice}
                    />
                </label>

                <label>
                    <h4>AB/CAA</h4>
                    <input 
                        type="checkbox"
                        name="model"
                        value="AD/CAA"
                        onChange={handleModelChoice}
                    />
                </label>
            </section>
            <section>
                <button 
                    onClick={submitModelHandler}
                    className="bg-blue-400 text-white px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                    >
                        Submit
                </button>
            </section>
        </div>
    )
}

export default Home;