/** @type {import('./test'.RequestHandler)} */
export function get() {
	return {
		body: {
			startCount: Math.ceil(Math.random() * 10)
		}
	};
}
