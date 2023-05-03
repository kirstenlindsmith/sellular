import { useEffect, useMemo, useState } from 'react';

//NOTE: grabs accurate image size to center the square-crop of image for list view
export const useListImageStyles = (id) => {
  const [imageTranslate, setImageTranslate] = useState('translate(0, 0)');
  const [imageSize, setImageSize] = useState({
    height: undefined,
    width: undefined,
  });

  const imageStyles = useMemo(
    () => ({
      width: imageSize.width,
      height: imageSize.height,
      transform: imageTranslate,
    }),
    [imageSize.height, imageSize.width, imageTranslate]
  );

  useEffect(() => {
    const getImageStyles = () => {
      const imageElement = document?.getElementById(`${id}-image`);
      if (!imageElement) return;
      const width = imageElement.getBoundingClientRect()?.width ?? 0;
      const height = imageElement.getBoundingClientRect()?.height ?? 0;
      const isTall = width < height;
      if (isTall) {
        setImageSize({ height: 'auto', width: '100%' });
      } else {
        setImageSize({ height: '100%', width: 'auto' });
      }

      const imageContainer = document?.getElementById(`${id}-image-container`);
      if (!imageContainer) return;
      const containerWidth = imageContainer.getBoundingClientRect()?.width ?? 0;
      const containerHeight =
        imageContainer.getBoundingClientRect()?.height ?? 0;
      const offsetX = isTall ? 0 : (width - containerWidth) / 2;
      const offsetY = isTall ? (height - containerHeight) / 2 : 0;
      setImageTranslate(`translate(${-offsetX}px, ${-offsetY}px)`);
    };

    getImageStyles();
    window.addEventListener('resize', getImageStyles());
    return () => window.removeEventListener('resize', getImageStyles());
  }, [id]);

  return imageStyles;
};

export default useListImageStyles;
