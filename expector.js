#!/usr/bin/env node

var EventEmitter = require( 'events' ).EventEmitter
  , util = require( 'util' );

function Expector(tape) {
  var expectations = []
    , instance = this;

  EventEmitter.call( instance );

  instance.__defineGetter__( 'expectations', function() {
    return expectations; 
  });

  instance.check = function() {
    var message = 'met all expectations: ';
    message += util.inspect( expectations ); 
    tape.equal( expectations.length, 0, message );
    tape.end();
  }; 

  instance.expectNot = function( event ) {
    if (typeof event !== 'string') {
      event = JSON.stringify( event );
    }
    instance.on( event, function() {
      tape.fail( 'event is expected not to occur: ' + event );
    } );
    return instance;
  };

  instance.repeat = function( counter ) {
    tape.assert( typeof counter === 'number' );
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
          tape.assert( expectation.code instanceof Array );

          code.forEach( function( element, index) {
            code[index] = element.trim();
            if (index == code.length - 1) {
              var expected = expectation.code.toString()
                , received = code.toString();
              tape.deepEqual( received, expected );
            }
          } );
        }
        else if (typeof code === 'string') {
          tape.deepEqual( code.trim(), expectation.code.trim() );
        }
        else {
          tape.deepEqual( JSON.stringify(code), JSON.stringify( expectation.code ) );
        }
      }

      if (expectations.length) {
        instance.once( expectations[0].event, check );
      }
    }
  };
}

util.inherits( Expector, EventEmitter );

function SeqExpector(tape) {
  var instance = this
    , pEmit; 

  Expector.call( instance, tape );

  pEmit = this.emit;
  this.emit = function() {
    if (typeof arguments[0] !== 'string') {
      arguments[0] = JSON.stringify( arguments[0] );
    }
    tape.assert( this.expectations.length );
    tape.deepEqual( this.expectations[0].event, arguments[0] );
    pEmit.apply( this, arguments ); 
  };
}

util.inherits( SeqExpector, Expector );

exports.Expector = Expector;
exports.SeqExpector = SeqExpector;