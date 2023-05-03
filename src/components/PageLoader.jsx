import blink from '../assets/blink.gif';

const PageLoader = ({ text, style }) => (
  <div className='centered-page column' style={style}>
    <img src={blink} alt='blinking eye' className='blinking-eye-loader' />
    <h1 className='ellipsis-loader-container blinking-eye-loader-text'>
      <span className='ellipsis-loader-text'>{text || 'Loading'}</span>
      <span aria-hidden='true' className='ellipsis-width-placeholder'>
        {text || 'Loading...'}
      </span>
    </h1>
  </div>
);

export default PageLoader;
