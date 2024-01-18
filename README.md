# react-attention

...

## Setup

First, install the package:

```bash
npm install react-attention --save
```

Next, add the context provider in the root layout of your app:

```javascript
import { AttentionProvider } from 'react-attention';

const Layout = ({ children }) => (
    <AttentionProvider>{children}</AttentionProvider>
);

export default Layout;
```

Lastly, make use of the hook inside your components:

```javascript
import { useState } from 'react';
import { useAttention } from 'react-attention';

const Overlay = ({ children }) => {
    const [visible, setVisible] = useState(true);

    useAttention(visible, () => setVisible(false));

    return (
        <div className={visible ? undefined : 'hidden'}>
            I am an overlay
        </div>
    );
};
```

## Additional Options

...

## Author

Created by [Leo Lamprecht (@leo)](https://leo.im)