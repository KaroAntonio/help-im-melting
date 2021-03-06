function run_three_scene(nr,nc,p) {


var sceneWidth = window.innerWidth * nc;
var sceneHeight = window.innerHeight * nr;
var scene = new THREE.Scene();


var webGLRenderer = new THREE.WebGLRenderer( {antialias: true} );
webGLRenderer.setClearColor(new THREE.Color(0xffffff, 1.0));
webGLRenderer.setSize( sceneWidth, sceneHeight );
var domEl = $(webGLRenderer.domElement);

var r = Math.floor(p / nc);
var c = p - (r*nc);	

$('body').append(domEl);
domEl.css({
	width: sceneWidth,
	height: sceneHeight,
	position:'fixed',
	top:-height*r,
	left:-width*c
});


var clock = new THREE.Clock();

//var stats = initStats();


// create a camera, which defines where we're looking at.
var camera = new THREE.PerspectiveCamera(45, sceneWidth / sceneHeight, 0.1, 20000);

var reset_count = 0

// position and point the .to the center of the scene
camera.position.z = 0;
camera.position.x = 50;
//camera.position.y = 10;
camera.lookAt(new THREE.Vector3(0, 0, 0));

var flyControls = new THREE.FlyControls(camera);


flyControls.movementSpeed = 10;
flyControls.domElement = document.querySelector("#WebGL-output");
flyControls.rollSpeed = Math.PI / 6;
flyControls.autoForward = false;
flyControls.dragToLook = true;
flyControls.dragSpeed = 10;

// Lighting
var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 0, -300);
directionalLight.intensity = 400;
scene.add(directionalLight); 

var directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(0, 0, 300);
directionalLight2.intensity = 400;
scene.add(directionalLight2); 


var ambientLight = new THREE.AmbientLight(0x383838);
ambientLight.intensity = 500;
scene.add(ambientLight);

// add spotlight for the shadows
var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(0, 0, -130);
spotLight.intensity = 100;
scene.add(spotLight);

// call the render function
var step = 0;


// setup the control gui
var controls = new function () {
	// we need the first child, since it's a multimaterial

};

//var gui = new dat.GUI();
var mesh;

var cubes_pos = [];
var mirrorSpheres, mirrorSphereCamera; // for mirror material
var mirrorSphereMaterial
var ocean, cubes, mirror,skybox, skybox2;
var geometry, material, ms_Water, water_plane;
var fire,body;

var loader = new THREE.OBJMTLLoader();
var load = function (object) {
	var scale = chroma.scale(['red', 'green', 'blue']);
	setRandomColors(object, scale);
	mesh = object;
	scene.add(mesh);
}


init_water();
init_cubes();
init_skybox();
//init_mirrors();
init_mirror_spheres();
init_fire();
init_body();

function init_fire() {
	VolumetricFire.texturePath = 'assets/fire_textures/';

	var fireWidth  = 2;
	var fireHeight = 4;
	var fireDepth  = 4;
	var sliceSpacing = 0.1;

	fire = new VolumetricFire(
	  fireWidth,
	  fireHeight,
	  fireDepth,
	  sliceSpacing,
	  camera
	);
	scene.add( fire.mesh );
	// you can set position, rotation and scale
	// fire.mesh accepts THREE.mesh features
	fire.mesh.position.set( 0, -1, 0 );
}

function init_mirror_spheres() {
	mirrorSpheres = []

	mirrorSphereCamera = new THREE.CubeCamera( 0.1, 5000, 512 );

	var n_spheres = 0 //4

	mirrorSphereMaterial = new THREE.MeshBasicMaterial( { envMap: mirrorSphereCamera.renderTarget } );

	for (i=0;i < n_spheres; i++) {
		var sphereGeom =  new THREE.SphereGeometry( Math.pow(10,i+1), 32, 16 ); // radius, segmentsWidth, segmentsHeight
		var sphereMesh =  new THREE.Mesh( sphereGeom, mirrorSphereMaterial );
		sphereMesh.position.set(0,0,0);
		scene.add(sphereMesh)
		mirrorSpheres.push( sphereMesh );

		mirrorSphereCamera.position = sphereMesh.position;
	}
	// mirrorCubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
	scene.add( mirrorSphereCamera );
}

