# react-scrolled-in [![Build Status](https://travis-ci.org/ajoslin/react-scrolled-in.svg?branch=master)](https://travis-ci.org/ajoslin/react-scrolled-in)

> Detect if an element is scrolled into view. Window or container scrolling. Just a render prop.

It just calls a `render` prop with a `visible` boolean, nothing more.

```jsx
import ScrolledIn from 'react-scrolled-in'

ReactDOM.render(
  <SrolledIn
    scrollElement={node => node.parentNode.parentNode}
    render={({ visible }) => <p>{visible ? 'In View!' : 'Out of view'}</p>}
  />,
  document.body
)
```

More documentation coming soon...

## License

MIT © [Andrew Joslin](http://ajoslin.com)
