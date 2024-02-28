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
        <div id='papaya_viewer' ref={papayaViewerRef} />
    ) 
};

export default NiftiView;