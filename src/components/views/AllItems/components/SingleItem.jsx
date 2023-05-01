import { useCallback, useMemo, useState } from 'react';
import { colors } from '../../../../constants';
import { formatDollars, formatTimestamp } from '../../../../helpers';
import { useItems } from '../../../../hooks';
import placeholderImage from '../../../../assets/placeholder_image.png';
import Button from '../../../Button';
import PageLoader from '../../../PageLoader';

const SingleItem = ({
  id,
  author,
  timestamp,
  postedAt, //NOTE: items pulled from endpoint have 'postedAt' instead of 'timestamp'
  title,
  description,
  price,
  image,
}) => {
  const { removeItem, saveItem, savingItemIds, userItems } = useItems();
  const [editModeActive, setEditModeActive] = useState(false);

  const isUserItem = useMemo(
    () => userItems.some((item) => item.id === id),
    [id, userItems]
  );

  return (
    <div className='single-item'>
      <div className='title-and-image'>
        <div className='listing-info-row'>
          <p className='title'>{title || 'Untitled product'}</p>
          <p className='price'>{formatDollars(price)}</p>
        </div>
        <div className='image-container'>
          <img
            className={!image ? 'placeholder-image' : ''}
            alt={`${title || 'product image'}`}
            src={image || placeholderImage}
          />
        </div>
      </div>
      <div className='item-details'>
        <p className='description'>{description || ''}</p>
        <div className='listing-info-row submission-info'>
          <p className='author'>{author || '(Account not found)'}</p>
          <p>{formatTimestamp(timestamp ?? postedAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default SingleItem;
