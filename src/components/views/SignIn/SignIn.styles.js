import { colors } from '../../../constants';
import shared, { pageContainerStyles } from '../../../style/shared.styles';

const styles = {
  root: pageContainerStyles,
  content: {
    ...shared.column,
    maxWidth: '20rem',
    gap: '1rem',
  },
  header: {
    color: colors.teal,
    fontSize: '1.5rem',
  },
};

export default styles;
