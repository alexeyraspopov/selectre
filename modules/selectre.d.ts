type SelectorOptions<Params extends Array<any>> = {
  capacity?: number;
  isInputEqual?: (a: any, b: any) => boolean;
  isOutputEqual?: (a: any, b: any) => boolean;
  cacheKey?: (...params: Params) => string | number;
};

export function createSelector<Params extends Array<any>, State, Output>(
  output: (state: State, ...params: Params) => Output,
  options?: SelectorOptions<Params>,
): (...params: Params) => (state: State) => Output;

export function createSelector<Params extends Array<any>, State, R1, Output>(
  input1: (state: State, ...params: Params) => R1,
  output: (res1: R1) => Output,
  options?: SelectorOptions<Params>,
): (...params: Params) => (state: State) => Output;

export function createSelector<Params extends Array<any>, State, R1, R2, Output>(
  input1: (state: State, ...params: Params) => R1,
  input2: (state: State, ...params: Params) => R2,
  output: (res1: R1, res2: R2) => Output,
  options?: SelectorOptions<Params>,
): (...params: Params) => (state: State) => Output;

export function createSelector<Params extends Array<any>, State, R1, R2, R3, Output>(
  input1: (state: State, ...params: Params) => R1,
  input2: (state: State, ...params: Params) => R2,
  input3: (state: State, ...params: Params) => R3,
  output: (res1: R1, res2: R2, res3: R3) => Output,
  options?: SelectorOptions<Params>,
): (...params: Params) => (state: State) => Output;

export function createSelector<Params extends Array<any>, State, R1, R2, R3, R4, Output>(
  input1: (state: State, ...params: Params) => R1,
  input2: (state: State, ...params: Params) => R2,
  input3: (state: State, ...params: Params) => R3,
  input4: (state: State, ...params: Params) => R4,
  output: (res1: R1, res2: R2, res3: R3, res4: R4) => Output,
  options?: SelectorOptions<Params>,
): (...params: Params) => (state: State) => Output;

export function createSelector<Params extends Array<any>, State, R1, R2, R3, R4, R5, Output>(
  input1: (state: State, ...params: Params) => R1,
  input2: (state: State, ...params: Params) => R2,
  input3: (state: State, ...params: Params) => R3,
  input4: (state: State, ...params: Params) => R4,
  input5: (state: State, ...params: Params) => R5,
  output: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5) => Output,
  options?: SelectorOptions<Params>,
): (...params: Params) => (state: State) => Output;

export function createSelector<Params extends Array<any>, State, R1, R2, R3, R4, R5, R6, Output>(
  input1: (state: State, ...params: Params) => R1,
  input2: (state: State, ...params: Params) => R2,
  input3: (state: State, ...params: Params) => R3,
  input4: (state: State, ...params: Params) => R4,
  input5: (state: State, ...params: Params) => R5,
  input6: (state: State, ...params: Params) => R6,
  output: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6) => Output,
  options?: SelectorOptions<Params>,
): (...params: Params) => (state: State) => Output;

// prettier-ignore
export function createSelector<Params extends Array<any>, State, R1, R2, R3, R4, R5, R6, R7, Output>(
  input1: (state: State, ...params: Params) => R1,
  input2: (state: State, ...params: Params) => R2,
  input3: (state: State, ...params: Params) => R3,
  input4: (state: State, ...params: Params) => R4,
  input5: (state: State, ...params: Params) => R5,
  input6: (state: State, ...params: Params) => R6,
  input7: (state: State, ...params: Params) => R7,
  output: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6, res7: R7) => Output,
  options?: SelectorOptions<Params>,
): (...params: Params) => (state: State) => Output;

// prettier-ignore
export function createSelector<Params extends Array<any>, State, R1, R2, R3, R4, R5, R6, R7, R8, Output>(
  input1: (state: State, ...params: Params) => R1,
  input2: (state: State, ...params: Params) => R2,
  input3: (state: State, ...params: Params) => R3,
  input4: (state: State, ...params: Params) => R4,
  input5: (state: State, ...params: Params) => R5,
  input6: (state: State, ...params: Params) => R6,
  input7: (state: State, ...params: Params) => R7,
  input8: (state: State, ...params: Params) => R8,
  // prettier-ignore
  output: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6, res7: R7, res8: R8) => Output,
  options?: SelectorOptions<Params>,
): (...params: Params) => (state: State) => Output;

// prettier-ignore
export function createSelector<Params extends Array<any>, State, R1, R2, R3, R4, R5, R6, R7, R8, R9, Output>(
  input1: (state: State, ...params: Params) => R1,
  input2: (state: State, ...params: Params) => R2,
  input3: (state: State, ...params: Params) => R3,
  input4: (state: State, ...params: Params) => R4,
  input5: (state: State, ...params: Params) => R5,
  input6: (state: State, ...params: Params) => R6,
  input7: (state: State, ...params: Params) => R7,
  input8: (state: State, ...params: Params) => R8,
  input9: (state: State, ...params: Params) => R9,
  // prettier-ignore
  output: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6, res7: R7, res8: R8, res9: R9) => Output,
  options?: SelectorOptions<Params>,
): (...params: Params) => (state: State) => Output;

// prettier-ignore
export function createSelector<Params extends Array<any>, State, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, Output>(
  input1: (state: State, ...params: Params) => R1,
  input2: (state: State, ...params: Params) => R2,
  input3: (state: State, ...params: Params) => R3,
  input4: (state: State, ...params: Params) => R4,
  input5: (state: State, ...params: Params) => R5,
  input6: (state: State, ...params: Params) => R6,
  input7: (state: State, ...params: Params) => R7,
  input8: (state: State, ...params: Params) => R8,
  input9: (state: State, ...params: Params) => R9,
  input10: (state: State, ...params: Params) => R10,
  // prettier-ignore
  output: (res1: R1, res2: R2, res3: R3, res4: R4, res5: R5, res6: R6, res7: R7, res8: R8, res9: R9, res10: R10) => Output,
  options?: SelectorOptions<Params>,
): (...params: Params) => (state: State) => Output;
