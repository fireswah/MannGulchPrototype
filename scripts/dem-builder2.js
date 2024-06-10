/*
*Ground builder from elevation data in .csv added to a AFrame/Three subdivided plane
*Right now reads from .csv output from zarr
*Goal is to read zarr directly to set up plane and add elevation.
*/

AFRAME.registerComponent('dem-builder2', {

	schema: {
		demRes: { type: 'int', default: 2 },
        texture: { type: 'selector' }
    },

	init: function () {
		var el = this.el;
		var data = this.data;
        console.log( data.texture );
        var demres = data.demRes;
        var ground = document.createElement( 'a-plane' );
        var sheet = document.querySelector('#demsheet');
        var terraincoords = sheet.data;
        var rows = [];
        var rowArray = [];
        this.demPoints = [];
        var zCoord = 0.0;
        rows = terraincoords.split(/\n/);
        console.log( rows.length);
        var nz = rows.length;//depth in AFrame - row.length //397
        rowArray = rows[ 1 ].split(",");
        var nx = rowArray.length// rowArray.length;//width in AFrame //437
        
        ground.setAttribute( 'id', 'planeground' );
        ground.setAttribute( 'width', demres * nx );
        ground.setAttribute( 'height', demres * nz );
        ground.setAttribute( 'segments-width', nx - 1 );// -2
        ground.setAttribute( 'segments-height', nz - 2 );// -2
        ground.setAttribute( 'rotation', '-90 90 0' );
        ground.setAttribute( 'position', '0 -2000 0' );
        ground.setAttribute( 'material', 'src', data.texture );
        ground.setAttribute( 'material', 'roughness', 1.0 );
        ground.setAttribute( 'material', 'npot', true );
        ground.setAttribute( 'material', 'offset', { x: 0.02, y: 0 } );
        //ground.setAttribute( 'class', 'navmesh' );  //Way to big and gridlocks fps

        el.appendChild( ground );

        //Get grid elevation values from zarr csv
        for ( var depth = 0; depth < rows.length - 1; depth++ ) {
            rowArray = rows[ depth ].split(",");
            rowArray.reverse();//zarr order fix since I'm still totally confused :>
            for( var width = 0; width < rowArray.length; width++ ) {
                zCoord = rowArray[ width ];
                this.demPoints.push( zCoord );
            }
        };

        obj = document.querySelector( '#planeground' );

        //After loading, update plane with elevations to geometry.attribute.position
        obj.addEventListener( 'loaded', () => {
            var objmap = obj.getObject3D( 'mesh' );
            //console.log( objmap );
            buffIndex = objmap.geometry.index;
            //console.log( buffIndex.array );
            buffPos = objmap.geometry.getAttribute( 'position' );
            for( var point = 0; point < this.demPoints.length; point ++ ) {
                buffPos.setZ(  point, this.demPoints[ point ] );
            }
            objmap.geometry.computeBoundingBox();
            buffPos.needsUpdate = true;
            el.setAttribute( 'position', {
                x: ( 0 ),
                y: ( 540 ),
                z: ( 0 )
              });
        });
	},

	update: function () {},

	remove: function () {},

	play: function () {},

	pause: function () {},

    tick: function (t, dt) {},

});