import React, { useEffect, useState, useRef } from 'react';

const NiftiView = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    //const [params, setParams] = useState(null);
    const papayaViewerRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = {
                    images: [URL.createObjectURL(props.file)],
                    kioskMode: true,
                    worldSpace: true,
                    showControlBar: true,

                };

                //setParams(loadedParams);
                window.papaya.Container.addViewer(papayaViewerRef.current.id, params);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setIsLoading(false);
            }
        };


        fetchData();

        return () => {
            if (papayaViewerRef.currrent){
                papayaViewerRef.current.innerHTML = '';
            }
        }

    }, [props.file]);


    // useEffect(() => {
    //     if (!isLoading && params) {
    //         window.papaya.Container.startPapaya();
    //         window.papaya.Container.resetViewer(0, params);
    //     }

    // }, [isLoading, params]);


    // useEffect(() => {
    //     if (!isLoading && papayaViewerRef.current) {
    //         window.scrollTo({top: papayaViewerRef.current.offsetTop, behavior: 'smooth'})
    //     }
    // }, [isLoading])

    // return (
    //     <div style={{ "width": "800px", "marginTop": "10px" }} >
    //         <div id="papaya_viewer" className="papaya"></div>
    //     </div>
    // );

    return(
        <div id='papaya_viewer' ref={papayaViewerRef} />
    ) 
};

export default NiftiView;
