import { useEffect, useMemo, useState } from 'react';
import { breakpoints, colors } from '../../../constants';
import { useSingleItem } from '../../../hooks';
import placeholderImage from '../../../assets/placeholder_image.png';
import Card from '../../shared/Card';
import DeleteIcon from '../../../assets/DeleteIcon';
import EditIcon from '../../../assets/EditIcon';
import SaveIcon from '../../../assets/SaveIcon';
import Button from '../../shared/Button';
import './ItemDetail.css';
import { formatStringToDollars, formatTimestamp } from '../../../helpers';
import Input from '../../shared/Input';
import PageLoader from '../../PageLoader';

const ItemDetail = () => {
  const {
    loading,
    isUserItem,
    editModeActive,
    itemTitle,
    itemPrice,
    itemDescription,
    imageUrl,
    handleEdit,
    handleSave,
    handleDelete,
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
  const [wideImage, setWideImage] = useState(false);

  const itemNotFound = useMemo(() => !id, [id]);
  const showEditButton = useMemo(
    () => !itemNotFound && isUserItem && !editModeActive,
    [editModeActive, isUserItem, itemNotFound]
  );
  const showSaveDeleteButtons = useMemo(
    () => !itemNotFound && isUserItem && editModeActive,
    [editModeActive, isUserItem, itemNotFound]
  );
  const detailImageStyles = useMemo(
    () =>
      wideImage
        ? { width: 'auto', maxHeight: '35vh' }
        : { maxWidth: '35vw', height: 'auto' },
    [wideImage]
  );

  useEffect(() => {
    const getImageStyles = () => {
      const image = document?.getElementById(`${id}-image`);
      const { height, width } = image?.getBoundingClientRect() ?? {
        height: 0,
        width: 0,
      };
      const widerThanTall = width > height;

      if (widerThanTall) {
        setWideImage(true);
      } else {
        setWideImage(false);
      }
    };
    getImageStyles();
  }, [id]);

  return loading ? (
    <PageLoader />
  ) : (
    <div className='product-detail standard-page'>
      <main className={`header-row ${editModeActive ? 'edit-mode' : ''}`}>
        <h1>
          {editModeActive ? (
            <Input
              name='Product name'
              label='Product name'
              placeholder='Untitled product'
              fieldHandler={itemTitle}
            />
          ) : (
            <>
              {itemNotFound ? 'Product not found' : title || 'Untitled product'}
            </>
          )}
        </h1>
        {showEditButton && (
          <Button
            onClick={handleEdit}
            className={editModeActive ? 'edit-mode' : ''}
          >
            <EditIcon size='1rem' color={colors.white} />
            Edit
          </Button>
        )}
        {showSaveDeleteButtons && (
          <div className='save-delete-buttons'>
            <Button onClick={handleSave}>
              <SaveIcon size='1rem' color={colors.white} />
              Save
            </Button>
            <Button onClick={handleDelete} color={colors.red}>
              <DeleteIcon size='1rem' color={colors.white} />
              Delete
            </Button>
          </div>
        )}
      </main>
      <div className={`row page-content ${wideImage ? 'wide-image' : ''}`}>
        <Card
          fullWidth={wideImage}
          className={`description-card ${editModeActive ? 'edit-mode' : ''}`}
          fullWidthAtBreakpoint={breakpoints.mobile}
        >
          {editModeActive ? (
            <Input
              name='price'
              label='Price'
              placeholder='0.00'
              fieldHandler={itemPrice}
              startIcon={<p>$</p>}
            />
          ) : (
            <p className='field'>
              <span className='field-name'>Price: </span>
              {formatStringToDollars(price)}
            </p>
          )}
          <p className='field'>
            <span className='field-name'>Listed by: </span>
            {author || '(Account not found)'} at{' '}
            {formatTimestamp(timestamp ?? postedAt)}
          </p>
          {editModeActive ? (
            <div className='field edit-mode'>
              <Input
                fullWidth
                multiline
                rows='5'
                name='description'
                label='Product details'
                placeholder='About this product'
                fieldHandler={itemDescription}
              />
            </div>
          ) : (
            <p className='field'>
              <span className='field-name'>Product details: </span>
              {description}
            </p>
          )}
          {editModeActive && (
            <div className='field edit-mode'>
              <Input
                name='image'
                label='Image URL'
                placeholder='http://link-to-image.com/image.jpg'
                fieldHandler={imageUrl}
              />
            </div>
          )}
        </Card>
        <Card fullWidth={wideImage} fullWidthAtBreakpoint={breakpoints.mobile}>
          <div
            className={`product-image-container ${
              wideImage ? 'wide-image' : ''
            }`}
          >
            <img
              id={`${id}-image`}
              alt={`${title || 'product image'}`}
              src={imageUrl.value || placeholderImage}
              style={detailImageStyles}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ItemDetail;
