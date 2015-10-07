expector
========

node, test, emitter

Expector example

var e = new require('expector').Expector();
e.expect( 'a' );
e.expect( 'b' );
e.emit( 'b' );
e.check(); // => fails, missing 'a' event


SeqExpector

var e = new require('expector').SeqExpector();
e.expect( 'first' );
e.expect( 'second' );
e.emit( 'second' ); // => fails, expecting first

Custom asserter

var e = new SeqExpector(DIY.assert);
e.check(); // => fails, no expectations