$(document).ready(function(){

	buildList();
	$('div#version').text('v0.2.1');
	
});

var store = window.localStorage;

//load from storage
function loadList () {
	var myList = store.myList;
	if(myList) {
		updateItemArray();
	}
}

//save that shit, son
function saveList () {
  var myList = $('ul#items').html();
	store.setItem('myList', myList);
}

function checkItem () {
	//check off item
	var items = $('ul#items');
	items.click(function(event) {
		var target = $(event.target);
		if (target.is('li')){
			target.addClass('checked');
		}
		saveList();
	});
}

function addUncheck() {
	//add uncheck button
	var itemList = $('ul#items li');
	var text = $('<span></span>').text('\u00D7').addClass('close');
	itemList.append(text);
}

function uncheckHover () {
	//uncheck hover
	$('ul#items li').hover(function(){
		$(this).children().toggleClass('close-shadow');
	});
}

function uncheckClick () {
	//uncheck
	$('.close').click(function(event) {
		var target = $(event.target);
	  if (target.is('span')){
		target.parent().removeClass('checked');
	  }
	  saveList();
	});
}

function sideNav () {
	//navigation
	$('a.sidenav').click(function(){
		var thisSub = $(this).nextUntil('a.sidenav');
	  $(this).toggleClass('navopen');
	  $('a.sidenav').not(this).removeClass('navopen');
		$('.side').not(thisSub).slideUp(300);
		$(this).nextUntil('a.sidenav').slideToggle(300);
	  var thisID = $(this).attr('id');
		$('li').not('.' + thisID).hide();
	  $('li.' + thisID).show();
	  stripes();
	});
}

function filterNav () {
	//filter
	$('div.side a').click(function(){
		var id1 = $(this).parent().attr('id');
	  var id2 = $(this).attr('id');
	  if (id2 === "all") {
		$('li.'+id1).show();
		$('li').not('.'+id1).hide();
	  } else {
		$('li.'+id1+'.'+id2).show();
		$('li').not('.'+id1+'.'+id2).hide();
		}
	  stripes();
	});
}

function autoSelect () {
	//auto-select searchbar text
	$('input#filter').click(function(){
		$(this).select();
	});
}

//search filter
function keySearch(){
	var input = $('input#filter');
	input.keyup(function(){
		var filter = input.val().toUpperCase();
		var filtered = $('ul#items li').filter(function() {
			var reg = new RegExp(filter, 'ig');
		return reg.test($(this).text())
		});
	  $('li').not(filtered).hide();
	  filtered.show();
	  stripes();
	});
}

function stripes () {
	$('ul#items li:visible').removeClass('stripe');
	$('ul#items li:visible:odd').addClass('stripe');
}

function addComponents () {
	//add component alert
	var compList = $('ul#items li[compOf]');
	//var compSpan = $('<span></span>').text('\u26A0').addClass('component');
	//compList.append(compSpan);
	$.each(compList, function(){
		var toolText = $(this).attr('compOf').replace(/, /g,'<br>');
		$(this).append('<span class="component">\u26A0<span class="compTip">' + toolText + '</span></span>');
	})
}

function compareStore () {
	var storeList = store.myList;
	var siteList = $('ul#items').html();
	var maxList = Math.max(storeList.length, siteList.length);
	for (i = 0; i < maxList; i++) {
		console.log(storeList[i].html());
		console.log(siteList[i].html());
	}
}

function updateItemArray () {
	//gets entire item list from source (probably not needed after changes to loading)
	var itemA = [];
	$('ul#items li').each(function(){
		itemA.push($(this).contents().not($('li').children()).text());
	});
	//gets checked item list from local storage
	var sList = store.getItem('myList');
	var listA = [];
	$(sList).filter('.checked').each(function() {
		listA.push($(this).text().replace('\u00D7',''));
	});
	//loops through checked item list to toggle class for items in source
	for (i = 0; i < listA.length; i++) {
		var itemI = listA[i];
		$('ul#items li:contains("' + itemI + '")').addClass('checked');
	}
}

function cleanStorage () {
	var str = store.getItem('myList');
	console.log(str);
	str = str.replace(' style=""', '').replace('<span class="close">\u00D7</span><span class="close">\u00D7</span>', '<span class="close">\u00D7</span>');
	console.log(str);
	store.setItem('myList', str);
}

function buildList () {
	var d = new Date();
	var n = '' + d.getHours() + d.getMinutes();
	$.getJSON('items.json?nocache=' + n, function(data) {
		$.each(data['itemList'], function(key, data){
			var compOf= '';
			if (data['compOf']) {
				var compAr = (data['compOf'])
				$.each(compAr, function(i, l){
					compOf += ', ' + l;
				})
				compOf = ' compOf="' + compOf.slice(2) + '"';
			} else {
				compOf = '';
			}
			$('ul#items').append('<li class="' + data['class'] + '"' + compOf + '>' + data['name'] + '</li>');
		})
	}).done(fixCSS);
}

function fixCSS () {
	loadList();
	stripes();
	addUncheck();
	addComponents();
	uncheckClick();
	uncheckHover();
	checkItem();
	keySearch();
	autoSelect();
	sideNav();
	filterNav();
}