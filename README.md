# react-attention

> This package powers [RONIN](https://ronin.co) – check it out if you'd like to see it in action!

Web apps tend to be made up of several different UI pieces that could potentially claim the user's attention, such as confirmation prompts, dialogs, alerts, or similar.

Oftentimes, apps choose to let people interact with multiple of such components in different places in the UI, which means that multiple "flows" of interaction can be started at the same time.

To avoid confusion resulting from that and to ensure there's always only one UI component claiming attention, you can add this tiny package.

## Setup

First, install the package:

```bash
npm install react-attention --save
```

Next, add a context provider at the root of your app:

```tsx
import { AttentionProvider } from 'react-attention';

const Layout = ({ children }) => (
    <AttentionProvider>{children}</AttentionProvider>
);

export default Layout;
```

Lastly, make use of the hook inside your components:

```tsx
import { useAttention } from 'react-attention';

const Overlay = ({ children }) => {
    const [visible, setVisible] = useState(true);

    useAttention(visible, () => setVisible(false));

    return <div className={visible ? undefined : 'hidden'} />
};
```

## Additional Options

If you would like the current component to be reset when the user clicks outside of it, `react-attention` can handle that automatically for you. 

Just pass a third argument containing a reference to the element:

```tsx
const element = useRef(null);

useAttention(visible, () => setVisible(false), element);
```

## Author

Created by [Leo Lamprecht (@leo)](https://leo.im)
