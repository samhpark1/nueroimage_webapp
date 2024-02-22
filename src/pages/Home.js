import {useState} from 'react';
import NiftiUploadView from '../components/NiftiUploadView';

const Home = () => {

    const [selectedModels, setSelectedModels] = useState([]);

    const handleModelChoice = (e) => {
        const selectedModel = e.target.value;
        if (selectedModels.includes(selectedModel)){
            setSelectedModels(selectedModels.filter(model => model !== selectedModel));
        }
        else{
            setSelectedModels([...selectedModels, selectedModel]);
        }
    }

    const submitModelHandler = () => {
        if (selectedModels.length > 0){
            console.log(selectedModels);
        }
        else{
            alert("Please select at least one prediction model.")
        }
    }

    return (
        <div className="flex flex-col items-center">
            <section>
                <NiftiUploadView />
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