export default {
	required: value => !value,
	int: value => !/^\d+$/.test(value)
};