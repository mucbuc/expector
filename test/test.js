#!/usr/bin/env node

var e = require( '../expector' )
  , test = require( 'tape' );
  
test( 'smoke test', function(t) {
	var expector = new e.Expector(t); 
	expector.expect( 'hello' ); 
	expector.emit( 'hello' ); 
	expector.check();
});

test( 'assert test', function(t) {
	var expector = new e.Expector(); 
	expector.expect( 'hello' ); 
	expector.emit( 'hello' ); 
	expector.check();
	t.pass();
	t.end();
});

// test( 'test example', function(t) {
// 	var a = new e.SeqExpector();
// 	a.expect( 'first' );
// 	a.expect( 'second' );
// 	a.emit( 'second' ); // => fails, expecting first
// });