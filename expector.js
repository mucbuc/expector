#!/usr/bin/env node

var EventEmitter = require( 'events' ).EventEmitter
  , util = require( 'util' );

function Expector(assert) {
  var expectations = []
    , instance = this;

  EventEmitter.call( instance );

  assert = makeAssert(assert);

  instance.__defineGetter__( 'expectations', function() {
    return expectations; 
  });

  instance.check = function() {
    var message = 'met all expectations: ';
    message += util.inspect( expectations ); 
    assert.equal( expectations.length, 0, message );
    assert.end(); 
  }; 

  instance.expectNot = function( event ) {
    if (typeof event !== 'string') {
      event = JSON.stringify( event );
    }
    instance.on( event, function() {
      assert.fail( 'event is expected not to occur: ' + event );
    } );
    return instance;
  };

  instance.repeat = function( counter ) {
    assert.assert( typeof counter === 'number' );
    while(counter--) {
      expectations.push( expectations[ expectations.length - 1 ] );
    }
    return instance;
  };

  instance.expect = function( event, code ) {
    if (typeof event !== 'string') {
      event = JSON.stringify( event );
    }
    if (!expectations.length) {
      instance.once( event, check );
    }
    expectations.push( { event: event, code: code } );
    return instance;

    function check( code ) {
      var expectation = expectations[0];
      expectations.splice( 0, 1 );

      if (expectation.code != undefined) {

        if (code instanceof Array) {
          assert.assert( expectation.code instanceof Array );

          code.forEach( function( element, index) {
            code[index] = element.trim();
            if (index == code.length - 1) {
              var expected = expectation.code.toString()
                , received = code.toString();
              assert.deepEqual( received, expected ); 
            }
          } );
        }
        else if (typeof code === 'string') {
          assert.deepEqual( code.trim(), expectation.code.trim() );
        }
        else {
          assert.deepEqual( JSON.stringify(code), JSON.stringify( expectation.code ) );
        }
      }

      if (expectations.length) {
        instance.once( expectations[0].event, check );
      }
    }
  };
}

util.inherits( Expector, EventEmitter );

function SeqExpector(assert) {
  var instance = this
    , pEmit; 

  assert = makeAssert(assert);

  Expector.call( instance, assert );

  pEmit = this.emit;
  this.emit = function() {
    if (typeof arguments[0] !== 'string') {
      arguments[0] = JSON.stringify( arguments[0] );
    }
    assert.assert( this.expectations.length );
    assert.deepEqual( this.expectations[0].event, arguments[0] );
    pEmit.apply( this, arguments ); 
  };
}

function makeAssert(assert) {
  if (typeof assert === 'undefined') {
    assert = require( 'assert' );
    assert.assert = assert;
    assert.end = function() {};
  } 
  return assert;
}

util.inherits( SeqExpector, Expector );

exports.Expector = Expector;
exports.SeqExpector = SeqExpector;