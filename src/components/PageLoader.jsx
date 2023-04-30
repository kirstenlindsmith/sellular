import { colors } from '../constants';
import blink from '../assets/blink.gif';
import { pageContainerStyles } from '../style/shared.styles';

const blinkStyles = {
  width: '10rem',
};

const loaderTextStyles = {
  margin: 0,
  marginLeft: '1rem',
  color: colors.blue,
};

const PageLoader = ({ text }) => (
  <div className='centered-page' style={pageContainerStyles}>
    <img src={blink} alt='blinking eye' style={blinkStyles} />
    <h1 style={loaderTextStyles}>{text || 'Loading...'}</h1>
  </div>
);

export default PageLoader;
