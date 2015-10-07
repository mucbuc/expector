#!/usr/bin/env node

var e = require( '../expector' )
  , test = require( 'tape' );
  
test( 'smoke test', function(t) {
	var expector = new e.Expector(t); 
	expector.expect( 'hello' ); 
	expector.emit( 'hello' ); 
	expector.check();
	t.end();
});

test( 'assert test', function(t) {
	var expector = new e.Expector(); 
	expector.expect( 'hello' ); 
	expector.emit( 'hello' ); 
	expector.check();
	t.pass();
	t.end();
})