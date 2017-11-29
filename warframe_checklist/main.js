/*global $, window, document*/

var store = window.localStorage;

//save that shit, son
function saveList() {
	"use strict";
	var myList = $('ul#weapon-items').html();
	store.setItem('myList', myList);
}

function stripes() {
	"use strict";
	$('ul#weapon-items li:visible, ul#frame-items li:visible').removeClass('stripe');
	$('ul#weapon-items li:visible:odd, ul#weapon-items li:visible:odd').addClass('stripe');
}

function checkItem() {
	//check off item
	"use strict";
	$('ul#weapon-items li').click(function (event) {
		var target = $(event.target);
		if (target.is('li')) {
			target.addClass('checked');
		}
		saveList();
	});
}

function addUncheck() {
	//add uncheck button
	"use strict";
	var text = $('<span></span>').text('\u00D7').addClass('close');
	$('ul#weapon-items li').append(text);
}

function uncheckHover() {
	//uncheck hover
	"use strict";
	$('ul#weapon-items li').hover(function () {
		$(this).children().toggleClass('close-shadow');
	});
}

function uncheckClick() {
	//uncheck
	"use strict";
	$('.close').click(function (event) {
		var target = $(event.target);
		if (target.is('span')) {
			target.parent().removeClass('checked');
		}
		saveList();
	});
}

function autoSelect() {
	//auto-select searchbar text
	"use strict";
	$('input#filter').click(function () {
		$(this).select();
	});
}

function keySearch() {
	//search filter
	"use strict";
	var input = $('input.filter');
	var inputID = input.attr('id').replace('filter', 'items');
	input.keyup(function () {
		var filter = input.val().toUpperCase();
		var filtered = $('ul#' + inputID + ' li').filter(function () {
			var reg = new RegExp(filter, 'ig');
			return reg.test($(this).text());
		});
		$('ul#' + inputID + ' li').not(filtered).hide();
		filtered.show();
		stripes();
	});
}

function topNav() {
	//main nav bar
	"use strict";
	$('#navList li').click(function () {
		$('#navList li').removeClass('topNav-active');
		$(this).addClass('topNav-active');
		var targetDiv = $(this).children('a').attr('id').replace('link', 'content');
		$('#main div.content').addClass('hidden');
		$('div#' + targetDiv).toggleClass('hidden');
	});
	stripes();
}

function subNav() {
	//submenu filter buttons
	"use strict";
	$('.submenu li:not(:has(>input))').click(function () {
		$('input').val('');
		var thisSub = $(this).children('a').attr('id');
		$('.submenu li').removeClass('subNav-active');
		$(this).addClass('subNav-active');
		var thisListID = $(this).parents('div').attr('id').replace('submenu', 'items');
		if (thisSub === 'all') {
			$('#' + thisListID + ' li').show();
		} else {
			$('#' + thisListID + ' li').not('.' + thisSub).hide();
			$('#' + thisListID + ' li.' + thisSub).show();
		}
		stripes();
	});
	$('input').click(function () {
		$('.submenu li').removeClass('subNav-active');
		$(this).parent().addClass('subNav-active');
	});
}

function addComponents() {
	//add component alert
	"use strict";
	var compList = $('ul#weapon-items li[compOf]');
	//var compSpan = $('<span></span>').text('\u26A0').addClass('component');
	//compList.append(compSpan);
	$.each(compList, function () {
		var toolAttr = $(this).attr('compOf');
		var toolText = toolAttr.replace(/, /g, '<br>');
		var toolLeng = (toolAttr.length - toolAttr.replace(/,/g, '').length + 9312).toString(16);
		var toolCirc = String.fromCodePoint(parseInt(toolLeng, 16));
		$(this).append('<span class="component">' + toolCirc + '<span class="compTip">' + toolText + '</span></span>');
	});
}

function updateItemArray() {
	//gets checked item list (name only) from local storage
	"use strict";
	var sList = store.getItem('myList');
	var listA = [];
	$(sList).filter('.checked').each(function () {
		var thisItem = $(this).contents().filter(function () {
			return this.nodeType === 3;
		}).text();
		listA.push(thisItem);
	});
	//loops through checked item list, matches elements, checks them off
	$.each(listA, function (i, v) {
		$('ul#weapon-items li').filter(function () {
			return $(this).text() === v;
		}).addClass('checked');
	});
}

function loadList() {
	//load from storage
	"use strict";
	var myList = store.myList;
	if (myList) {
		updateItemArray();
	}
}

function buildPrimes() {
	$('ul#frame-items li.hasPrime').each(function () {
		var frameName = $(this).text();
		$(this).after($(this).clone().text(frameName + ' Prime').addClass('isPrime'));
	});
}

function fixCSS() {
	"use strict";
	loadList();
	stripes();
	addUncheck();
	addComponents();
	uncheckClick();
	uncheckHover();
	checkItem();
	keySearch();
	autoSelect();
	subNav();
	topNav();
	buildPrimes();
	$('a#weapon-link').parentsUntil('div').trigger('click');
}

function buildList(listName) {
	"use strict";
	var d = new Date().getHours.toString() + new Date().getMinutes().toString();
	var itemList = listName + 'List';
	$.getJSON(listName + '-items.json?nocache=' + d, function (data) {
		$.each(data[itemList], function (key, data) {
			var compOfStr = '';
			if (data.compOf) {
				var compAr = (data.compOf);
				$.each(compAr, function (i, l) {
					compOfStr += ', ' + l;
				});
				compOfStr = ' compOf="' + compOfStr.slice(2) + '"';
			}

			$('ul#' + listName + '-items').append('<li class="' + data['class'] + '"' + compOfStr + '>' + data.name + '</li>');
		});
	}).done(fixCSS);
}

$(document).ready(function () {
	"use strict";
	buildList('weapon');
	buildList('frame');
	$('div#version').text('v0.2.1');
	topNav();
});
