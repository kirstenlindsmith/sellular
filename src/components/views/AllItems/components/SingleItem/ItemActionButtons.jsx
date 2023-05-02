import { colors } from '../../../../../constants';
import { useSingleItem } from '../../../../../hooks';
import DeleteIcon from '../../../../../assets/DeleteIcon';
import EditIcon from '../../../../../assets/EditIcon';
import SaveIcon from '../../../../../assets/SaveIcon';
import Button from '../../../../shared/Button';

const ItemActionButtons = () => {
  const { editModeActive, handleEdit, handleDelete, handleSave, isUserItem } =
    useSingleItem();

  return (
    <>
      {isUserItem && !editModeActive && (
        <Button
          fullWidth
          className='edit-button'
          color={colors.white}
          textColor={colors.teal}
          onClick={handleEdit}
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
    </>
  );
};

export default ItemActionButtons;
