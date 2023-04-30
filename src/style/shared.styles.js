import { colors, opacity } from '../constants';
import { addHexOpacity } from '../helpers';

const core = {
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

const pageContainer = {
  ...core.column,
  backgroundColor: addHexOpacity(colors.teal, opacity.light),
};

const sharedStyles = {
  ...core,
  pageContainer,
};
export default sharedStyles;
