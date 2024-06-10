AFRAME.registerComponent('pic-toggle', {
	schema: {
		on: { type: 'string', default: 'click' },
        targets: { type: 'selectorAll', default: null }
	},

	init: function () {
		var data = this.data;
		var el = this.el;
        var scene = document.querySelector( 'a-scene' ); 

		el.addEventListener( data.on, function( evt ) {

            //var targets = scene.querySelectorAll( .360pic );
            //console.log( data.targets );

            for ( var p = 0; p < data.targets.length; p++ ) {
                var psphere = data.targets[ p ];
                if( psphere.getAttribute( 'visible' ) === true ) {
                    psphere.setAttribute( 'visible', false );
                } else if ( psphere.getAttribute( 'visible' ) === false ) {
                    psphere.setAttribute( 'visible', true );
                };
            }
        });
    },
	
    update: function () {},

	remove: function () {},

	play: function () {},

	pause: function () {},

    tick: function (t, dt) {},
});