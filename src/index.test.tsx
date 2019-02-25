import * as React from "react";
import { useGlobalState } from ".";
import { render, fireEvent } from "react-testing-library";
import "jest-dom/extend-expect";

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

describe("Use Global State", () => {
  it("counts properly across components without errors", async () => {
    const { getAllByTestId, getByTestId } = render(
      <div>
        <h1 data-testid="h1">Use Global State</h1>
        <ChildComponent />
        <ChildComponent />
        <ChildComponent />
      </div>
    );

    expect(getByTestId("h1")).toBeInTheDocument();
    expect(getByTestId("h1")).toHaveTextContent("Use Global State");

    function ensureEachCountIs(count: number) {
      const counters = getAllByTestId("count");
      counters.forEach(cnt => expect(cnt).toHaveTextContent(`${count}`));
    }

    let currentCount = 0;

    ensureEachCountIs(currentCount);

    await fireEvent.click(getByTestId("inc"));

    ensureEachCountIs(++currentCount);

    const decButtons = getAllByTestId("dec");
    for (let i = 0; i < decButtons.length; i++) {
      await fireEvent.click(decButtons[i]);
      ensureEachCountIs(--currentCount);
    }

    const incButtons = getAllByTestId("inc");
    for (let i = 0; i < incButtons.length; i++) {
      await fireEvent.click(incButtons[i]);
      ensureEachCountIs(++currentCount);
    }
  });
});
