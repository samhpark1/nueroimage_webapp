import {useState, useRef} from 'react';
import NiftiView from './NiftiView';

const NiftiUploadView = (props) => {

    const [isSubmitted, setIsSubmitted] = useState(false);
    const fileInputRef = useRef(null);



    const areFilesDuplicates = (newFiles, existingFiles) => {
        const newFilesArray = Array.from(newFiles);

        return newFilesArray.some((newFile) =>
            existingFiles.some((existingFile) => existingFile.name === newFile.name)
        );
    }

    const fileChangeHandler = (e) => {
        const files = e.target.files;

        if(areFilesDuplicates(files, props.selectedFiles)){
            alert("Duplicate Files are Not Allowed");
            return;
        }

        props.setSelectedFiles([...props.selectedFiles, ...files]);
    }

    const dragOverHandler = (e) => {
        e.preventDefault();
    }

    const dropHandler = (e) => {
        e.preventDefault();

        const droppedFiles = e.dataTransfer.files;

        if(areFilesDuplicates(droppedFiles, props.selectedFiles)){
            alert("Duplicate Files are Not Allowed");
            return;
        }

        props.setSelectedFiles([...props.selectedFiles, ...droppedFiles]);
    }

    const dragBoxClickHandler = () => {
        fileInputRef.current.click();
    }

    const removeFiles = () => {
        props.setSelectedFiles([]);
        setIsSubmitted(false);
        fileInputRef.current.value = ''
    }

    const submitHandler = (e) => {
        e.preventDefault();

        if(props.selectedFiles.length === 0){
            alert("Please select atleast one file before submitting");
            return;
        }

        setIsSubmitted(true);
    }

    return (
        <div className="flex flex-col justifty-center items-center">
            <h2>File Upload Form</h2>
            <form 
            className="flex flex-col justify-center items-center"
            onSubmit={submitHandler} 
            onDragOver={dragOverHandler} 
            onDrop={dropHandler}>
                <input 
                    type="file"
                    id="file"
                    name="file"
                    accept=".nii, .gz"
                    onChange={fileChangeHandler}
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                />

                <section 
                    className="flex flex-col items-center border-2 border-dashed border-blue-400 p-4 rounded-md m-5"
                    onDragOver={dragOverHandler}
                    onDrop={dropHandler}
                    onClick={dragBoxClickHandler}
                    >
                        <h3>Drop Files Here or Click to Add Files</h3>
                        {props.selectedFiles.map((file, index) => (
                            <h4 key={index}>{file.name}</h4>    
                        ))}
                </section>
                
                <button type="submit" className="bg-blue-400 text-white px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue active:bg-blue-800">
                    Upload File(s)
                </button>
                <h1 onClick={removeFiles} className="bg-blue-400 text-white px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue active:bg-blue-800">
                    Clear
                </h1>
            </form>

            <section>
                {isSubmitted && <NiftiView file={props.selectedFiles[0]}/>}
            </section>
        </div>
    )
}

export default NiftiUploadView;