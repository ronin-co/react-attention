# react-attention

Web apps tend to be made up of several different UI pieces that could potentially claim the user's attention, such as confirmation prompts, dialogs, alerts, or similar.

Oftentimes, apps choose to let people interact with multiple of such components in different places in the UI, which means that multiple "flows" of interaction can be started at the same time.

To avoid confusion resulting from that and to ensure there's always only one UI component claiming attention, you can add this tiny package.

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
