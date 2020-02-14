const emailregex = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$','i');

export default {
	required: value => !value,
	int: value => !/^\d+$/.test(value),
	url: value => !emailregex.test(value),
	gt: (value, test) => test > value,
	gte: (value, test) => test >= value,
	lt: (value, test) => test < value,
	lte: (value, test) => test <= value,
};