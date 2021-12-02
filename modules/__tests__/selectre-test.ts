import { createSelector } from "../selectre.js";

describe("state selectors", () => {
  it("should memoize selector per parameters", () => {
    let state = { value: "hello", users: [{ id: "dummyId" }, { id: "anotherId" }] };
    type State = typeof state;

    let paramInput = jest.fn((_, userId: string) => userId);
    let stateInput = jest.fn((state: State) => state.users);
    let selectOutput = jest.fn((userId: string, users: { id: string }[]) =>
      users.find((user) => user.id === userId),
    );

    let selectUserById = createSelector(paramInput, stateInput, selectOutput);

    let selectA = selectUserById("dummyId");
    let selectB = selectUserById("anotherId");
    let selectC = selectUserById("anotherId");

    expect(selectA(state)).toEqual({ id: "dummyId" });
    expect(selectC).toBe(selectB);
    expect(selectC(state)).toBe(selectB(state));

    expect(paramInput).toHaveBeenCalledTimes(3);
    expect(stateInput).toHaveBeenCalledTimes(3);
    expect(selectOutput).toHaveBeenCalledTimes(2);

    expect(selectC(state)).toBe(selectUserById.output(state, "anotherId"));
  });

  it("should stop equality comparison if any of inputs changed", () => {
    let state = { a: 1, b: 2, c: 3 };
    type State = typeof state;
    let isEqual = jest.fn(Object.is);

    let selectData = createSelector(
      (state: State) => state.a,
      (state: State) => state.b,
      (state: State) => state.c,
      (a, b, c) => a + b + c,
      { isInputEqual: isEqual },
    );

    let selector = selectData();
    selector(state);
    expect(isEqual).toHaveBeenCalledTimes(1);
    selector({ ...state, b: 13 });
    expect(isEqual).toHaveBeenCalledTimes(3);
  });
});
