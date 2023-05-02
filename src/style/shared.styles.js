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

const lightBluePage = {
  ...core.column,
  // backgroundColor: addHexOpacity(colors.teal, opacity.light),
};

const sharedStyles = {
  ...core,
  lightBluePage,
};
export default sharedStyles;
