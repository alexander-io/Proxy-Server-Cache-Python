////////////////////////////////////////////////////////////////////////////////
/*global THREE, Coordinates, document, window  */
var camera, scene, renderer;
var cameraControls;
// var lureGlow;
var controls;
var gui;
var keyBoard;
var space, one, two, three, four, five, six, seven, eight, nine, zero;
var q, w, e, r, t, y, u, eye, o, p, a, s, d, f, g, h, j, k, l, z, x, c, v, b, n, m;
var colon, quote, lessthan, greaterthan

// set key-travel-distance, abbreviated 'ktd' to determine how much the keys move
var ktd = 7;
var interval = 1500;
// rotationToggle to controll rotation of keys, abbreviated rt
var rt = .3;
// var windowRing, windowRing2, windowRing3, windowRing4, windowRing5, windowRing6;
// var leftArmGroup, rightArmGroup;
// var armGroup, armGroup2;
// var armBase, armBase2, arm, arm2;

// var robo;

keyboard = new KeyboardState();

var clock = new THREE.Clock();

function fillScene() {
	scene = new THREE.Scene();
	// scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );
	// scene.fog = new THREE.Fog( 0xffffff, 2000, 4000 );
	scene.fog = new THREE.Fog( 0x000000, 2000, 4000 );

	// LIGHTS

	scene.add( new THREE.AmbientLight( 0x222222 ) );

	var light = new THREE.DirectionalLight( 0x000000, 0.7 );
	light.position.set( 200, 500, 500 );

	// scene.add( light );

	light = new THREE.DirectionalLight( 0xffffff, 0.9 );
	light.position.set( -200, 100, 0 );

	// scene.add( light );


	var spotLight = new THREE.SpotLight( 0xffffff );
	spotLight.position.set( 0, 500, 0 );

	spotLight.castShadow = true;
	var spotLightHelper = new THREE.SpotLightHelper( spotLight );
	// scene.add( spotLightHelper  );

	// spotLight.shadow.mapSize.width = 1024;
	// spotLight.shadow.mapSize.height = 1024;
	//
	// spotLight.shadow.camera.near = 500;
	// spotLight.shadow.camera.far = 4000;
	// spotLight.shadow.camera.fov = 30;
	//
	// scene.add( spotLight );


	//grid xz
	var gridXZ = new THREE.GridHelper(2000, 100, new THREE.Color(0xCCCCCC), new THREE.Color(0x888888));
	// scene.add(gridXZ);

	//axes
	var axes = new THREE.AxisHelper(500);
	axes.position.y = 1;
	scene.add(axes);

	// ||||||||||||| SKYBOX |||||||||||||
	var materialArray = [];
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/space/drakeq_lf.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/space/drakeq_rt.png' ) }));


	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/space/drakeq_up.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/space/drakeq_dn.png' ) }));

	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/space/drakeq_ft.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/space/drakeq_bk.png' ) }));

	for (var i = 0; i < 6; i++)
	materialArray[i].side = THREE.BackSide;
	var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyboxGeom = new THREE.CubeGeometry( 5000, 5000, 5000, 1, 1, 1 );
	var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
	scene.add( skybox );




	drawKeyboard();
}

