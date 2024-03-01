import React, { useEffect, useRef } from 'react';

const NiftiView = (props) => {
    const papayaViewerRef = useRef(null);

    useEffect(() => {
        const viewerRef = papayaViewerRef.current;
        const fetchData = async () => {
            try {
                const params = {
                    images: [URL.createObjectURL(props.file)],
                    kioskMode: true,
                    worldSpace: true,
                    showControlBar: true,
                    allowScroll: false,
                };

                window.papaya.Container.addViewer(viewerRef.id, params);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };


        fetchData();
        return () => {
            if (viewerRef){
                viewerRef.innerHTML = '';
            }
        }


    }, [props.file]);

    

    return(
        <div className='flex flex-col items-center border  border-gray-200 px-10 rounded-lg shadow-lg mx-5'>
            <section className='flex justify-between'>
                <button onClick={props.prev} className="bg-gray-600 text-gray-200 hover:bg-gray-800 focus:bg-gray-600 active:bg-gray-800 px-2 py-1 rounded-lg m-4">prev</button>
                <h2 className='text-xl font-bold underline m-5'>{props.file.name}</h2>
                <button onClick={props.next} className="bg-gray-600 text-gray-200 hover:bg-gray-800 focus:bg-gray-600 active:bg-gray-800 px-2 py-1 rounded-lg m-4">next</button>
            </section>
            <div id='papaya_viewer' ref={papayaViewerRef} />
        </div>
        
    ) 
};

export default NiftiView;