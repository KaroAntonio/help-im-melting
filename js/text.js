// overlay words on top of what there ur seeing there buddy

function draw_text() {

var idx = 0;

wrds = [
	'oi vey',
	'im',
	'melting.',
	'halp',
	'im',
	'very',
	'melting.',
	'this is',
	'a message',
	'from a person',
	'who is',
	'currently melting.',
	'this is',
	'not sexy',
	'please',
	'give me',
	'strength',
	'you could',
	'ignore me',
	'...',
	'id',
	'hate that',
	':(',
	'PAY NOW',
	'$$$',
	'to stop',
	'melting :)',	
	'ONE TIME',
	'OFFER!!!',
	'50% OFF',
	'u have',
	'the power',
	'<a href="http://www.worldlandtrust.org/">BUY NOW</a>',
]

console.log('draw text')

var overlay = $('<div>');
console.log('new');
overlay.addClass('noselect');

overlay.text('oy vey');

overlay.appendTo('body');

overlay.css({
	position:'fixed',
	zIndex: 1000,
	fontSize:110,
	color: 'red',
	width: window.innerWidth,
	height: window.innerHeight,
	paddingLeft: window.innerWidth/2-200,
	paddingTop: window.innerHeight/2-100,
	userSelect: 'none',
	'-webkit-user-select': 'none',
	
});

overlay.click(function() {
	idx = (idx + 1) % wrds.length;
	overlay.html(wrds[idx]);
	document.getSelection().removeAllRanges();
});
}

