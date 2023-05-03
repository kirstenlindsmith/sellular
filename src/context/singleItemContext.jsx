import { createContext, useCallback, useMemo, useState } from 'react';
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
  } = item ?? new Item();
  const { userName } = useUser();
  const { removeItem, saveItem, loadingItemIds, allItems } = useItems();

  const [editModeActive, setEditModeActive] = useState(!!unsaved);
  const itemTitle = useTextInputState({
    required: true,
    initialValue: title,
    validation: validateStringLength(25, 2),
  });
  const itemPrice = useTextInputState({
    required: true,
    initialValue: formatNumberToToDecimalString(price),
    validation: validateDollarField,
  });
  const itemDescription = useTextInputState({
    required: true,
    initialValue: description,
    validation: validateStringLength(100, 3),
  });
  const imageUrl = useTextInputState({
    initialValue: image,
  });

  const loading = useMemo(
    () => loadingItemIds.includes(id),
    [id, loadingItemIds]
  );

  const isUserItem = useMemo(
    () =>
      !!unsaved ||
      allItems.some((item) => item.author === userName && item.id === id),
    [unsaved, allItems, userName, id]
  );

  const handleEdit = useCallback(() => setEditModeActive(true), []);

  const handleSave = useCallback(
    (e) => {
      e?.preventDefault();
      if (
        itemTitle.valid &&
        itemPrice.valid &&
        itemDescription.valid &&
        imageUrl.valid
      ) {
        if (
          itemTitle.changed ||
          itemPrice.changed ||
          itemDescription.changed ||
          imageUrl.changed
        ) {
          saveItem({
            id,
            timestamp: new Date(),
            title: itemTitle.value,
            description: itemDescription.value,
            image: imageUrl.value,
            price: formatStringToDecimalNumber(itemPrice.value),
          });
        }
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

  const handleDelete = useCallback(
    (fromDetailPage = false) => {
      //NOTE: `confirm` is a very simple way of doing an accessible confirmation dialog
      if (
        // eslint-disable-next-line no-restricted-globals
        confirm('Are you sure? A product cannot be recovered once deleted.')
      ) {
        removeItem(id, fromDetailPage);
      }
    },
    [id, removeItem]
  );

  return (
    <SingleItemContext.Provider
      value={{
        item,
        loading,
        editModeActive,
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