function init_mirrors() {
	mirror = new THREE.Mirror( webGLRenderer, camera, { clipBias: 0.003, textureWidth: 1024, textureHeight: 1024, color:0x889999 } );

	var verticalMirrorMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 300, 300 ), mirror.material );
	verticalMirrorMesh.add( mirror );
	verticalMirrorMesh.position.y = 0;
	verticalMirrorMesh.position.z = 0;
	scene.add( verticalMirrorMesh );
	/*
	mirror = new THREE.Mirror( 100, 100, {
		//clipBias: 0.003,
		textureWidth: window.innerWidth * window.devicePixelRatio,
		textureHeight: window.innerHeight * window.devicePixelRatio,
		color: 0x889999
	} );
	mirror.rotation.x = Math.PI;
	scene.add( mirror );
	*/

}
function init_water() {
	// Load textures
	var waterNormals = new THREE.ImageUtils.loadTexture('assets/waternormals.jpg');
	waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

	// Create the water effect
	ms_Water = new THREE.Water(webGLRenderer, camera, scene, {
		textureWidth: 512,
		textureHeight: 512,
		waterNormals: waterNormals,
		alpha:  1.,
		sunDirection: directionalLight.position.normalize(),
		sunColor: 0xffffff,
		waterColor: 0xffffff,
		betaVersion: 0,
		distortionScale: 50.0,
		side: THREE.DoubleSide
	});

	var s = 1000
	var wps = [];	


	var n = 1;
	for (i=0;i<n;i++) {
		wps.push(new THREE.Mesh(
		new THREE.PlaneBufferGeometry(s,s, 10, 10),
		ms_Water.material)
				);
	}

	for (i=0;i<n;i++) {
		wps[i].add(ms_Water);
		scene.add(wps[i]);
		wps[i].position.y = -(4*(i+1))
		wps[i].rotation.x = Math.PI * 0.5 

	}



}

function rand_in_range(r) {
	return r*Math.random()-(r/2.)
}

function rand() {
	return Math.random();
}

function init_skybox(i) {
	var materialArray = [];
	/*
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'assets/textures/dawnmountain-xpos.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'assets/textures/dawnmountain-xneg.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'assets/textures/dawnmountain-ypos.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'assets/textures/dawnmountain-yneg.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'assets/textures/dawnmountain-zpos.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'assets/textures/dawnmountain-zneg.png' ) }));
	*/
	var skybox_textures = [
		'assets/textures/mountains.jpg',
		'assets/textures/clouds.jpg',
		'assets/textures/whorl.jpg',
		'assets/textures/stone.jpg',
		'assets/textures/grey_cloud.jpg',
		'assets/textures/marble.jpg',
		'assets/textures/abstract_fog.jpg'
		]

	var tex_i = reset_count % skybox_textures.length
	for (var i = 0; i < 6; i++)
		materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( skybox_textures[tex_i] ) }));
	for (var i = 0; i < 6; i++)
	 materialArray[i].side = THREE.BackSide;
	var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyboxGeom = new THREE.CubeGeometry( 500, 500, 500, 1, 1, 1 );
	var skyboxGeom2 = new THREE.CubeGeometry( 5000, 5000, 8000, 1, 1, 1 );

	if (skybox) 
		skybox.parent.remove(skybox)
	if (skybox2 && skybox2.parent)
		skybox2.parent.remove(skybox2)

	skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
	skybox2 = new THREE.Mesh( skyboxGeom2, skyboxMaterial );

	scene.add( skybox );
	//scene.add( skybox2 );
}

function init_body () {

	var loader = new THREE.OBJLoader();
	//var material = new THREE.MeshBasicMaterial({color: 'yellow', side: THREE.DoubleSide});
	var material = mirrorSphereMaterial
	loader.load('assets/model/MaleLow.obj',
		function ( object ) { 
			body = object;
				object.traverse(function (child) {
				    if (child instanceof THREE.Mesh) {
					child.material = material;
				    }
				});	
			scene.add( object );  
			object.rotateOnAxis(new THREE.Vector3(0,1,0) , .5*Math.PI)
			object.position.set(36, -19, 0);
			//object.position.set(-50,0,0) 
			//object.rotation.y += 0.5 * Math.pi;
	});
	
	
}

