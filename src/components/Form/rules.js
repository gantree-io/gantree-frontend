const urlregex = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$','i');
const emailregex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const ssh_key = new RegExp("^-----BEGIN RSA PRIVATE KEY-----[^]*-----END RSA PRIVATE KEY-----\r?\n?$", 'i');

export default {
	required: value => !value,
	int: value => !/^\d+$/.test(value),
	url: value => !urlregex.test(value),
	email: value => !emailregex.test(value),
	gt: (value, test) => test > value,
	gte: (value, test) => test >= value,
	lt: (value, test) => test < value,
	lte: (value, test) => test <= value,
	ssh_key: value => !ssh_key.test(value),
	length: (value, length) => value.toString().length !== length
};