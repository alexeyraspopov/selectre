import * as React from "react";
import { render, screen } from "@testing-library/react";
import { createStore } from "redux";
import { Provider, useSelector } from "react-redux";
import { createSelector } from "../selectre.js";
import "@testing-library/jest-dom";

type State = { value: string; users: Array<{ id: string }> };

describe("simple state selector", () => {
	let initialState = { value: "hello", users: [{ id: "dummyId" }, { id: "anotherId" }] };
	let store = createStore((state: State = initialState, action: any) => {
		return action.type === "UPDATE" ? (action.state as State) : state;
	});

	let selectValue = createSelector(
		(state: State) => state,
		(state) => state.value,
	);

	let selectUser = createSelector(
		(_, userId: string) => userId,
		(state: State) => state.users,
		(userId, users) => users.find((user) => user.id === userId)!,
		{ capacity: 1 },
	);

	function App({ userId }: { userId: string }) {
		let value = useSelector(selectValue());
		let data = useSelector(selectUser(userId));
		return (
			<>
				<span data-testid="outputValue">{value}</span>
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
		expect(screen.getByTestId("outputValue")).toHaveTextContent("hello");
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
		expect(screen.getByTestId("outputValue")).toHaveTextContent("changed");
		expect(screen.getByTestId("outputId")).toHaveTextContent("dummyId");
	});

	it("should invalidate cache", () => {
		render(
			<Provider store={store}>
				<App userId="anotherId" />
			</Provider>,
		);
		expect(screen.getByTestId("outputValue")).toHaveTextContent("changed");
		expect(screen.getByTestId("outputId")).toHaveTextContent("anotherId");
	});
});