function drawKeyboard() {


	robo = new THREE.Object3D();

	//////////////////////////////
	// MATERIALS

	// MODELS
	var geometry = new THREE.CylinderGeometry( 40, 20, 150, 32 );


	var material = new THREE.MeshPhongMaterial( {
	    color: 0xffffff,
			// alphaMap : 0x0f0f0f0f,
		  // alpha: 0x0f0f0f0f,
	    specular: 0x050505,

	    shininess: 1000
	} ) ;

	var cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 40, 20, 150, 32 ), new THREE.MeshBasicMaterial( {color: 0x000000} ) );
	var cylClone = cylinder.clone()
	cylinder.position.x = 100;
	cylinder.position.y = 75;
	cylinder.position.z = 0;
	cylClone.position.x = -100;
	cylClone.position.y = 75;
	cylClone.position.z = 0;

	var dvorakImg = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('images/dvorak.png')})
	// var cube = new THREE.Mesh(new THREE.BoxBufferGeometry(270,200,800), new THREE.MeshBasicMaterial({color: 0x00ff00}))
	var cube = new THREE.Mesh(new THREE.BoxBufferGeometry(270,200,800), dvorakImg)
	cube.rotation.z = 90*(Math.PI/180)
	cube.rotation.y = 180*(Math.PI/180)
	// scene.add(cube)

	let ctrlKey = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,75), new THREE.MeshBasicMaterial({color: 0x00C853}))
	ctrlKey.position.y = 150
	ctrlKey.position.z = 360
	ctrlKey.position.x = -80
	let ctrlKey2 = ctrlKey.clone()
	ctrlKey2.position.z = ctrlKey.position.z*-1
	scene.add(ctrlKey, ctrlKey2)

	let shiftKey = new THREE.Mesh(new THREE.BoxBufferGeometry(38,20, 140), new THREE.MeshBasicMaterial({color: 0x76FF03}))
	let shiftKey2 = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20, 116), new THREE.MeshBasicMaterial({color: 0x76FF03}))
	shiftKey.position.y = 150
	shiftKey.position.z = 327
	shiftKey.position.x = -40

	shiftKey2.position.y = 150
	shiftKey2.position.z = -340
	shiftKey2.position.x = -40
	// shiftKey2 = shiftKey.clone()
	// shiftKey2.position.z = shiftKey.position.z*-1
	scene.add(shiftKey, shiftKey2)


	let macKey = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x69F0AE}))
	macKey.position.y = 150
	macKey.position.z = 240
	macKey.position.x = -80
	let macKey2 = macKey.clone()
	// macKey2.position.z = macKey.position.z*-1
	macKey2.position.z = -295
	scene.add(macKey, macKey2)

	let altKey = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,80), new THREE.MeshBasicMaterial({color: 0xE8F5E9}))
	altKey.position.y = 150
	altKey.position.z = 175
	altKey.position.x = -80
	let altKey2 = altKey.clone()
	// altKey2.position.z = altKey.position.z*-1
	altKey2.position.z = -225
	scene.add(altKey, altKey2)

	// var spaceMap = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('images/spaceMap.png')})
	// let space = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,315), new THREE.MeshBasicMaterial({color: 0x673AB7}))
	var wireframe = new THREE.MeshBasicMaterial({wireframe: true, wireframeLinewidth:2, color: 0x18FFFF})
	space = new THREE.Mesh(new THREE.BoxBufferGeometry(20,40,315), wireframe)
	space.position.y = 150
	space.position.z = -25
	space.position.x = -80
	space.rotation.z = 90*(Math.PI/180)
	scene.add(space);

	// let tilde = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x000000}))
	// let msm = new THREE.MeshStandardMaterial({color: 0x000000, metalness: 2, roughness: 20})
	let mdm = new THREE.MeshDepthMaterial({color: 0x000000})
	// let tilde = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), wireframe)
	let tilde = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), mdm)
	// let tilde = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), msm)
	tilde.position.y = 150
	tilde.position.z = -373
	tilde.position.x = 80
	scene.add(tilde);
	let keyArray = []

	one = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0xE8F5E9}))
	one.position.y = 150
	one.position.z = -320
	one.position.x = 80
	scene.add(one);

	two = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0xC8E6C9}))
	two.position.y = 150
	two.position.z = -267
	two.position.x = 80
	scene.add(two);


	three = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0xA5D6A7}))
	three.position.y = 150
	three.position.z = -213
	three.position.x = 80
	scene.add(three);

	four = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x81C784}))
	four.position.y = 150
	four.position.z = -159
	four.position.x = 80
	scene.add(four);

	five = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x66BB6A}))
	five.position.y = 150
	five.position.z = -106
	five.position.x = 80
	scene.add(five);

	six = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x4CAF50}))
	six.position.y = 150
	six.position.z = -53
	six.position.x = 80
	scene.add(six);


	seven = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x43A047}))
	seven.position.y = 150
	seven.position.z = 0
	seven.position.x = 80
	scene.add(seven);

	eight = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x388E3C}))
	eight.position.y = 150
	eight.position.z = 53
	eight.position.x = 80
	scene.add(eight);

	nine = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x2E7D32}))
	nine.position.y = 150
	nine.position.z = 106
	nine.position.x = 80
	scene.add(nine);

	zero = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x1B5E20}))
	zero.position.y = 150
	zero.position.z = 159
	zero.position.x = 80
	scene.add(zero);

	keyArray.push(one, two, three, four, five, six, seven, eight, nine, zero)

	// var q, w, e, r, t, y, u, i, o, p, a, s, d, f, g, h, j, k, l, z, x, c, v, b, n, m;
	//

	// ||||||||||||||||||||||||||||||||||||||||||||||||||||||
	a = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0xE8F5E9}))
	a.position.y = 150
	a.position.z = -280
	a.position.x = 0
	scene.add(a);

	o = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0xC8E6C9}))
	o.position.y = 150
	o.position.z = -227
	o.position.x = 0
	scene.add(o);

	e = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0xA5D6A7}))
	e.position.y = 150
	e.position.z = -174
	e.position.x = 0
	scene.add(e);

	u = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x81C784}))
	u.position.y = 150
	u.position.z = -121
	u.position.x = 0
	scene.add(u);

	eye = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x66BB6A}))
	eye.position.y = 150
	eye.position.z = -68
	eye.position.x = 0
	scene.add(eye);

	d = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x4CAF50}))
	d.position.y = 150
	d.position.z = -15
	d.position.x = 0
	scene.add(d);

	h = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x43A047}))
	h.position.y = 150
	h.position.z = 38
	h.position.x = 0
	scene.add(h);

	t = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x388E3C}))
	t.position.y = 150
	t.position.z = 91
	t.position.x = 0
	scene.add(t);

	n = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x2E7D32}))
	n.position.y = 150
	n.position.z = 144
	n.position.x = 0
	scene.add(n);

	s = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x1B5E20}))
	s.position.y = 150
	s.position.z = 197
	s.position.x = 0
	scene.add(s);

	// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||



	colon = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0xE8F5E9}))
	colon.position.y = 150
	colon.position.z = -253
	colon.position.x = -40
	scene.add(colon);

	q = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0xC8E6C9}))
	q.position.y = 150
	q.position.z = -200
	q.position.x = -40
	scene.add(q);

	j = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0xA5D6A7}))
	j.position.y = 150
	j.position.z = -147
	j.position.x = -40
	scene.add(j);

	k = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x81C784}))
	k.position.y = 150
	k.position.z = -94
	k.position.x = -40
	scene.add(k);

	x = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x66BB6A}))
	x.position.y = 150
	x.position.z = -41
	x.position.x = -40
	scene.add(x);

	b = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x4CAF50}))
	b.position.y = 150
	b.position.z = 12
	b.position.x = -40
	scene.add(b);

	m = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x43A047}))
	m.position.y = 150
	m.position.z = 65
	m.position.x = -40
	scene.add(m);

	w = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x388E3C}))
	w.position.y = 150
	w.position.z = 118
	w.position.x = -40
	scene.add(w);

	v = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x2E7D32}))
	v.position.y = 150
	v.position.z = 171
	v.position.x = -40
	scene.add(v);

	z = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x1B5E20}))
	z.position.y = 150
	z.position.z = 224
	z.position.x = -40
	scene.add(z);

	// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

	quote = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0xE8F5E9}))
	quote.position.y = 150
	quote.position.z = -290
	quote.position.x = 40
	scene.add(quote);

	lessthan = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0xC8E6C9}))
	lessthan.position.y = 150
	lessthan.position.z = -237
	lessthan.position.x = 40
	scene.add(lessthan);

	greaterthan = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0xA5D6A7}))
	greaterthan.position.y = 150
	greaterthan.position.z = -184
	greaterthan.position.x = 40
	scene.add(greaterthan);

	p = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x81C784}))
	p.position.y = 150
	p.position.z = -131
	p.position.x = 40
	scene.add(p);

	y = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x66BB6A}))
	y.position.y = 150
	y.position.z = -78
	y.position.x = 40
	scene.add(y);

	f = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x4CAF50}))
	f.position.y = 150
	f.position.z = -25
	f.position.x = 40
	scene.add(f);

	g = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x43A047}))
	g.position.y = 150
	g.position.z = 28
	g.position.x = 40
	scene.add(g);

	c = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x388E3C}))
	c.position.y = 150
	c.position.z = 81
	c.position.x = 40
	scene.add(c);

	r = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x2E7D32}))
	r.position.y = 150
	r.position.z = 134
	r.position.x = 40
	scene.add(r);

	l = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x1B5E20}))
	l.position.y = 150
	l.position.z = 187
	l.position.x = 40
	scene.add(l);


	for (var i = 0; i < keyArray.length; i++) {

		keyArray[i] = keyArray[i].clone()
		keyArray[i].position.x -=40
		keyArray[i].position.z +=30
		// scene.add(keyArray[i])

		keyArray[i] = keyArray[i].clone()
		keyArray[i].position.x -=40
		keyArray[i].position.z +=10
		// scene.add(keyArray[i])

		keyArray[i] = keyArray[i].clone()
		keyArray[i].position.x -=40
		keyArray[i].position.z +=27
		// scene.add(keyArray[i])
	}

	let leftCurly = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x69F0AE}))
	leftCurly.position.y = 150
	leftCurly.position.z = 212
	leftCurly.position.x = 80
	scene.add(leftCurly);

	let rightCurly = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x00E676}))
	rightCurly.position.y = 150
	rightCurly.position.z = 265
	rightCurly.position.x = 80
	scene.add(rightCurly);

	let backSpace = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,110), new THREE.MeshBasicMaterial({color: 0x00C853}))
	backSpace.position.y = 150
	backSpace.position.z = 345
	backSpace.position.x = 80
	scene.add(backSpace);

	let qMark = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0xB2FF59}))
	qMark.position.y = 150
	qMark.position.z = 241
	qMark.position.x = 40
	scene.add(qMark);

	let plus = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x76FF03}))
	plus.position.y = 150
	plus.position.z = qMark.position.z + 53
	plus.position.x = 40
	scene.add(plus);

	let pipe = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,80), new THREE.MeshBasicMaterial({color: 0x64DD17}))
	pipe.position.y = 150
	pipe.position.z = 360
	pipe.position.x = 40
	scene.add(pipe);

	let dash = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,50), new THREE.MeshBasicMaterial({color: 0x00E676}))
	dash.position.y = 150
	dash.position.z = 252
	dash.position.x = 0
	scene.add(dash);

	let enter = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,120), new THREE.MeshBasicMaterial({color: 0x00C853}))
	enter.position.y = 150
	enter.position.z = 340
	enter.position.x = 0
	scene.add(enter);

	let tab = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,80), new THREE.MeshBasicMaterial({color: 0x64DD17}))
	tab.position.y = 150
	tab.position.z = -358
	tab.position.x = 40
	scene.add(tab);

	let capslock = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,90), new THREE.MeshBasicMaterial({color: 0x00E676}))
	capslock.position.y = 150
	capslock.position.z = -353
	capslock.position.x = 0
	scene.add(capslock);

	let menu = new THREE.Mesh(new THREE.BoxBufferGeometry(40,20,52), new THREE.MeshBasicMaterial({color: 0x00E676}))
	menu.position.y = 150
	menu.position.z = 294
	menu.position.x = -80
	scene.add(menu)
}


