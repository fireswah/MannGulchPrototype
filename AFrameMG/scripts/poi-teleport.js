AFRAME.registerComponent('poi-teleport', {
	schema: {
		on: { type: 'string', default: 'click' },
		target: { type: 'string', default: '' },
		locations: { type: 'array', default: [
			'-281 -357 -1461',//River-MG
			'536 -92 310' //Jump Spot
		] },
		index: { type: 'int', default: 1 }//Scene start loc is index 0 loc.
	},

	init: function () {
		var data = this.data;
		var el = this.el;

		el.addEventListener( data.on, function( evt ) {

			console.log( 'teleport to next poi' );
            var target = document.querySelector( data.target );
			
            if( data.index === 0 ) {
                console.log( data.index );
				target.setAttribute( 'position', data.locations[ 0 ] );
				//target.setAttribute( 'animation', { 'property': 'position', 'to': { x: -281, y: -357, z: -1461 }, 'dur': 500 } );
				data.index = data.index + 1;
            } else if ( data.index === 1 ) {
                console.log( data.index );
				target.setAttribute( 'position', data.locations[ 1 ] );
				//target.setAttribute( 'animation', { 'property': 'position', 'to': { x: 536, y: -92, z: 310 }, 'dur': 500 } );
				data.index = 0;
            };
        });
    },
	
    update: function () {},

	remove: function () {},

	play: function () {},

	pause: function () {},

    tick: function (t, dt) {},
});
