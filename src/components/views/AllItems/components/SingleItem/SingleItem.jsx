import { useEffect, useState } from 'react';
import { colors } from '../../../../../constants';
import {
  formatStringToDollars,
  formatTimestamp,
  handleTooltips,
} from '../../../../../helpers';
import { useOverflowWatcher, useSingleItem } from '../../../../../hooks';
import placeholderImage from '../../../../../assets/placeholder_image.png';
import Card from '../../../../shared/Card';
import Input from '../../../../shared/Input';
import ItemActionButtons from './ItemActionButtons';
import Link from '../../../../shared/Link';
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
    handleViewItem,
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
  const { componentRef: priceRef, overflows: priceOverflows } =
    useOverflowWatcher(price);
  const { componentRef: titleRef, overflows: titleOverflows } =
    useOverflowWatcher(title);

  const [titleTooltipData, setTitleTooltipData] = useState(() =>
    titleOverflows ? title : undefined
  );
  const [priceTooltipData, setPriceTooltipData] = useState(
    formatStringToDollars(price)
  );

  useEffect(() => {
    const handleResize = () => {
      setPriceTooltipData(
        priceOverflows ? formatStringToDollars(price) : undefined
      );
      setTitleTooltipData(titleOverflows ? title : undefined);
    };
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [price, priceOverflows, title, titleOverflows]);

  useEffect(() => {
    handleTooltips();
  }, [priceTooltipData]);

  return (
    <Card className='single-item'>
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
              <>
                {editModeActive ? (
                  <Input
                    name='Product name'
                    label='Product name'
                    placeholder='Untitled product'
                    fieldHandler={itemTitle}
                  />
                ) : (
                  <div
                    className='title-container'
                    data-tooltip={titleTooltipData}
                  >
                    <Link
                      ref={titleRef}
                      className='title'
                      onClick={handleViewItem}
                      aria-label={`Click to view ${
                        title || 'Untitled product'
                      }`}
                    >
                      {title || 'Untitled product'}
                    </Link>
                  </div>
                )}
              </>
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
                <div
                  className='price-container'
                  data-tooltip={priceTooltipData}
                >
                  <p className='price' ref={priceRef}>
                    {formatStringToDollars(price)}
                  </p>
                </div>
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
    </Card>
  );
};

export default SingleItem;
