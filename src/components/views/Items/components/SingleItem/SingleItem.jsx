import { useEffect, useState } from 'react';
import { frontendRoutes } from '../../../../../constants';
import {
  formatStringToDollars,
  makeLinkFromName,
} from '../../../../../helpers';
import {
  useListImageStyles,
  useOverflowWatcher,
  useSingleItem,
} from '../../../../../hooks';
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
    itemTitle,
    itemPrice,
    itemDescription,
    imageUrl,
    item: { id, author, title, price },
  } = useSingleItem();
  const imageStyles = useListImageStyles();
  const { componentRef: priceRef, overflows: priceOverflows } =
    useOverflowWatcher(price);

  const [priceTitle, setPriceTitle] = useState(
    priceOverflows ? formatStringToDollars(price) : undefined
  );

  //show price on hover if truncated
  useEffect(() => {
    const handleResize = () => {
      setPriceTitle(priceOverflows ? formatStringToDollars(price) : undefined);
    };
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [price, priceOverflows]);

  return (
    <Card className='single-item'>
      {loading ? (
        <PageLoader style={{ height: '100%' }} />
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
                  <Link
                    className='title'
                    title={`Click to view ${title}`}
                    href={`${frontendRoutes.item}/${id}`}
                    aria-label={`Click to view ${title || 'Untitled product'}`}
                  >
                    {title || 'Untitled product'}
                  </Link>
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
                <p className='price' ref={priceRef} title={priceTitle}>
                  {formatStringToDollars(price)}
                </p>
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
                alt={`${title || 'untitled product'}`}
                src={imageUrl.value || placeholderImage}
                style={imageStyles}
              />
            </div>
            {editModeActive ? (
              <div className='description edit-mode'>
                <Input
                  fullWidth
                  multiline
                  rows='3'
                  name='description'
                  label='Product description'
                  placeholder='About this product'
                  fieldHandler={itemDescription}
                />
              </div>
            ) : null}
          </div>
          <div className='item-footer'>
            <ItemActionButtons />
            <div className='listing-info-row submission-info'>
              {!!author ? (
                <p className='author'>
                  <span style={{ fontWeight: 500 }}>Listed by:</span>{' '}
                  <Link
                    href={`${frontendRoutes.userItems}/${makeLinkFromName(
                      author
                    )}`}
                  >
                    {author || '(Account not found)'}
                  </Link>
                </p>
              ) : (
                <p className='author'>(Account not found)</p>
              )}
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default SingleItem;
