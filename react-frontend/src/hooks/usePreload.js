import { useState, useEffect } from "react";

export const usePreload = (urls) => { // urls: { images: [], fonts: [] }
  
  const [status, setStatus] = useState({ images: false, fonts: false });  
  const [isPreloaded, setPreloaded] = useState(false);

  useEffect(() => {

    if (!Array.isArray(urls?.images) && !Array.isArray(urls?.fonts)) return;

    let imageComponents = [];
    imageComponents = urls.images.map((src, i) => {
      const img = new Image();
  
      img.src = src;
      img.onload = img.onerror = updateImageStatus(imageComponents);
    });

    function updateImageStatus (images) { // images: HTMLImageElement[]
      setStatus(prev => {return { ...prev, images: images.every((image) => image.complete) }});
    };

    if (imageComponents.length === 0 && urls.fonts.length === 0) {
      setPreloaded(true);
      return;
    }

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

  return isPreloaded;
};
