import Filterable from "./Filterable.svelte";
import FilterItem from "./FilterItem.svelte";
import Filters from "./Filters.svelte";
import Option from "./Option.svelte";
import Icon from "./Icon.svelte";
import Text from "./Text.svelte";

Filterable.FilterItem = FilterItem
Filterable.Filters = Filters
Filterable.Option = Option
Filterable.Icon = Icon
Filterable.Text = Text

export {
	Filterable,
	FilterItem,
	Filters,
	Option,
	Icon,
	Text,
}