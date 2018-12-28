export function formatNumber(x) {
	var x_string = x.toString()
	var x_length = x_string.length;
	var n = "";
	for (let i = 1; i <= x_length; i++) {
		n = x_string[(x_length - i)] + n;
		if (i % 3 === 0 && i < x_length) {
			n = "." + n;
		}
	}
	return n;
}