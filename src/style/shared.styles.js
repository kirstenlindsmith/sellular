import { colors, opacity } from '../constants';
import { addHexOpacity } from '../helpers';

const sharedStyles = {
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default sharedStyles;

export const pageContainerStyles = {
  ...sharedStyles.column,
  backgroundColor: addHexOpacity(colors.teal, opacity.light),
};
