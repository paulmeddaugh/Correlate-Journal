import { useState, useEffect } from "react";

export const usePreload = (urls) => { // urls: { images: [], fonts: [] }
  
  const [status, setStatus] = useState({ images: false, fonts: false });
  const [preloadComponents, setPreloadComponents] = useState(false);
  
  const [isPreloaded, setPreloaded] = useState(false);

  useEffect(() => {

    if (!Array.isArray(urls?.images) && !Array.isArray(urls?.fonts)) return;

    const imageRefs = [];
    const imagesLoaded = urls.images.map((image, i) => {
      return (
        <img 
          className={'d-none'} 
          src={image} 
          alt={`preloaded-image-${i}`}
          onLoad={updateImageStatus(imageRefs)}
          onError={updateImageStatus(imageRefs)}
          ref={(ref) => imageRefs.push(ref)}
          key={i + 5000}
        ></img>
      )
    });

    function updateImageStatus (images) { // images: HTMLImageElement[]
      setStatus(prev => {return { ...prev, images: images.every((image) => image.complete) }});
    };

    if (imagesLoaded.length === 0 && urls.fonts.length === 0) {
      setPreloaded(true);
      return;
    }

    setPreloadComponents([ ...imagesLoaded ]);

    (async () => {
      await Promise.allSettled(
        urls.fonts.map(fontName => document.fonts.load(`12px ${fontName}`))
      );
      setStatus(prev => {return { ...prev, fonts: true }});
    })();
    
  }, [urls]);

  useEffect(() => {
    setPreloaded(status.images && status.fonts);
  }, [status, setPreloaded]);

  return [isPreloaded, preloadComponents];
};