function init() {
	// console.log(document.getElementById('keyboard-container').offsetWidth)
	// var canvasWidth = 1200;
	// var canvasHeight = 400;
	var canvasWidth = document.getElementById('keyboard-container').offsetWidth/1.04
	var canvasHeight = document.getElementById('keyboard-container').offsetWidth/3.2
	var canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );

	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor( 0xAAAAAA, 1.0 );

	// gui CONTROLS
	// controls = new function(){
	// 	this.keyTravelDistance = 3.00;
	// 	this.keyRotation = .3;
	// 	this.timeInterval = 1500;
	//
	// 	// this.rotationSpeedX = 0.00;
	// 	// this.rotationSpeedY = 0.01;
	// 	// this.rotationSpeedZ = 0.01;
	// 	// this.leftTurretRotation = 0.01;
	// 	// this.rightTurretRotation = 0.01;
	// 	// this.armRotation = 0.0;
	// 	// this.armRotation2 = 0.0;
	// }

	// gui = new dat.GUI();
	// gui.add(controls, 'keyTravelDistance', -7, 7)
	// gui.add(controls, 'timeInterval', 250, 5000)
	// gui.add(controls, 'keyRotation', 0, 1)
	// gui.add(controls, 'rotationSpeedX', 0, 0.5);
	// gui.add(controls, 'rotationSpeedY', 0, 0.5);
	// gui.add(controls, 'rotationSpeedZ', 0, 0.5);
	// gui.add(controls, 'leftTurretRotation', 0, 0.5);
	// gui.add(controls, 'rightTurretRotation', 0, 0.5);
	// gui.add(controls, 'armRotation', -1.0, 1.0);
	// gui.add(controls, 'armRotation2', -1.0, 1.0);

	// renderScene();

	// function renderScene(){
		// space.position.y +=
	// // 	// lureGlow.rotation.x += controls.rotationSpeedX;
	// // 	// lureGlow.rotation.y += controls.rotationSpeedY;
	// // 	// lureGlow.rotation.z += controls.rotationSpeedZ;

	// }
	//
	// requestAnimationFrame(renderScene);

	// CAMERA
	camera = new THREE.PerspectiveCamera( 45, canvasRatio, 1, 16000 );

	// CONTROLS
	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	camera.position.set( -470, 350, 0);
	// camera.rotation.y = 180*(Math.PI/180)
	cameraControls.target.set(0,180,0);
}

