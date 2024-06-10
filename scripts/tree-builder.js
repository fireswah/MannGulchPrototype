/*
*Tree builder from xyz coords in .csv
*This is setup to use the Blender Zarr scripts to output an elevation
*corrected treelist.
*/

AFRAME.registerComponent('tree-builder', {

	schema: {

  },

	init: function () {
		var el = this.el;
		var data = this.data;
    var scene = this.el.scene;

    var sheet = document.querySelector( '#treesheet' );
    var terraincoords = sheet.data;
    var rows = [];
    rows = terraincoords.split(/\n/);

    var treeLocs = [];
    var minX = 0;
    var maxX = 0;
    var minZ = 0;
    var maxZ = 0;
    var minY = 0;
    var maxY = 0;
    var rangeX = 0;
    var rangeZ = 0;
    var rangeY = 0;
    var moveX = 0;
		
    //Initial set of X and Z min/max
    for ( var i = 1; i < 2; i++ ) {
      rowArray = rows[ i ].split( "," );
      //console.log( rowArray );
      minX = rowArray[ 8 ];
      maxX = rowArray[ 8 ];
      minZ = rowArray[ 7 ];
      maxZ = rowArray[ 7 ];
      minY = rowArray[ 9 ];
      maxY = rowArray[ 9 ];
    };

    //Find Min/Max of dem data for range mapping.
    for ( var row = 1; row < rows.length; row++ ) {
      rowArray = rows[ row ].split(",");
      var lineMinX = Math.min( rowArray[ 8 ] );
      var lineMaxX = Math.max( rowArray[ 8 ] );
      var lineMinZ = Math.min( rowArray[ 7 ] );
      var lineMaxZ = Math.max( rowArray[ 7 ] );
      var lineMinY = Math.min( rowArray[ 9 ] );
      var lineMaxY = Math.max( rowArray[ 9 ] );
      if( lineMaxX > maxX) {
        maxX = lineMaxX;
      }
      if( lineMinX < minX ) {
        minX = lineMinX;
      }
      if( lineMaxZ > maxZ ) {
        maxZ = lineMaxZ;
      }
      if( lineMinZ < minZ ) {
        minZ = lineMinZ;
      }
      if( lineMinY < minY ) {
        minY = lineMinY;
      }
      if( lineMaxY < maxY ) {
        maxY = lineMaxY;
      }
    };
    
    rangeX = maxX - minX;
    rangeZ = maxZ - minZ;
    rangeY = maxY - minY;
    console.log( "mX: " + minX, "MX: " + maxX, "mZ: " + minZ, "MZ: " + maxZ, "mY: " + minY, "MY: " + maxY );
    console.log( "rX: " + rangeX, "rZ: " + rangeZ, "rY: " + rangeY );
    
    /*TREELIST CSV COLUMNS
    ,SPCD,DIA_cm,HT_m,STATUSCD,CBH_m,CROWN_RADIUS_m,X_m,Y_m,Z_m,basal_tree_ft^2
    //Skip the first row as headers in the following loop.
    //May need to adjust x,y,z index for position due to variance between programs
    //rows.length -1 because .csv contains a blank last row.
    */
    for (var i = 1; i < rows.length - 1; i++) {
			rowArray = rows[i].split(",");
      //NOTE for future: outMin + ( float( num - inMin ) / float(inMax - inMin ) * ( outMax - outMin ) )
      treeLocs.push( rowArray[ 8 ] );//z
      treeLocs.push( rowArray[ 9 ] );//y is up in THREE but z is up in Blender
      treeLocs.push( rowArray[ 7 ] );//x
    };

    var treepoints = new THREE.BufferGeometry();
    treepoints.setAttribute('position', new THREE.Float32BufferAttribute( treeLocs, 3 ) );
    treepoints.computeBoundingBox();
    var treePointMaterial = new THREE.PointsMaterial( { color: '#00FF00', size: 5, sizeAttenuation: true } );
    var treePointDisplay = new THREE.Points( treepoints, treePointMaterial );

    el.setObject3D( 'mesh', treePointDisplay );

    el.setAttribute( 'visible', 'false' );
    
    el.setAttribute( 'position', {
      x: ( 0 ),
      y: ( 0 ),
      z: ( 0 )
    });
    
    el.setAttribute( 'rotation', '0 0 0' );

	},

	update: function () {},

	remove: function () {},

	play: function () {},

	pause: function () {},

  tick: function (t, dt) {},


});
