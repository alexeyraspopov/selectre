let memo = {};

export function applier(arity) {
	return (
		memo[arity] ||
		(memo[arity] = new Function("f", "t", "p", `let i=0; return f(t${", p[i++]".repeat(arity)});`))
	);
}