function addToDOM() {
	var canvas = document.getElementById('dvorakCanvas');
	canvas.appendChild(renderer.domElement);
}

function animate() {
	renderScene();
	function renderScene(){

		// ktd = controls.keyTravelDistance;
		// interval = controls.timeInterval;
		// rt = controls.keyRotation;



		// lureGlow.rotation.x += controls.rotationSpeedX;
		// lureGlow.rotation.y += controls.rotationSpeedY;
		// lureGlow.rotation.z += controls.rotationSpeedZ;

		// windowRing.rotation.x = windowRing2.rotation.x = windowRing3.rotation.x = controls.leftTurretRotation;
		// windowRing4.rotation.x = windowRing5.rotation.x = windowRing6.rotation.x = controls.rightTurretRotation;

		// windowRing.rotation.x = windowRing2.rotation.x = windowRing3.rotation.x += controls.leftTurretRotation;
		// windowRing4.rotation.x = windowRing5.rotation.x = windowRing6.rotation.x -= controls.rightTurretRotation;
		//
		// armGroup.rotation.z = controls.armRotation;
		// armGroup.rotation.z = controls.armRotation;

		// armGroup2.rotation.z = controls.armRotation2;
		//
		keyboard.update();
		//
		// console.log('render executing')
		if(keyboard.pressed("space")){
			space.position.y += ktd;
			space.rotation.z += rt
			setTimeout(function(){
				space.position.y -= ktd;
				space.rotation.z -= rt
			}, interval)
			console.log('pressed the space')
		}

		if (keyboard.pressed("Q"))
		{
			q.position.y += ktd;
			q.rotation.z += rt
			setTimeout(function(){
				q.position.y -= ktd;
				q.rotation.z -= rt
			}, interval)
			console.log('pressed q')
		}
		if (keyboard.pressed("W")){
			w.position.y += ktd
			w.rotation.z += rt
			setTimeout(function(){
				w.position.y -= ktd
				w.rotation.z -= rt
			}, interval)
			}//console.log('pressed w')}
		if (keyboard.pressed("E")){
			e.position.y += ktd
			e.rotation.z += rt
			setTimeout(function(){
				e.position.y -= ktd
				e.rotation.z -= rt
			}, interval)
			}//console.log('pressed e')}
		if (keyboard.pressed("R")){
			r.position.y += ktd
			r.rotation.z += rt
			setTimeout(function(){
				r.position.y -= ktd
				r.rotation.z -= rt
			}, interval)
			}//console.log('pressed R')}
		if (keyboard.pressed("T")){
			t.position.y += ktd
			t.rotation.z += rt
			setTimeout(function(){
				t.position.y -= ktd
				t.rotation.z -= rt
			}, interval)
			}//console.log('pressed T')}
		if (keyboard.pressed("Y")){
			y.position.y += ktd
			y.rotation.z += rt
			setTimeout(function(){
				y.position.y -= ktd
				y.rotation.z -= rt
			}, interval)
			}//console.log('pressed Y')}
		// ||||||||||||||||||||||||||||||||||||||||||||
		if (keyboard.pressed("U")){
			u.position.y += ktd
			u.rotation.z += rt
			setTimeout(function(){
				u.position.y -= ktd
				u.rotation.z -= rt
			}, interval)
			}//console.log('pressed U')}
		if (keyboard.pressed("I")){
			eye.position.y += ktd
			eye.rotation.z += rt
			setTimeout(function(){
				eye.position.y -= ktd
				eye.rotation.z -= rt
			}, interval)
			}//console.log('pressed I')}
		if (keyboard.pressed("O")){
			o.position.y += ktd
			o.rotation.z += rt
			setTimeout(function(){
				o.position.y -= ktd
				o.rotation.z -= rt
			}, interval)
			}//console.log('pressed O')}
		if (keyboard.pressed("P")){
			p.position.y += ktd
			p.rotation.z += rt
			setTimeout(function(){
				p.position.y -= ktd
				p.rotation.z -= rt
			}, interval)
			}//console.log('pressed P')}
		if (keyboard.pressed("A")){
			a.position.y += ktd
			a.rotation.z += rt
			setTimeout(function(){
				a.position.y -= ktd
				a.rotation.z -= rt
			}, interval)
			}//console.log('pressed A')}
		if (keyboard.pressed("S")){
			s.position.y += ktd
			s.rotation.z += rt
			setTimeout(function(){
				s.position.y -= ktd
				s.rotation.z -= rt
			}, interval)
			}//console.log('pressed S')}
		// ||||||||||||||||||||||||||||||||||||||||||||
		if (keyboard.pressed("D")){
			d.position.y += ktd
			d.rotation.z += rt
			setTimeout(function(){
				d.position.y -= ktd
				d.rotation.z -= rt
			}, interval)
			}//console.log('pressed D')}
		if (keyboard.pressed("F")){
			f.position.y += ktd
			f.rotation.z += rt
			setTimeout(function(){
				f.position.y -= ktd
				f.rotation.z -= rt
			}, interval)
			}//console.log('pressed F')}
		if (keyboard.pressed("G")){
			g.position.y += ktd
			g.rotation.z += rt
			setTimeout(function(){
				g.position.y -= ktd
				g.rotation.z -= rt
			}, interval)
			}//console.log('pressed G')}
		if (keyboard.pressed("H")){
			h.position.y += ktd
			h.rotation.z += rt
			setTimeout(function(){
				h.position.y -= ktd
				h.rotation.z -= rt
			}, interval)
			}//console.log('pressed H')}
		if (keyboard.pressed("J")){
			j.position.y += ktd
			j.rotation.z += rt
			setTimeout(function(){
				j.position.y -= ktd
				j.rotation.z -= rt
			}, interval)
			}//console.log('pressed J')}
		if (keyboard.pressed("K")){
			k.position.y += ktd
			k.rotation.z += rt
			setTimeout(function(){
				k.position.y -= ktd
				k.rotation.z -= rt
			}, interval)
			}//console.log('pressed K')}
		// ||||||||||||||||||||||||||||||||||||||||||||
		if (keyboard.pressed("L")){
			l.position.y += ktd
			l.rotation.z += rt
			setTimeout(function(){
				l.position.y -= ktd
				l.rotation.z -= rt
			}, interval)
			}//console.log('pressed L')}
		if (keyboard.pressed("Z")){
			z.position.y += ktd
			z.rotation.z += rt
			setTimeout(function(){
				z.position.y -= ktd
				z.rotation.z -= rt
			}, interval)
			}//console.log('pressed Z')}
		if (keyboard.pressed("X")){
			x.position.y += ktd
			x.rotation.z += rt
			setTimeout(function(){
				x.position.y -= ktd
				x.rotation.z -= rt
			}, interval)
			}//console.log('pressed X')}
		if (keyboard.pressed("C")){
			c.position.y += ktd
			c.rotation.z += rt
			setTimeout(function(){
				c.position.y -= ktd
				c.rotation.z -= rt
			}, interval)
			}//console.log('pressed C')}
		if (keyboard.pressed("V")){
			v.position.y += ktd
			v.rotation.z += rt
			setTimeout(function(){
				v.position.y -= ktd
				v.rotation.z -= rt
			}, interval)
			}//console.log('pressed V')}
		if (keyboard.pressed("B")){
			b.position.y += ktd
			b.rotation.z += rt
			setTimeout(function(){
				b.position.y -= ktd
				b.rotation.z -= rt
			}, interval)
			}//console.log('pressed B')}

		if (keyboard.pressed("N")){
			n.position.y += ktd
			n.rotation.z += rt
			setTimeout(function(){
				n.position.y -= ktd
				n.rotation.z -= rt
			}, interval)
			}//console.log('pressed N')}
		if (keyboard.pressed("M")){
			m.position.y += ktd
			m.rotation.z += rt
			setTimeout(function(){
				m.position.y -= ktd
				m.rotation.z -= rt
			}, interval)
			}//console.log('pressed M')}



		if(keyboard.pressed("1")){
			one.position.y += ktd
			one.rotation.z += rt
			setTimeout(function(){
				one.position.y -= ktd
				one.rotation.z -= rt
			}, interval)
			}//console.log('pressed 1')}
		if(keyboard.pressed("2")){
			two.position.y += ktd
			two.rotation.x += rt
			setTimeout(function(){
				two.position.y -= ktd
				two.rotation.x -= rt
			}, interval)
			}//console.log('pressed 2')}
		if(keyboard.pressed("3")){
			three.position.y += ktd
			three.rotation.z += rt
			setTimeout(function(){
				three.position.y -= ktd
				three.rotation.z -= rt
			}, interval)
			}//console.log('pressed 3')}
		if(keyboard.pressed("4")){
			four.position.y += ktd
			four.rotation.x += rt
			setTimeout(function(){
				four.position.y -= ktd
				four.rotation.x -= rt
			}, interval)
			}//console.log('pressed 4')}
		if(keyboard.pressed("5")){
			five.position.y += ktd
			five.rotation.z += rt
			setTimeout(function(){
				five.position.y -= ktd
				five.rotation.z -= rt
			}, interval)
			}//console.log('pressed 5')}
		if(keyboard.pressed("6")){
			six.position.y += ktd
			six.rotation.x += rt
			setTimeout(function(){
				six.position.y -= ktd
				six.rotation.x -= rt
			}, interval)
			}//console.log('pressed 6')}
		if(keyboard.pressed("7")){
			seven.position.y += ktd
			seven.rotation.z += ktd
			setTimeout(function(){
				seven.position.y -= ktd
				seven.rotation.z -= ktd
			}, interval)
			}//console.log('pressed 7')}
		if(keyboard.pressed("8")){
			eight.position.y += ktd
			eight.rotation.x += ktd
			setTimeout(function(){
				eight.position.y -= ktd
				eight.rotation.x -= ktd
			}, interval)
			}//console.log('pressed 8')}
		if(keyboard.pressed("9")){
			nine.position.y += ktd
			nine.rotation.z += ktd
			setTimeout(function(){
				nine.position.y -= ktd
				nine.rotation.z -= ktd
			}, interval)
			}//console.log('pressed 9')}
		if(keyboard.pressed("0")){
			zero.position.y += ktd
			zero.rotation.x += ktd
			setTimeout(function(){
				zero.position.y -= ktd
				zero.rotation.x -= ktd
			}, interval)
			}//console.log('pressed 0')}

	}

	requestAnimationFrame(renderScene);

	// camera.lookAt(new THREE.Vector3(0,0,0))
	// let sceneOrigin = new THREE.Vector3(0,0,0);
	// console.log(camera.getWorldDirection())
	// console.log('scene origin : ', sceneOrigin)
	// camera.lookAt(sceneOrigin)

	// fix the camera to look at this position
	cameraControls.target.set(0,200,0);
	window.requestAnimationFrame(animate);
	render();
}

function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);
	renderer.render(scene, camera);
	canvasWidth = document.getElementById('keyboard-container').offsetWidth/1.04
	canvasHeight = document.getElementById('keyboard-container').offsetWidth/3.2

}

try {
	init();
	fillScene();
	addToDOM();
	animate();
} catch(error) {
	console.log("Your program encountered an unrecoverable error, can not draw on canvas. Error was:");
	console.log(error);
}
