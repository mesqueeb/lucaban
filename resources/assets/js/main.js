// IMPORT jQuery
	import $ from 'jquery';
	import jQuery from 'jquery';
	// export for others scripts to use
	window.$ = $;
	window.jQuery = jQuery;

// IMPORT Own jQuery replacement functions
	import { hasClass, btnEffect, isElementInViewport } from './components/globalFunctions.js';
	window.btnEffect = btnEffect;
	// Make hasClass(el) available as el.hasClass();
	window.Element.prototype.hasClass = function(config){ return hasClass(this,config)};

// IMPORT linkify
	import * as linkify from 'linkifyjs';;
	import linkifyHtml from 'linkifyjs/html';
	import hashtag from 'linkifyjs/plugins/hashtag'; // optional
	window.linkifyHtml = linkifyHtml;
	window.hashtag = hashtag;
	hashtag(linkify);


// IMPORT Moment
	// having trouble with these:
			// countdown/countdown.js
			// moment/min/moment-with-locales.min.js
			// moment-countdown/dist/moment-countdown.min.js
	// var moment = require('moment');
	// import moment from 'moment';
	// moment().format();
	// import countdown from 'countdown';
	// require('moment-countdown');
	// import moment-countdown from 'moment-countdown';

// IMPORT FlatPickr
	import flatpickr from 'flatpickr';
	
(function(document){ // iife
let openFlatPickr = null;
// Make flatpickr(el) available as el.flatpickr();
window.Element.prototype.flatpickr = function(config){ return flatpickr(this,config)};
window.Element.prototype.flatpickrify = function(config){ return flatpickr(this,{
	dateFormat: 'Y-m-d H:i:S',
	maxDate: 'today',
	enableTime: true,
	time_24hr: true,
	onOpen(dateObj, dateStr, instance){
		if(!vm.$root.beforeEditCache_doneDate){
			vm.$root.beforeEditCache_doneDate = {};
		}
		let elId = instance.element.id;
		let id = elId.replace('done-date-edit-', '');
		console.log('opening for '+id);
		id = id.replace('-popup', '');
		vm.$root.beforeEditCache_doneDate[id] = dateStr;
		openFlatPickr = instance;
	},
	onChange: function(dateObj, dateStr, instance){
		let el = instance.element.id;
		instance.element.focus();
		console.log('flatPicker on change');
	},
	onClose: function(dateObj, dateStr, instance){
		let elId = instance.element.id;
		let id = elId.replace('done-date-edit-', '');
		id = id.replace('-popup', '');
		console.log('vm.$root.beforeEditCache_doneDate[id] = '+vm.$root.beforeEditCache_doneDate[id]);
		// This doesn't even work...
		if (vm.$root.beforeEditCache_doneDate[id] == dateStr){ return; }
		console.log('patching: '+id)
		vm.patch(id, 'done_date');
		delete vm.$root.beforeEditCache_doneDate[id];
		console.log('flatPicker on close');
		openFlatPickr = null;
	},
})};
let documentClick = function documentClick(e) {
	// Luca Patch
	if(e.target.parentNode.nodeName == 'BODY') { 
		console.log('aoe');
		// See Patch inside Flatpickr File!!!
		if(openFlatPickr && openFlatPickr.isOpen){
			openFlatPickr.close();
		}
	}
	// End Luca Patch

};
document.addEventListener("click", documentClick, true);

})(document);// end flatpickr

window.flatpickrifyAllInputs = function(){
	let flatpickrInputs = document.getElementsByClassName("flatpickr");
	for (var i = 0; i < flatpickrInputs.length; i++) {
	    flatpickrInputs[i].flatpickrify();
	}
};



// Vue Basics
	import Vue from 'vue';
	window.Vue = Vue;
	import VueResource from 'vue-resource';
	Vue.use(VueResource);
	var VueAutosize = require('vue-autosize');
	Vue.use(VueAutosize);

	import VueFilters from './vue-components/vueFilters.js';
	VueFilters(Vue);
	// Vue Components
	import VueListMaster from './vue-components/VueListMaster.js'
	// window.vm = VueListMaster;
	// window.vm = new Vue(VueListMaster);
	// import VueListMaster from '/vue-components/VueListMaster.js'
	window.vm = new Vue(VueListMaster);

// JS Classes
	import Tree from './vue-components/dataTree.js';
	import Selection from './vue-components/Selection.js';
	import NotificationStoreClass from './vue-components/NotificationStore.js';


window.onscroll = function() {
	if(!selection.filter.length && !selection.tags.length){ return; }
	let el = document.getElementsByClassName('line');
	// let el = $('.navigation');
	if (!isElementInViewport(el[0])) {
    	$("body").addClass("scrolled-down");
	} else {
    	$("body").removeClass("scrolled-down");
	}
};

// set row height each time resize window
window.setRowHeight = function(){
	console.log('resized edit windows');
	$('textarea[name=item_body]').each(function( index ) {
		let x = $( this ).parent().parent().find('.bodybox').height();
		$( this ).height(x);
	});	
}

$(window).on('resize', function(e) {
	clearTimeout(window.resizeTimer);
	window.resizeTimer = setTimeout(function() {
		setRowHeight();
	}, 1000);
});
$( document ).ready(function() {
   setTimeout(function() {
		setRowHeight();
	}, 2000);
});
$('body').on('click', 'button', function(e){
	console.log(e);
	btnEffect(e);
});

$.getJSON('/api/items',function(fetchedData){

	//response
	window.selection = new Selection();
	window.allItems = new Tree(fetchedData);

	// $.getJSON('/api/itemtags',function(tags){
	// 	console.log(tags);
	// 	window.allTags = tags;
	// 	vm.allTags = tags;
	// });
	// Codementor: How do I make the following function wait until DOM/Vue/etc. is loaded?
	setTimeout(function(){
		flatpickrifyAllInputs();
	}, 1000);

	vm.patching = false;
	vm.loading = false;
}); // end ajax - get data