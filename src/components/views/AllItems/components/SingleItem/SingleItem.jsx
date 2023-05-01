import { useCallback, useEffect, useMemo, useState } from 'react';
import { colors } from '../../../../../constants';
import {
  formatNumberToToDecimalString,
  formatStringToDecimalNumber,
  formatStringToDollars,
  formatTimestamp,
  validateDollarField,
  validateStringLength,
} from '../../../../../helpers';
import { useItems, useTextInputState, useUser } from '../../../../../hooks';
import placeholderImage from '../../../../../assets/placeholder_image.png';
import DeleteIcon from '../../../../../assets/DeleteIcon';
import EditIcon from '../../../../../assets/EditIcon';
import SaveIcon from '../../../../../assets/SaveIcon';
import Button from '../../../../Button';
import Input from '../../../../Input';
import PageLoader from '../../../../PageLoader';

const SingleItem = ({
  id,
  author,
  timestamp,
  postedAt, //NOTE: items pulled from endpoint have 'postedAt' instead of 'timestamp'
  title,
  description,
  price,
  image,
  unsaved, //temporary flag, only exists on new user items
}) => {
  const { userName } = useUser();
  const { removeItem, saveItem, loadingItemIds, allItems } = useItems();
  const loading = useMemo(
    () => loadingItemIds.includes(id),
    [id, loadingItemIds]
  );

  const [editModeActive, setEditModeActive] = useState(!!unsaved);
  const [translateImage, setTranslateImage] = useState(undefined);
  const [itemHeight, setItemHeight] = useState('100%');
  const [itemWidth, setItemWidth] = useState('auto');
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

  //center the square-cropped product image
  useEffect(() => {
    const imageElement = document?.getElementById(`${id}-image`);
    const imageContainer = document?.getElementById(`${id}-image-container`);
    const width = imageElement?.getBoundingClientRect().width ?? 0;
    const height = imageElement?.getBoundingClientRect().height ?? 0;
    if (width > height) {
      setItemHeight('100%');
      setItemWidth('auto');
    } else {
      setItemWidth('100%');
      setItemHeight('auto');
    }
    const containerWidth = imageContainer?.getBoundingClientRect().width ?? 0;
    const containerHeight = imageContainer?.getBoundingClientRect().height ?? 0;
    const offsetX = (width - containerWidth) / 2;
    const offsetY = (height - containerHeight) / 2;
    setTranslateImage(`${-offsetX}px, ${-offsetY}px`);
  }, [id, editModeActive]);

  const enableEditMode = useCallback(() => setEditModeActive(true), []);

  const handleSave = useCallback(() => {
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
  }, [id, imageUrl, itemDescription, itemPrice, itemTitle, saveItem]);

  const handleDelete = useCallback(() => {
    //NOTE: `confirm` is a very simple way of doing a fully accessible confirmation dialog
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure? A product cannot be recovered once deleted.')) {
      removeItem(id);
    }
  }, [id, removeItem]);

  return (
    <div className={`single-item ${editModeActive ? 'item-form' : ''}`}>
      {loading ? (
        <PageLoader style={{ backgroundColor: colors.white }} />
      ) : (
        <>
          <div className='item-details'>
            <div
              className={`listing-info-row ${
                editModeActive ? 'edit-mode' : ''
              }`}
            >
              <div className='row'>
                {editModeActive ? (
                  <Input
                    name='Product name'
                    label='Product name'
                    placeholder='Untitled product'
                    fieldHandler={itemTitle}
                  />
                ) : (
                  <p className='title'>{title || 'Untitled product'}</p>
                )}
              </div>
              {editModeActive ? (
                <div className='row center price-input'>
                  <Input
                    name='price'
                    label='Price'
                    placeholder='0.00'
                    fieldHandler={itemPrice}
                    startIcon={<p>$</p>}
                  />
                </div>
              ) : (
                <p className='price'>{formatStringToDollars(price)}</p>
              )}
            </div>
            <div id={`${id}-image-container`} className='image-container'>
              {editModeActive && (
                <div className='image-input'>
                  <Input
                    name='image'
                    label='Image URL'
                    placeholder='http://link-to-image.com/image.jpg'
                    fieldHandler={imageUrl}
                  />
                  <div className='input-bg' />
                </div>
              )}
              <img
                id={`${id}-image`}
                className={`item-image ${
                  !imageUrl.value ? 'placeholder-image' : ''
                } ${editModeActive ? 'blur' : ''}`}
                alt={`${title || 'product image'}`}
                src={imageUrl.value || placeholderImage}
                style={{
                  width: itemWidth,
                  height: itemHeight,
                  transform: `translate(${translateImage})`,
                }}
              />
            </div>
            {editModeActive ? (
              <div className='description edit-mode'>
                <Input
                  fullWidth
                  multiline
                  rows='5'
                  name='description'
                  label='Product description'
                  placeholder='About this product'
                  fieldHandler={itemDescription}
                />
              </div>
            ) : (
              <p className='description'>{description || ''}</p>
            )}
          </div>
          <div className='item-footer'>
            {isUserItem && !editModeActive && (
              <Button
                fullWidth
                className='edit-button'
                color={colors.white}
                textColor={colors.teal}
                onClick={enableEditMode}
              >
                <EditIcon size='1rem' color={colors.teal} />
                Edit
              </Button>
            )}
            {editModeActive && (
              <div className='save-delete-buttons'>
                <Button fullWidth onClick={handleSave} className='save-button'>
                  <SaveIcon size='1rem' color={colors.white} />
                  Save
                </Button>
                <Button fullWidth onClick={handleDelete} color={colors.red}>
                  <DeleteIcon size='1rem' color={colors.white} />
                  Delete
                </Button>
              </div>
            )}
            <div className='listing-info-row submission-info'>
              <p className='author'>{author || '(Account not found)'}</p>
              <p>{formatTimestamp(timestamp ?? postedAt)}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SingleItem;
