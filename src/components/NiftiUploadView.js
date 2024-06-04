import {useState, useRef} from 'react';
import NiftiView from './NiftiView';

const NiftiUploadView = (props) => {

    const [isSubmitted, setIsSubmitted] = useState(false);
    const fileInputRef = useRef(null);
    const [windowChoice, setWindowChoice] = useState(0);

    const nextWindow = () => {
        if (windowChoice === props.selectedFiles.length-1){
            setWindowChoice(0);
        }
        else{
            setWindowChoice(windowChoice + 1);
        }
    }

    const prevWindow = () => {
        if (windowChoice === 0){
            setWindowChoice(props.selectedFiles.length-1);
        }
        else{
            setWindowChoice(windowChoice - 1);
        }
    }

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

        if (props.selectedFiles.length !== 5){
            props.setSelectedFiles([...props.selectedFiles, ...files]);
        }
        else{
            alert("Maximum number of files that can be uploaded is 5");
        }
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
        <div className="flex border-b py-5">
            <div className="flex flex-col items-start mr-5">
                <h2 className='text-3xl font-bold text-gray-600 text-shadow'>File Upload Form</h2>
                <h3 className='text-xl text-gray-600 my-3'>Only files of type .nii.gz will be accepted (Limit of 5)</h3>
                <form 
                className=""
                onSubmit={submitHandler} 
                onDragOver={dragOverHandler} 
                onDrop={dropHandler}>
                    <input 
                        type="file"
                        id="file"
                        name="file"
                        accept="application/gzip,.nii"
                        onChange={fileChangeHandler}
                        ref={fileInputRef}
                        className="hidden"
                        max={5}
                        multiple
                    />

                    <section>
                        <div
                            className="flex flex-col justify-center items-center w-96 h-64 border-2 border-dashed border-gray-700 p-4 rounded-md my-5"
                            onDragOver={dragOverHandler}
                            onDrop={dropHandler}
                            onClick={dragBoxClickHandler}
                            >
                                <h3 className='text-xl font-bold text-gray-600'>Drop Files Here</h3>
                                <h4 className='text-md text-gray-600'>or Click to Add Files</h4>

                                {props.selectedFiles.map((file, index) => (
                                    <h4 className={`text-md ${windowChoice === index ? 'text-blue-500 underline' : 'text-gray-600'} font-bold`} key={index}>{file.name}</h4>
                                ))}
                        </div> 
                        
                    </section>
                    
                    <section className='flex justify-between my-4'>
                        <button type="submit" className="bg-gray-600 text-gray-200 hover:bg-gray-800 focus:bg-gray-600 active:bg-gray-800 px-4 py-2 rounded-full m-0.5">
                            Upload File(s)
                        </button>
                        <h1 onClick={removeFiles} className="bg-gray-600 text-gray-200 hover:bg-gray-800 focus:bg-gray-600 active:bg-gray-800 px-4 py-2 rounded-full m-0.5">
                            Clear
                        </h1>
                    </section>
                </form>
            </div>
            <div className='p-5 w-full'>
                {isSubmitted && <NiftiView id={props.selectedFiles[windowChoice].name} next={nextWindow} prev={prevWindow} file={props.selectedFiles[windowChoice]} /> }
                {!isSubmitted && 
                    <div className='flex justify-center items-center w-full h-96 border border-gray-200 text-red-500 underline px-10 rounded-lg shadow-lg'>
                        Upload File(s) to View
                    </div>
                }
            </div>
        </div>
    )
}

export default NiftiUploadView;