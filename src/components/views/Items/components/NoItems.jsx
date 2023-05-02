import { useMemo } from 'react';
import PlusIcon from '../../../../assets/PlusIcon';
import { colors } from '../../../../constants';
import { useItems } from '../../../../hooks';
import Button from '../../../shared/Button';

const NoItems = ({ myItems, userItems }) => {
  const { addItem } = useItems();

  const copy = useMemo(() => {
    if (myItems) return 'You have no products listed yet.';
    if (userItems) return 'This user has no products.';
    else return 'There are no products listed yet.';
  }, [myItems, userItems]);

  return (
    <div className='column center' style={{ margin: 'auto' }}>
      <p>{copy}</p>
      {!userItems && (
        <Button onClick={addItem} style={{ marginTop: '1rem' }}>
          <PlusIcon color={colors.white} />
          Add one
        </Button>
      )}
    </div>
  );
};

export default NoItems;
