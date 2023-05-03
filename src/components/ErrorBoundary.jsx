import { Component } from 'react';

//NOTE: my only remaining usecase for class components is the componentDidCatch method lol
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
      errorMessage: `${error?.msesage || 'Error'}: ${
        info?.componentStack ?? error?.stack ?? '(details unknown)'
      }`,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <p>{this.state.errorMessage || 'Something went wrong :('}</p>
        </div>
      );
    } else return this.props.children;
  }
}

export default ErrorBoundary;
