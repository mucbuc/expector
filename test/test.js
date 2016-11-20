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

test( 'test emit return', function(t) {
  var expector = new e.Expector(t);
  expector.expect('hello').emit('hello').check();
});

test( 'test example', function(t) {
  var a = new e.SeqExpector();
  a.expect( 'first' );
  a.expect( 'second' );
  try {
    a.emit( 'second' ); // => fails, expecting first
    t.fail();
    t.end();
  }
  catch(err) { 
    t.pass();
    t.end();
  };
});

test( 'test object stability', function(t) {
  var expector = new e.Expector(t);
  expector.expect({ a: 'h', b: 2}).emit({ b: 2, a: 'h'}).check();
});