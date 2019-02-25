# `useGlobalState(key, initialValue = "")`

<img src="./demo.gif" alt="Demonstration of shared state setup and tear down across n number of components" align="right" width="241.5" height="215.5" />

A custom React hook for shared state. Typescript ready, isomorphic, and tiny. No dependencies (apart from React, obviously), and fully tested.

## Installation

```bash
npm install --save @baublet/use-global-state
```

## Use

This library is a custom hook, and thus follows all of the same requirements and conditions as [React Hooks](https://reactjs.org/docs/hooks-state.html#hooks-and-function-components).

```tsx
const MyComponent = () => {
  const [count, setCount] = useGlobalState("count", 0);
  return (
    <>
      <button onClick={() => setCount(count - 1)}>-</button>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>+</button>
    </>
  );
};
```

All hooks with the same `key` will share state and update together.

```tsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import { useGlobalState } from "use-global-state";

function App() {
  return (
    <div>
      <h1>Use Global State</h1>
      <ChildComponent />
      <ChildComponent />
      <ChildComponent />
    </div>
  );
}

// Each of these components will share state with one another
const ChildComponent = () => {
  const [count, setCount] = useGlobalState("count", 0);
  return (
    <>
      <hr />
      <button onClick={() => setCount(count - 1)} data-testid="dec">
        -
      </button>
      &nbsp;
      <div data-testid="count">{count}</div>
      &nbsp;
      <button onClick={() => setCount(count + 1)} data-testid="inc">
        +
      </button>
    </>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```
