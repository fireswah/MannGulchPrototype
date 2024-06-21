/*
*Tree builder from xyz coords in .csv
*This is setup to use the Blender Zarr scripts to output an elevation
*corrected treelist.
*/

AFRAME.registerComponent('tree-builder', {
	schema: {
    color: {type: 'vec3', default: {x: 1.0, y: 1.0, z: 1.0} },
    innerHeight: { type: 'number', default: 500.0 },//don't modify, used internally.
    innerWidth: { type: 'number', default: 500.0 },//don't modify, used internally.
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
    var treeHeights = [];
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
      treeHeights.push( rowArray[ 3 ] );
    };

    var treepoints = new THREE.BufferGeometry();
    treepoints.setAttribute('position', new THREE.Float32BufferAttribute( treeLocs, 3 ) );
    treepoints.setAttribute( 'size', new THREE.Float32BufferAttribute( treeHeights, 1 ) );
    treepoints.computeBoundingBox();

    /*
    SETUP GLSL Material
    */
    var textureLoader = new THREE.TextureLoader();

    uniforms = {
			"color": { value: data.color },
			"texture1": { value: textureLoader.load( './images/pondo1Image1920x1080.png', ( texture ) => {
                texture.flipY = false; } ) },
            "screenheight": { value: data.innerHeight },
            "screenwidth": { value: data.innerWidth }
		};

    this.custom_material = new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: `

				attribute float size;
        uniform float screenheight;
        uniform float screenwidth;
        uniform vec4 origin;

        void main()
        {
            //vec4 mvPosition = modelViewMatrix * vec4( position.x, position.y + size / 2.0, position.z, 1.0 );
            vec4 mvPosition = modelViewMatrix * vec4( position.x, position.y + size / 3.0, position.z, 1.0 );
            float camDist = distance( mvPosition, origin );
            float aspectRatio = screenwidth / screenheight;
            
            gl_PointSize = size * screenheight / ( camDist * aspectRatio ); 
            gl_Position = projectionMatrix * mvPosition;
        }
        `
		  ,
			fragmentShader: `

		    uniform vec3 color;
				uniform sampler2D texture1;

		    void main( void ) {

					//Set color
					gl_FragColor = vec4(color, 1.0);
					gl_FragColor = gl_FragColor * texture2D( texture1, gl_PointCoord );
		    }
		    `
				,
				//Adds the transparency value to the Three.js material so the dot looks
				//like a dot and not the square texture it is.
				transparent: true,
        depthTest: true,
        depthWrite: false

		});
    
    
    
    
    //var treePointDisplay = new THREE.Points( treepoints, treePointMaterial );
    var treePointDisplay = new THREE.Points( treepoints, this.custom_material );

    el.setObject3D( 'mesh', treePointDisplay );

    el.setAttribute( 'visible', 'false' );
    
    el.setAttribute( 'position', {
      x: ( 0 ),
      y: ( 0 ),
      z: ( 0 )
    });
    
    el.setAttribute( 'rotation', '0 0 0' );

    //Handle window resizing by updating data
    window.addEventListener('resize', () => {
      data.innerHeight = window.innerHeight;
      data.innerWidth = window.innerWidth;
    });

	},

	update: function () {},

	remove: function () {},

	play: function () {},

	pause: function () {},

  tick: function (t, dt) {
    //Use the tick function to constantly check for new window sizing in data.
    var data = this.data;
    this.custom_material.uniforms.screenheight.value = data.innerHeight;
    this.custom_material.uniforms.screenwidth.value = data.innerWidth;
  },

});
