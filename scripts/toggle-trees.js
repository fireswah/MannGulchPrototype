AFRAME.registerComponent('toggle-trees', {
	schema: {
		on: { type: 'string', default: 'click' },
		target: { type: 'string', default: '' }
	},

	init: function () {
		var data = this.data;
		var el = this.el;

		el.addEventListener( data.on, function( evt ) {

			console.log( 'toggle trees' );
            var target = document.querySelector( data.target );
            if( target.getAttribute( 'visible' ) === true ) {
                target.setAttribute( 'visible', false );
            } else if ( target.getAttribute( 'visible' ) === false ) {
                target.setAttribute( 'visible', true );
            };
        });
    },
	
    update: function () {},

	remove: function () {},

	play: function () {},

	pause: function () {},

    tick: function (t, dt) {},
});
