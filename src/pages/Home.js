import {useEffect, useState} from 'react';
import NiftiUploadView from '../components/NiftiUploadView';
import BrainExtractViewer from '../components/BrainExtractViewer';

const Home = () => {

    const [selectedModels, setSelectedModels] = useState([]);
    const [modelLoading, setModelLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
    }, [selectedFiles])

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
        <div className="flex flex-col p-10">
            <section>
                <NiftiUploadView selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles}/>
            </section>
            <section>
                <BrainExtractViewer selectedFiles={selectedFiles}/>
            </section>
            <section className='my-5'>
                <h2 className='text-3xl font-bold text-gray-600 text-shadow'>Run Models</h2>
                <h2 className='text-xl text-gray-600 my-3'>Choose Prediction Model(s) to Run</h2>
                <section className="flex justify-between w-3/4">
                    <label>
                        <h4 className='text-md font-bold text-gray-600 text-shadow'>AD</h4>
                        <input 
                            type="checkbox"
                            name="model"
                            value="AD"
                            onChange={handleModelChoice}
                        />
                    </label>

                    <label>
                        <h4 className='text-md font-bold text-gray-600 text-shadow'>Age</h4>
                        <input 
                            type="checkbox"
                            name="model"
                            value="age"
                            onChange={handleModelChoice}
                        />
                    </label>

                    <label>
                        <h4 className='text-md font-bold text-gray-600 text-shadow'>AB/LBD</h4>
                        <input 
                            type="checkbox"
                            name="model"
                            value="AD/LBD"
                            onChange={handleModelChoice}
                        />
                    </label>

                    <label>
                        <h4 className='text-md font-bold text-gray-600 text-shadow'>AB/CAA</h4>
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
                        className="bg-gray-600 text-gray-200 hover:bg-gray-800 focus:bg-gray-600 active:bg-gray-800 px-4 py-2 rounded-full my-5"
                        >
                            Run
                    </button>
                </section>
            </section>
            
        </div>
    )
}

export default Home;