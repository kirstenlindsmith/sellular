import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { defaultTextInputState } from '../constants';
import {
  formatNumberToToDecimalString,
  formatStringToDecimalNumber,
  validateDollarField,
  validateStringLength,
} from '../helpers';
import { useItems, useTextInputState, useUser } from '../hooks';
import Item from '../models/Item';

const initialValue = {
  item: new Item(),
  loading: false,
  editModeActive: false,
  imageStyles: { width: 'auto', height: '100%', transform: 'translate(0, 0)' },
  itemTitle: defaultTextInputState,
  itemPrice: defaultTextInputState,
  itemDescription: defaultTextInputState,
  imageUrl: defaultTextInputState,
  isUserItem: false,
  handleEdit: () => undefined,
  handleSave: () => undefined,
  handleDelete: () => undefined,
};

export const SingleItemContext = createContext(initialValue);

const SingleItemProvider = ({ children, item }) => {
  const {
    id,
    title,
    description,
    price,
    image,
    unsaved, //temporary flag, only exists on new user items
  } = item;
  const { userName } = useUser();
  const { removeItem, saveItem, loadingItemIds, allItems } = useItems();
  const loading = useMemo(
    () => loadingItemIds.includes(id),
    [id, loadingItemIds]
  );

  const [editModeActive, setEditModeActive] = useState(!!unsaved);
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

  const itemTitle = useTextInputState({
    required: true,
    initialValue: title,
    validation: validateStringLength(25, 1),
  });
  const itemPrice = useTextInputState({
    required: true,
    initialValue: formatNumberToToDecimalString(price),
    validation: validateDollarField,
  });
  const itemDescription = useTextInputState({
    required: true,
    initialValue: description,
    validation: validateStringLength(100, 1),
  });
  const imageUrl = useTextInputState({
    initialValue: image,
  });

  const isUserItem = useMemo(
    () =>
      !!unsaved ||
      allItems.some((item) => item.author === userName && item.id === id),
    [unsaved, allItems, userName, id]
  );

  //grab accurate image size to center the square-crop of image
  useEffect(() => {
    const getImageStyles = () => {
      const imageElement = document?.getElementById(`${id}-image`);
      if (!imageElement) return;
      const width = imageElement.getBoundingClientRect()?.width ?? 0;
      const height = imageElement.getBoundingClientRect()?.height ?? 0;
      if (width > height) {
        setImageSize({ height: '100%', width: 'auto' });
      } else {
        setImageSize({ height: 'auto', width: '100%' });
      }
      const imageContainer = document?.getElementById(`${id}-image-container`);
      if (!imageContainer) return;
      const containerWidth = imageContainer.getBoundingClientRect()?.width ?? 0;
      const containerHeight =
        imageContainer.getBoundingClientRect()?.height ?? 0;
      const offsetX = (width - containerWidth) / 2;
      const offsetY = (height - containerHeight) / 2;
      setImageTranslate(`translate(${-offsetX}px, ${-offsetY}px)`);
    };

    getImageStyles();
    window.addEventListener('resize', getImageStyles());
    return () => window.removeEventListener('resize', getImageStyles());
  }, [id]);

  const handleEdit = useCallback(() => setEditModeActive(true), []);

  const handleSave = useCallback(
    (e) => {
      console.log('???');
      e.preventDefault();
      if (
        itemTitle.valid &&
        itemPrice.valid &&
        itemDescription.valid &&
        imageUrl.valid
      ) {
        saveItem({
          id,
          timestamp: new Date(),
          title: itemTitle.value,
          description: itemDescription.value,
          image: imageUrl.value,
          price: formatStringToDecimalNumber(itemPrice.value),
        });
        setEditModeActive(false);
      } else {
        itemTitle.forceError();
        itemPrice.forceError();
        itemDescription.forceError();
        imageUrl.forceError();
      }
    },
    [id, imageUrl, itemDescription, itemPrice, itemTitle, saveItem]
  );

  const handleDelete = useCallback(() => {
    //NOTE: `confirm` is a very simple way of doing a fully accessible confirmation dialog
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure? A product cannot be recovered once deleted.')) {
      removeItem(id);
    }
  }, [id, removeItem]);

  return (
    <SingleItemContext.Provider
      value={{
        item,
        loading,
        editModeActive,
        imageStyles,
        itemTitle,
        itemPrice,
        itemDescription,
        imageUrl,
        isUserItem,
        handleEdit,
        handleSave,
        handleDelete,
      }}
    >
      {children}
    </SingleItemContext.Provider>
  );
};

export default SingleItemProvider;
