#!/usr/bin/env node

var assert = require( 'assert' )
  , EventEmitter = require( 'events' ).EventEmitter
  , util = require( 'util' );

function Expector() {
  var expectations = []
    , instance = this;

  EventEmitter.call( instance );

  instance.__defineGetter__( 'expectations', function() {
    return expectations; 
  });

  instance.check = function() {
    if (expectations.length) {
      console.log( 'expected events did not occur: ', expectations );
    }
    assert.equal( expectations.length, 0 );
  }; 

  instance.expectNot = function( event ) {
    event = JSON.stringify( event );
    instance.on( event, function() {
      console.log( 'event is expected not to occur: ', event );
      assert( false );
    } );
    return instance;
  };

  instance.repeat = function( counter ) {
    assert( typeof counter === 'number' );
    while(counter--) {
      expectations.push( expectations[ expectations.length - 1 ] );
    }
    return instance;
  };

  instance.expect = function( event, code ) {
    event = JSON.stringify( event );
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
          assert( expectation.code instanceof Array );

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

function SeqExpector() {
  var instance = this
    , pEmit; 

  Expector.call( instance );

  pEmit = this.emit;
  this.emit = function() {
    assert( this.expectations.length );
    assert.deepEqual( this.expectations[0].event, arguments[0] );
    pEmit.apply( this, arguments ); 
  };
}

util.inherits( SeqExpector, Expector );

exports.Expector = Expector;
exports.SeqExpector = SeqExpector;