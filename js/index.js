let SCENE;
let CAMERA;
let RENDERER;
let LOADING_MANAGER;
let IMAGE_LOADER;
let OBJ_LOADER;
let CONTROLS;
let MOUSE = {x:0, y:0};
let WINDOWHALF = {x: (window.innerWidth / 2), y: (window.innerHeight / 2)};

function initScene(){
  const elementHTML = document.querySelector('#object');

  RENDERER = new THREE.WebGLRenderer();
  RENDERER.shadowMap.enabled = true;
  RENDERER.setPixelRatio(window.devicePixelRatio);
  RENDERER.setSize(window.innerWidth, window.innerHeight);
  elementHTML.appendChild(RENDERER.domElement);

  SCENE = new THREE.Scene();
  SCENE.background = new THREE.Color().setHSL( 0.6, 0, 1 );

  CAMERA = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 5000);
  CAMERA.position.set( 0, 0, 250 );
  
  CONTROLS = new THREE.OrbitControls(CAMERA, RENDERER.domElement);
  CONTROLS.enableDamping = true;
  CONTROLS.dampingFactor = 0.8;
  CONTROLS.screenSpacePanning = true;
}

function createLights(){
  const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1.2 );
	hemiLight.color.setHSL( 0.6, 1, 0.6 );
	hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	hemiLight.position.set( 0, 50, 0 );
	
  const directionalLight = new THREE.DirectionalLight(0xeeeeff, 0.5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.position.z=2000;

  SCENE.add(hemiLight);
  SCENE.add(directionalLight);
}

function onWindowResize() {
  CAMERA.aspect = window.innerWidth / window.innerHeight;
  CAMERA.updateProjectionMatrix();
  RENDERER.setSize( window.innerWidth, window.innerHeight );
}

function createPlane(){
   const planeGeometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
   const planeMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff } );
   planeMaterial.color.setHSL( 0.095, 0.2, 0.6 );
   const plane = new THREE.Mesh(planeGeometry, planeMaterial);
   plane.receiveShadow = true; 
   SCENE.add(plane);
}

function loadModel() {
  new THREE.MTLLoader()
		.setPath( './models/' )
		.load( 'splines.mtl', function ( materials ) {

		materials.preload();

		new THREE.OBJLoader()
			.setMaterials( materials )
			.setPath( './models/' )
			.load( 'splines.obj', function ( object ) {
        object.position.z = 40;
        object.rotation.x = Math.PI / 2;
        object.castShadow = true; 
        object.receiveShadow = true; 
				SCENE.add( object );
			});
    });
}

function init(){
  initScene();
  createLights();
  createPlane();
  loadModel();
}

function render(){
  RENDERER.render(SCENE, CAMERA);
}

function animate() {
  requestAnimationFrame( animate );
  CONTROLS.update();
  render();
}
init();
animate();
window.addEventListener( 'resize', onWindowResize, false );
//document.addEventListener("DOMContentLoaded", animate);
//document.addEventListener( 'mousedown', onDocumentMouseMove, false );