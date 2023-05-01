import { colors } from '../../../../../constants';
import { formatStringToDollars, formatTimestamp } from '../../../../../helpers';
import { useSingleItem } from '../../../../../hooks';
import placeholderImage from '../../../../../assets/placeholder_image.png';
import Input from '../../../../Input';
import ItemActionButtons from './ItemActionButtons';
import PageLoader from '../../../../PageLoader';
import './SingleItem.css';

const SingleItem = () => {
  const {
    loading,
    editModeActive,
    imageStyles,
    itemTitle,
    itemPrice,
    itemDescription,
    imageUrl,
    item: {
      id,
      author,
      timestamp,
      postedAt, //NOTE: items pulled from endpoint have 'postedAt' instead of 'timestamp'
      title,
      description,
      price,
    },
  } = useSingleItem();

  return (
    <div className='single-item'>
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
                style={imageStyles}
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
            <ItemActionButtons />
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
