import * as React from "react";
import { render, screen } from "@testing-library/react";
import { createStore } from "redux";
import { Provider, useSelector } from "react-redux";
import { createSelector } from "../selectre.js";
import "@testing-library/jest-dom";

describe("redux integration", () => {
  let initialState = { value: "hello", users: [{ id: "dummyId" }, { id: "anotherId" }] };
  type State = typeof initialState;
  let store = createStore((state: State = initialState, action: any) => {
    return action.type === "UPDATE" ? (action.state as State) : state;
  });

  let selectValue = createSelector(
    (state: State) => state,
    (state) => state.value,
  );

  let selectValueOutputOnly = createSelector((state: State) => state.value);

  let selectValueOutputOnlyWithParam = createSelector(
    (state: State, prefix: string) => prefix + state.value,
  );

  let selectUser = createSelector(
    (_, userId: string) => userId,
    (state: State) => state.users,
    (userId, users) => users.find((user) => user.id === userId)!,
    { capacity: 1 },
  );

  function App({ userId }: { userId: string }) {
    let value1 = useSelector(selectValue());
    let value2 = useSelector(selectValueOutputOnly());
    let value3 = useSelector(selectValueOutputOnlyWithParam(">"));
    let data = useSelector(selectUser(userId));
    return (
      <>
        <span data-testid="outputValue1">{value1}</span>
        <span data-testid="outputValue2">{value2}</span>
        <span data-testid="outputValue3">{value3}</span>
        <span data-testid="outputId">{data.id}</span>
      </>
    );
  }

  it("should render stuff", () => {
    render(
      <Provider store={store}>
        <App userId="dummyId" />
      </Provider>,
    );
    expect(screen.getByTestId("outputValue1")).toHaveTextContent("hello");
    expect(screen.getByTestId("outputValue2")).toHaveTextContent("hello");
    expect(screen.getByTestId("outputValue3")).toHaveTextContent(">hello");
    expect(screen.getByTestId("outputId")).toHaveTextContent("dummyId");
  });

  it("should update stuff", () => {
    store.dispatch({
      type: "UPDATE",
      state: { value: "changed", users: [{ id: "dummyId" }, { id: "anotherId" }] },
    });

    render(
      <Provider store={store}>
        <App userId="dummyId" />
      </Provider>,
    );
    expect(screen.getByTestId("outputValue1")).toHaveTextContent("changed");
    expect(screen.getByTestId("outputValue2")).toHaveTextContent("changed");
    expect(screen.getByTestId("outputValue3")).toHaveTextContent(">changed");
    expect(screen.getByTestId("outputId")).toHaveTextContent("dummyId");
  });

  it("should invalidate cache", () => {
    render(
      <Provider store={store}>
        <App userId="anotherId" />
      </Provider>,
    );
    expect(screen.getByTestId("outputValue1")).toHaveTextContent("changed");
    expect(screen.getByTestId("outputValue2")).toHaveTextContent("changed");
    expect(screen.getByTestId("outputValue3")).toHaveTextContent(">changed");
    expect(screen.getByTestId("outputId")).toHaveTextContent("anotherId");
  });
});
