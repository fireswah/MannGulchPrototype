AFRAME.registerComponent('nav-toggle', {
	schema: {
		on: { type: 'string', default: 'click' },
        target: { type: 'string', default: '' },
        state: { type: 'string', default: 'walk' }
	},

	init: function () {
		var data = this.data;
		var el = this.el;
        

		el.addEventListener( data.on, function( evt ) {

            var cameraRig = document.querySelector( data.target );

            if( data.state === 'walk' ) {
                cameraRig.removeAttribute( 'simple-navmesh-constraint' );
                cameraRig.setAttribute( 'wasd-controls', 'acceleration', '600' );
                cameraRig.setAttribute( 'wasd-controls', 'fly', 'true' );
                data.state = 'free';
                console.log( cameraRig );
            }else if( data.state === 'free' ) {
                cameraRig.setAttribute( 'simple-navmesh-constraint', 'navmesh', '.navmesh' );
                cameraRig.setAttribute( 'simple-navmesh-constraint', 'fall', '0.5' );
                cameraRig.setAttribute( 'simple-navmesh-constraint', 'height', '0' );
                cameraRig.setAttribute( 'wasd-controls', 'acceleration', '50' );
                cameraRig.setAttribute( 'wasd-controls', 'fly', 'false' );
                data.state = 'walk';
                console.log( cameraRig );
            }

        });
    },
	
    update: function () {},

	remove: function () {},

	play: function () {},

	pause: function () {},

    tick: function (t, dt) {},
});