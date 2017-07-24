import { Utilities, uniq } from '../../helpers/globalFunctions.js'
import setDefaultItemValues from '../setDefaultItemValues.js'

let tempId = function(){
	return 'tempItem_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
let initialState = function(){
	return setDefaultItemValues({
		body: '',
		preparedTags: [],
        newItem: true,
        temp: true,
        id: tempId()
	});
}
export default {
	namespaced: true,
	state: initialState(),
	mutations:
	{
		resetStateData(state)
		{
			let newState = initialState();
			state = Object.assign(state, newState);
		},
		updateState(state, payload) // { id, field, value } or other
		{
			let key = payload.field;
			let val = payload.value;
			if (!key && !val)
			{
				key = Object.keys(payload).filter(k => k != 'id')[0];
				val = payload[key];
			}
			if (payload.id)
			{
				state.nodes[payload.id][key] = val;
		        return;
			}
		    state[key] = val;
		},
		deleteTag (state, { tag })
		{
			state.preparedTags = state.preparedTags.filter(t => t != tag);
		},
	},
	actions:
	{
		someAction ({ state, rootState, getters, rootGetters, dispatch, commit },
			{id} = {})
		{
			getters.someOtherGetter // -> 'foo/someOtherGetter'
			rootGetters.someOtherGetter // -> 'someOtherGetter'

	        dispatch('someOtherAction') // -> 'foo/someOtherAction'
	        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

	        commit('someMutation') // -> 'foo/someMutation'
	        commit('someMutation', null, { root: true }) // -> 'someMutation'
		},
	},
	getters:
	{
		someGetter: (state, getters, rootState, rootGetters) =>
		(id) => {
			getters.someOtherGetter // -> 'foo/someOtherGetter'
			rootGetters.someOtherGetter // -> 'someOtherGetter'
		},
		parent_id: (state, getters, rootState, rootGetters) => {
			if (!rootState.addingNewUnder || rootState.addingNewUnder == rootState.root.id)
			{
				return rootState.root.id;
			}
			if (rootState.addingNewAsChild || rootState.addingNewAsFirstChild)
			{
				return rootState.addingNewUnder;
				
			}
			if (!rootState.nodes[rootState.addingNewUnder]){ return null; }
			return rootState.nodes[rootState.addingNewUnder].parent_id;
		},
		preparedPlusComputedTags: (state, getters, rootState, rootGetters) => {
			let alltags = state.preparedTags;
			let parentTags = [];
			if (itemGetters[getters.parent_id])
			{
				parentTags = itemGetters[getters.parent_id].tagsArray;
			}
			alltags = alltags.concat(parentTags);
			alltags = alltags.concat(rootState.selection.tags.map(tag => Utilities.tagSlugToName(tag)));
			// if (this.get.isTopLvlItemInFilteredRoot(this.state.addingNewUnder))
			// {
			// 	if (this.state.nodes[this.item.parent_id])
			// 	{
			// 		let tagzies = this.get.tagsArray(this.item.parent_id);
			// 		alltags = alltags.concat(tagzies);
			// 	}
			// }
			alltags = uniq(alltags);
			return alltags.sort();
		},
	},
}