function init_cubes() {
	cubes = [];
	var r = 200;
	var scale = chroma.scale(['red', 'white', 'blue']);
	var n = 0;
	for(x=0; x< n; x++) {
	for(y=0; y< n; y++) {
	for(z=0; z< n; z++) {
		var cube_mat =new THREE.MeshLambertMaterial({color: 0xfefefe, transparent:true});

		cube_mat.opacity = rand()
		var geom = new THREE.CubeGeometry( 1000, 10000, 10 )

		// var cube = new THREE.Mesh( geom, mirrorSphereMaterial );
		var cube = new THREE.Mesh( geom, cube_mat );
		//var cube_pos = [rand_in_range(r), rand_in_range(r),rand_in_range(r*2)-r-30,rand(), rand(),rand()] 
		var cube_pos = [x*20,y*20,z*20]
		cubes_pos.push(cube_pos);

		cube.position.x = cube_pos[0]
		cube.position.y = cube_pos[1]
		cube.position.z = cube_pos[2]
		var s = .04;
		cube.scale.set(s,s,s);
		setRandomColors(cube,scale);
		scene.add( cube );

		//cube.material.wireframe = true;
		cubes.push(cube);
	}}}
}

function setCamControls() {

}

render();

function setRandomColors(object, scale) {
	var children = object.children;


	if (children && children.length > 0) {
		children.forEach(function (e) {
			setRandomColors(e, scale)
		});
	} else {
		// no children assume contains a mesh
		if (object instanceof THREE.Mesh) {

			object.material.color = new THREE.Color(scale(Math.random()).hex());
			if (object.material.name.indexOf("building") == 0) {
				object.material.emissive = new THREE.Color(0x444444);
				object.material.transparent = true;
				object.material.opacity = 0.8;
			}
		}
	}
}


function render() {
	//stats.update();
	var delta = clock.getDelta();
	step += 1;



	// MOVE BACK CAMERA
	//camera.translateZ( (step/50 + 1.)*2 )
	var cpos = camera.position;
	//mirrorSphereCamera.position.set(cpos.x,cpos.y,cpos.z)
	

	// RESET CAMERA
	if ((camera.position.distanceTo(new THREE.Vector3(0,0,0))|0)%100==0)
		console.log(camera.position.distanceTo(new THREE.Vector3(0,0,0)))
	if (camera.position.distanceTo(new THREE.Vector3(0,0,0)) > 30000) {
		reset_count = reset_count+1
		camera.position.set(0,0,0)
		init_skybox()
	}

	if (mesh) {
		   // mesh.rotation.y+=0.006;
	}
	
	for( i =0; i < cubes.length; i++) {
		cubes[i].position.y = cubes_pos[i][1] + Math.sin(((step+cubes[i].position.z)%200.)/200*Math.PI*2)*30;
		cubes[i].position.x = cubes_pos[i][0] + Math.sin(((step+cubes[i].position.y)%200.)/200*Math.PI*2)*30;

		//cubes[i].rotation.x += cubes_pos[3]/1000.

	}	
	for( i=0; i < mirrorSpheres.length; i++) {
		mirrorSpheres[i].rotation.x += .01;
	}
	var now = Date.now();
	var elapsed = clock.getElapsedTime();
	fire.update( elapsed );
	
	if (body) {
		//body.rotation.y = .5 * Math.pi;
	}

	flyControls.update(delta);
	webGLRenderer.clear();

	

	//mirrorSphere.visible = false;
	mirrorSphereCamera.updateCubeMap( webGLRenderer, scene );
	//mirrorSphere.visible = true;
	ms_Water.render()
	ms_Water.material.uniforms.time.value += 1.0 / 200.0;
	webGLRenderer.render(scene, camera)

	requestAnimationFrame(render);
}

}


