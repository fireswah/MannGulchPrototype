AFRAME.registerComponent('ground-texture', {
	schema: {
		on: { type: 'string', default: 'click' },
		target: { type: 'string', default: '' },
		textures: { type: 'array', default: [
			'#gesat', //Google Earth Sat
			'#poimap', //Google EArth Sat with markers from Sam
			'#slope' //3DEP DEM slope map 0-59 deg, green color ramp
		] },
		index: { type: 'int', default: 1 }
	},

	init: function () {
		var data = this.data;
		var el = this.el;

		el.addEventListener( data.on, function( evt ) {

			console.log( 'texture change' );

			var target = document.querySelector( data.target );

            if( data.index === 0 ) {
                target.setAttribute( 'material', 'src', data.textures[ 0 ] );
				data.index = data.index + 1;
            } else if ( data.index === 1 ) {
                target.setAttribute( 'material', 'src', data.textures[ 1 ] );
				data.index = data.index + 1;
            } else if ( data.index === 2 ) {
                target.setAttribute( 'material', 'src', data.textures[ 2 ] );
				data.index = 0;
            };;
        });
    },
	
    update: function () {},

	remove: function () {},

	play: function () {},

	pause: function () {},

    tick: function (t, dt) {},
});
