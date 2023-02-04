//#region Variaveis Globais
let decor = []; //Array de Decorações
let furniturePieces = []; // Array de Peças do Móvel com Animação
var Pinho = null; //Guarda o Material Antigo de Madeira em Memória
var doorDefault = null; //Guarda o Material Antigo da Porta em Memória
var width = document.getElementById("inner").offsetWidth; //Largura
var height = document.getElementById("inner").offsetHeight; //Altura
var isDecorViewEnabled = true; //Variavel para Ligar / Desligar a Vista de Decoração
var isNight = false;

//Declaração de Variáveis de Sentido da Animação
var doorRightIntTimeScale = -1;
var doorLeftIntTimeScale = -1;
var drawerUpIntTimeScale = -1;
var drawerDownIntTimeScale = -1;
//Fim da Declaração de Variáveis de Sentido da Animação

//Declaração das Variáveis do Estado de Abertura das Peças do Movel Com Animação
var doorRightIsOpen = false;
var doorLeftIsOpen = false;
var drawerUpIsOpen = false;
var drawerDownIsOpen = false;
//Fim da Declaração das Variáveis do Estado de Abertura das Peças do Movel Com Animação
//#endregion

//#region Criar Cena
var scene = new THREE.Scene();
//scene.background = new THREE.Color( 0xffffff); //WHITE BACKGROUND
//scene.background = new THREE.Color( 0x383838); //DARK BACKGROUND
scene.background = new THREE.Color(0xf4f3f1); //LIGHT BACKGROUND
//#endregion

//#region Create Textures

//Plywood
const TextureLoader = new THREE.TextureLoader();
const PlywoodBaseColor = TextureLoader.load(
  "assets/Materials/Woods/Plywood/Wood_Plywood_Front_001_basecolor.jpg"
);
const PlywoodAO = TextureLoader.load(
  "assets/Materials/Woods/Plywood/Wood_Plywood_Front_001_ambientOcclusion.jpg"
);
const PlywoodNormal = TextureLoader.load(
  "assets/Materials/Woods/Plywood/Wood_Plywood_Front_001_normal.jpg"
);
const PlywoodHeight = TextureLoader.load(
  "assets/Materials/Woods/Plywood/Wood_Plywood_Front_001_height.png"
);
const Plywood = new THREE.MeshStandardMaterial({
  map: PlywoodBaseColor,
  normalMap: PlywoodNormal,
  aoMap: PlywoodAO,
  normalMap: PlywoodNormal,
  bumpMap: PlywoodHeight,
  side: THREE.DoubleSide,
});

//Marble
const TextureLoaderMarble = new THREE.TextureLoader();
const MarbleBaseColor = TextureLoaderMarble.load(
  "assets/Materials/Stone/Marble/Marble_White_006_basecolor.jpg"
);
const MarbleAO = TextureLoaderMarble.load(
  "assets/Materials/Stone/Marble/Marble_White_006_ambientOcclusion.jpg"
);
const MarbleNormal = TextureLoaderMarble.load(
  "assets/Materials/Stone/Marble/Marble_White_006_normal.jpg"
);
const MarbleHeight = TextureLoaderMarble.load(
  "assets/Materials/Stone/Marble/Marble_White_006_height.png"
);
const Marble = new THREE.MeshStandardMaterial({
  map: MarbleBaseColor,
  normalMap: MarbleNormal,
  aoMap: MarbleAO,
  normalMap: MarbleNormal,
  bumpMap: MarbleHeight,
  side: THREE.DoubleSide,
});

//Glass
const glass = new THREE.MeshPhysicalMaterial({
  metalness: 0.9,
  roughness: 0.05,
  envMapIntensity: 0.9,
  clearcoat: 1,
  transparent: true,
  opacity: 0.5,
  reflectivity: 0.2,
  refractionRatio: 0.985,
  ior: 0.9,
  side: THREE.DoubleSide,
});

const DarkGlass = new THREE.MeshPhysicalMaterial({
  color: 0x040404,
  clearcoat: 0.2,
  reflectivity: 0.2,
  refractionRatio: 0.985,
  ior: 0.9,
  side: THREE.DoubleSide,
});

const WhiteGlass = new THREE.MeshPhysicalMaterial({
  clearcoat: 1.0,
  reflectivity: 0.2,
  refractionRatio: 0.985,
  ior: 0.9,
  side: THREE.DoubleSide,
});
//#endregion

//#region Criar Renderer
var meuCanvas = document.getElementById("productImage7");
var renderer = new THREE.WebGLRenderer({
  canvas: meuCanvas, //Liga ao Canvas do HTML
  antialias: true, // Liga o Anti-Aliasing
  powerPreference: "high-performance",
  precision: "lowp",
});

renderer.setSize(width, height, 0.1, 100); //Define o Tamanho para o Tamanho do Canvas
renderer.setPixelRatio(1.5); //Define a Resolução
renderer.toneMapping = THREE.ACESFilmicToneMapping; //Define o Mapa de Tons
renderer.outputEncoding = THREE.sRGBEncoding; //Define o Encoding
renderer.shadowMap.enabled = true; //Liga as Sombras
renderer.shadowMap.type = THREE.PCFSoftShadowMap; //Liga as Sombras Suaves
const pmremGenerator = new THREE.PMREMGenerator(renderer); //Liga o HDRi
pmremGenerator.compileEquirectangularShader(); //Liga o HDRi
//#endregion

//#region Resizer
window.addEventListener("resize", function () {
  // Update the canvas width and height
  width = document.getElementById("inner").offsetWidth;
  height = document.getElementById("inner").offsetHeight;

  // Update the renderer
  renderer.setSize(width, height, 0.1, 100); //Define o Tamanho para o Tamanho do Canvas
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
//#endregion

//#region Definir Camera
const fov = 45; //Define Campo de Visão da camera
const near = 0.1; //Evita o Clipping
const far = 100; //Evita o Clipping
const camera = new THREE.PerspectiveCamera(fov, width / height, near, far); //Cria a Camara
camera.position.set(-11.167, 7.397, 15.736); //Define a Posição Inicial da Camara
//#endregion

//#region Definir Luzes
//Luz Direcional
var light = new THREE.DirectionalLight(0xffffff);
light.position.set(5.0, 10.0, 8.0); //Define Posição da Luz
light.target.position.set(0, 0, 0); //Define Direção da Luz
light.castShadow = true; //Liga as Sombras relativas à Luz Direcional
light.shadow.mapSize.width = 2048; // Define a Resolução das Sombras
light.shadow.mapSize.height = 2048; // Define a Resolução das Sombras

const d = 20;
light.shadow.camera.left = -d; // Define o Cone de Projeção das Sombras
light.shadow.camera.right = d; // Define o Cone de Projeção das Sombras
light.shadow.camera.top = d; // Define o Cone de Projeção das Sombras
light.shadow.camera.bottom = -d; // Define o Cone de Projeção das Sombras
light.shadow.camera.far = 50; // Define o Cone de Projeção das Sombras
light.shadow.bias = -0.0005; //Para Corrigir Glitches Visuais
scene.add(light);

const rectLight = new THREE.RectAreaLight(0xecc391, 0, 10, 0.3);
rectLight.position.set(-2, 2.8, -1.8);
scene.add(rectLight);

const rectLight2 = new THREE.RectAreaLight(0xecc391, 0, 10, 0.3);
rectLight2.position.set(-2, 2.9, -1.8);
rectLight2.rotation.set(180, 0, 0);

scene.add(rectLight2);
//#endregion

//#region Definir Plano de Sombra
//Cria Plano de Sombra
const geometry = new THREE.PlaneGeometry(2000, 2000); //Cria Plano com Dimensão 2000x2000
geometry.rotateX(-Math.PI / 2); //Roda o Plano para a Horizontal
const material = new THREE.ShadowMaterial(); //Atribui ao Plano um Material Transparente onde as sombras apenas são vísiveis de cima
material.opacity = 0.4; //Opacidade das Sombras
const plane = new THREE.Mesh(geometry, material); // Cria Plano
scene.add(plane);
//#endregion


//#region Definir HDRI
//Carega um modelo HDRI como ambiente, para iluminação e reflexos
new THREE.RGBELoader()
  .setDataType(THREE.UnsignedByteType)
  .load("assets/SceneEnvironments/StudioLighting_Day.hdr", function (texture) {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    scene.environment = envMap;
    texture.dispose();
    pmremGenerator.dispose();
  });
//#endregion

//#region Carregar Ficheiro 3D e atribuir objetos a Arrays
var carregador = new THREE.GLTFLoader();
carregador.load(
  "assets/3DModels/MovelTVGabin.gltf", //Carrega o modelo da Scene
  function (gltf) {
    scene.add(gltf.scene); //Adiciona o Modelo à Scene
    //Procura e Atribuição das Animações a Clips
    clipeOpenDoorRight = THREE.AnimationClip.findByName(
      gltf.animations,
      "doorRightOpen"
    );
    clipeOpenDoorLeft = THREE.AnimationClip.findByName(
      gltf.animations,
      "doorLeftOpen"
    );
    clipeOpenDrawerUp = THREE.AnimationClip.findByName(
      gltf.animations,
      "drawerUpOpen"
    );
    clipeOpenDrawerDown = THREE.AnimationClip.findByName(
      gltf.animations,
      "drawerDownOpen"
    );
    clipeFita1 = THREE.AnimationClip.findByName(gltf.animations, "Fita1");
    clipeFita2 = THREE.AnimationClip.findByName(gltf.animations, "Fita2");
    clipeFita3 = THREE.AnimationClip.findByName(gltf.animations, "Fita3");
    clipeFita4 = THREE.AnimationClip.findByName(gltf.animations, "Fita4");
    clipeFita5 = THREE.AnimationClip.findByName(gltf.animations, "Fita5");
    clipeFita6 = THREE.AnimationClip.findByName(gltf.animations, "Fita6");
    clipeFita7 = THREE.AnimationClip.findByName(gltf.animations, "Fita7");
    clipeFita8 = THREE.AnimationClip.findByName(gltf.animations, "Fita8");
    clipeFan = THREE.AnimationClip.findByName(gltf.animations, "Fan");

    //Atribuição dos Clipes a Ações
    acaoOpenDoorRight = misturador.clipAction(clipeOpenDoorRight);
    acaoOpenDoorLeft = misturador.clipAction(clipeOpenDoorLeft);
    acaoOpenDrawerUp = misturador.clipAction(clipeOpenDrawerUp);
    acaoOpenDrawerDown = misturador.clipAction(clipeOpenDrawerDown);
    acaoFita1 = misturador.clipAction(clipeFita1);
    acaoFita2 = misturador.clipAction(clipeFita2);
    acaoFita3 = misturador.clipAction(clipeFita3);
    acaoFita4 = misturador.clipAction(clipeFita4);
    acaoFita5 = misturador.clipAction(clipeFita5);
    acaoFita6 = misturador.clipAction(clipeFita6);
    acaoFita7 = misturador.clipAction(clipeFita7);
    acaoFita8 = misturador.clipAction(clipeFita8);
    acaoFan = misturador.clipAction(clipeFan);

    acaoFita1.setLoop(THREE.LoopPingPong);
    acaoFita1.play();
    acaoFita2.setLoop(THREE.LoopPingPong);
    acaoFita2.play();
    acaoFita3.setLoop(THREE.LoopPingPong);
    acaoFita3.play();
    acaoFita4.setLoop(THREE.LoopPingPong);
    acaoFita4.play();
    acaoFita5.setLoop(THREE.LoopPingPong);
    acaoFita5.play();
    acaoFita6.setLoop(THREE.LoopPingPong);
    acaoFita6.play();
    acaoFita7.setLoop(THREE.LoopPingPong);
    acaoFita7.play();
    acaoFita8.setLoop(THREE.LoopPingPong);
    acaoFita8.play();

    acaoFan.setLoop(THREE.LoopPingPong);
    acaoFan.play();

    scene.traverse(function (child) {
      //Esconde o Segundo Tipo de Maçanetas
      Pinho = scene.getObjectByName("rack").material;
      doorDefault = scene.getObjectByName("doorRight-Window").material;
      scene.getObjectByName("doorRight-Handler2").visible = false;
      scene.getObjectByName("doorLeft-Handler2").visible = false;
      scene.getObjectByName("drawerUp-Handler2").visible = false;
      scene.getObjectByName("drawerDown-Handler2").visible = false;
      scene.getObjectByName("doorRight-Handler3").visible = false;
      scene.getObjectByName("doorLeft-Handler3").visible = false;
      scene.getObjectByName("drawerUp-Handler3").visible = false;
      scene.getObjectByName("drawerDown-Handler3").visible = false;
      scene.getObjectByName("legs2").visible = false;

      if (child.isMesh) {
        //Se for Objeto Recebe e Projeta Sombras
        child.receiveShadow = true;
        child.castShadow = true;
      }
      if (child.name.includes("Decor")) {
        //Se o Objeto for uma Decoração, vai para o Array decor
        decor.push(child);
      }
      if (
        child.name.includes("door") ||
        child.name.includes("drawer") ||
        child.name.includes("rack")
      ) {
        //Se o Objeto tiver animação, vai para o Array furniturePieces
        furniturePieces.push(child);
      }
    });
  }
);
//#endregion

//#region Criar Controlos de Órbita
var controls = new THREE.OrbitControls(camera, renderer.domElement); //Cria controls de Órbita
controls.enableDamping = true; //Atribui um "Peso" às Rotações
controls.autoRotate = true; //Liga a Auto-Rotação da Camara em Torno do Objeto
controls.autoRotateSpeed = 1; //Atribui a velocidade 1   à Auto-Rotação da Camara em Torno do Objeto
controls.maxDistance = 30; //Maximo Afastamento do Objeto
controls.minDistance = 10; //Maximo Aproximação do Objeto
controls.zoomSpeed = 0.4; //Velocidade de Zoom
controls.target = new THREE.Vector3(0, 5, 0); //Desloca a Camara para a Posição Ideal à Vista de Decoração
controls.enablePan = false; //Desativa Movimentação da Camara pelo Utilizador
//#endregion

//#region Definir Raycaster
let raycaster = new THREE.Raycaster(); //Cria um Raycaster
let mouse = new THREE.Vector2(); //Cria Um Vetor que Simboliza o Mouse

//Quando clica na janela, obtem a posição do rato
document.getElementById("productImage7").onclick = function (event) {
  controls.autoRotate = false;
  controls.update();
  event.preventDefault();
  var rect = event.target.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
  console.log("X:"+mouse.x)
  mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
  console.log("Y:"+ mouse.y)
  catchFirst(); //identifica o Primeiro Objeto em
};

//Identifica o Primeiro Objeto em Contacto com o Raycaster
function catchFirst() {
  raycaster.setFromCamera(mouse, camera); //Define o Raycaster através da Camara
  let intersectedArray = raycaster.intersectObjects(furniturePieces); //Objetos intersected pelo Raycaster
  if (intersectedArray.length > 0) {
    let intersectedObject = intersectedArray[0].object;
    OpenClose(intersectedObject);
  }
}
//#endregion

//#region Abrir Fechar Partes do Móvel
//Abre/Fecha Partes Amovíveis com Base no Raycast
function OpenClose(intersectedObject) {
  if (intersectedObject.name.includes("doorRight")) {
    if (doorRightIsOpen == false) {
      doorRightIsOpen = true;
      acaoOpenDoorRight.paused = false;
      acaoOpenDoorRight.setLoop(THREE.LoopOnce);
      doorRightIntTimeScale = doorRightIntTimeScale * -1;
      acaoOpenDoorRight.timeScale = doorRightIntTimeScale;
      acaoOpenDoorRight.clampWhenFinished = true;
      acaoOpenDoorRight.play();
    } else {
      doorRightIsOpen = false;
      acaoOpenDoorRight.paused = false;
      acaoOpenDoorRight.setLoop(THREE.LoopOnce);
      doorRightIntTimeScale = doorRightIntTimeScale * -1;
      acaoOpenDoorRight.timeScale = doorRightIntTimeScale;
      acaoOpenDoorRight.clampWhenFinished = true;
      acaoOpenDoorRight.play();
    }
  }
  if (intersectedObject.name.includes("doorLeft")) {
    if (doorLeftIsOpen == false) {
      doorLeftIsOpen = true;
      acaoOpenDoorLeft.paused = false;
      acaoOpenDoorLeft.setLoop(THREE.LoopOnce);
      doorLeftIntTimeScale = doorLeftIntTimeScale * -1;
      acaoOpenDoorLeft.timeScale = doorLeftIntTimeScale;
      acaoOpenDoorLeft.clampWhenFinished = true;
      acaoOpenDoorLeft.play();
    } else {
      doorLeftIsOpen = false;
      acaoOpenDoorLeft.paused = false;
      acaoOpenDoorLeft.setLoop(THREE.LoopOnce);
      doorLeftIntTimeScale = doorLeftIntTimeScale * -1;
      acaoOpenDoorLeft.timeScale = doorLeftIntTimeScale;
      acaoOpenDoorLeft.clampWhenFinished = true;
      acaoOpenDoorLeft.play();
    }
  }
  if (intersectedObject.name.includes("drawerUp")) {
    if (drawerUpIsOpen == false) {
      drawerUpIsOpen = true;
      acaoOpenDrawerUp.paused = false;
      acaoOpenDrawerUp.setLoop(THREE.LoopOnce);
      drawerUpIntTimeScale = drawerUpIntTimeScale * -1;
      acaoOpenDrawerUp.timeScale = drawerUpIntTimeScale;
      acaoOpenDrawerUp.clampWhenFinished = true;
      acaoOpenDrawerUp.play();
    } else {
      drawerUpIsOpen = false;
      acaoOpenDrawerUp.paused = false;
      acaoOpenDrawerUp.setLoop(THREE.LoopOnce);
      drawerUpIntTimeScale = drawerUpIntTimeScale * -1;
      acaoOpenDrawerUp.timeScale = drawerUpIntTimeScale;
      acaoOpenDrawerUp.clampWhenFinished = true;
      acaoOpenDrawerUp.play();
    }
  }
  if (intersectedObject.name.includes("drawerDown")) {
    if (drawerDownIsOpen == false) {
      drawerDownIsOpen = true;
      acaoOpenDrawerDown.paused = false;
      acaoOpenDrawerDown.setLoop(THREE.LoopOnce);
      drawerDownIntTimeScale = drawerDownIntTimeScale * -1;
      acaoOpenDrawerDown.timeScale = drawerDownIntTimeScale;
      acaoOpenDrawerDown.clampWhenFinished = true;
      acaoOpenDrawerDown.play();
    } else {
      drawerDownIsOpen = false;
      acaoOpenDrawerDown.paused = false;
      acaoOpenDrawerDown.setLoop(THREE.LoopOnce);
      drawerDownIntTimeScale = drawerDownIntTimeScale * -1;
      acaoOpenDrawerDown.timeScale = drawerDownIntTimeScale;
      acaoOpenDrawerDown.clampWhenFinished = true;
      acaoOpenDrawerDown.play();
    }
  }
}
//#endregion

//#region Update/Render LOOP
var relogio = new THREE.Clock();
var misturador = new THREE.AnimationMixer(scene);

animar();
function animar() {
  requestAnimationFrame(animar);
  controls.update();
  renderer.render(scene, camera);
  misturador.update(relogio.getDelta());
}
//#endregion

//#region Botões

//#region Esconder/Mostrar Decoração
document.getElementById("btn_decor").onclick = function hideDecor() {
  setTimeout(function () {
    //Esconder após animação
    for (const i in decor) {
      decor[i].visible = !decor[i].visible;
    }
  }, 2000);
  //Animação
  if (isDecorViewEnabled == true) {
    gsap
      .to(controls.target, 2, {
        x: 0,
        y: 2,
        z: 0, // target position of the camera
        ease: Power4.easeInOut, // easing function
      })
      .play(); // start the animation
  } else {
    gsap
      .to(controls.target, 2, {
        x: 0,
        y: 5,
        z: 0, // target position of the camera
        ease: Power4.easeInOut, // easing function
      })
      .play(); // start the animation
  }
  isDecorViewEnabled = !isDecorViewEnabled;
  controls.update();
};
//#endregion

//#region Mudar Madeira

//Pinho
document.getElementById("btn_top_pinho").onclick = function changeTopPinho() {
  scene.getObjectByName("top").material = Pinho;
};

//Marmore
document.getElementById("btn_top_marble").onclick = function changeTopMarble() {
  scene.getObjectByName("top").material = Marble;
};

//Vidro Branco
document.getElementById("btn_top_whiteGlass").onclick =
  function changeTopWhiteGlass() {
    scene.getObjectByName("top").material = WhiteGlass;
  };

//Vidro Escurecido
document.getElementById("btn_top_darkGlass").onclick =
  function changeTopDarkGlass() {
    scene.getObjectByName("top").material = DarkGlass;
  };

//Carvalho
document.getElementById("btn_top_plywood").onclick =
  function changeTopPlywood() {
    scene.getObjectByName("top").material = Plywood;
  };
//#endregion

//#region Mudar Madeira
//Carvalho
document.getElementById("btn_plywood").onclick = function changeWoodPlywood() {
  scene.getObjectByName("rack").material = Plywood;
  scene.getObjectByName("legs").material = Plywood;
  scene.getObjectByName("drawerUp").material = Plywood;
  scene.getObjectByName("drawerDown").material = Plywood;
  scene.getObjectByName("drawerUp-Bottom").material = Plywood;
  scene.getObjectByName("drawerDown-Bottom").material = Plywood;
  scene.getObjectByName("doorRight").material = Plywood;
  scene.getObjectByName("doorLeft").material = Plywood;
  scene.getObjectByName("shelf").material = Plywood;
};

//Pinho
document.getElementById("btn_pinho").onclick = function changeWoodPinho() {
  scene.getObjectByName("rack").material = Pinho;
  scene.getObjectByName("legs").material = Pinho;
  scene.getObjectByName("drawerUp").material = Pinho;
  scene.getObjectByName("drawerDown").material = Pinho;
  scene.getObjectByName("drawerUp-Bottom").material = Pinho;
  scene.getObjectByName("drawerDown-Bottom").material = Pinho;
  scene.getObjectByName("doorRight").material = Pinho;
  scene.getObjectByName("doorLeft").material = Pinho;
  scene.getObjectByName("shelf").material = Pinho;
};
//#endregion

//#region Mudar Janela
//Janela em Vidro
document.getElementById("btn_window_glass").onclick =
  function changeWindowGlass() {
    scene.getObjectByName("doorRight-Window").material = glass;
    scene.getObjectByName("doorLeft-Window").material = glass;
  };

//Janela em Vime
document.getElementById("btn_window_wicker").onclick =
  function changeWindowWicker() {
    scene.getObjectByName("doorRight-Window").material = doorDefault;
    scene.getObjectByName("doorLeft-Window").material = doorDefault;
  };
//#endregion

//#region Mudar Puxadores
//Puxadores Modernos
document.getElementById("btn_handler_modern").onclick =
  function changeHandlerModern() {
    scene.getObjectByName("doorRight-Handler").visible = false;
    scene.getObjectByName("doorLeft-Handler").visible = false;
    scene.getObjectByName("drawerUp-Handler").visible = false;
    scene.getObjectByName("drawerDown-Handler").visible = false;
    scene.getObjectByName("doorRight-Handler2").visible = true;
    scene.getObjectByName("doorLeft-Handler2").visible = true;
    scene.getObjectByName("drawerUp-Handler2").visible = true;
    scene.getObjectByName("drawerDown-Handler2").visible = true;
    scene.getObjectByName("doorRight-Handler3").visible = false;
    scene.getObjectByName("doorLeft-Handler3").visible = false;
    scene.getObjectByName("drawerUp-Handler3").visible = false;
    scene.getObjectByName("drawerDown-Handler3").visible = false;
  };

//Puxadores em Pele
document.getElementById("btn_handler_leather").onclick =
  function changeHandlerLeather() {
    scene.getObjectByName("doorRight-Handler").visible = false;
    scene.getObjectByName("doorLeft-Handler").visible = false;
    scene.getObjectByName("drawerUp-Handler").visible = false;
    scene.getObjectByName("drawerDown-Handler").visible = false;
    scene.getObjectByName("doorRight-Handler2").visible = false;
    scene.getObjectByName("doorLeft-Handler2").visible = false;
    scene.getObjectByName("drawerUp-Handler2").visible = false;
    scene.getObjectByName("drawerDown-Handler2").visible = false;
    scene.getObjectByName("doorRight-Handler3").visible = true;
    scene.getObjectByName("doorLeft-Handler3").visible = true;
    scene.getObjectByName("drawerUp-Handler3").visible = true;
    scene.getObjectByName("drawerDown-Handler3").visible = true;
  };

//Puxadores Clássicos
document.getElementById("btn_handler_classic").onclick =
  function changeHandlerClassic() {
    scene.getObjectByName("doorRight-Handler").visible = true;
    scene.getObjectByName("doorLeft-Handler").visible = true;
    scene.getObjectByName("drawerUp-Handler").visible = true;
    scene.getObjectByName("drawerDown-Handler").visible = true;
    scene.getObjectByName("doorRight-Handler2").visible = false;
    scene.getObjectByName("doorLeft-Handler2").visible = false;
    scene.getObjectByName("drawerUp-Handler2").visible = false;
    scene.getObjectByName("drawerDown-Handler2").visible = false;
    scene.getObjectByName("doorRight-Handler3").visible = false;
    scene.getObjectByName("doorLeft-Handler3").visible = false;
    scene.getObjectByName("drawerUp-Handler3").visible = false;
    scene.getObjectByName("drawerDown-Handler3").visible = false;
  };
//#endregion

//#region Mudar Pés
// Montado na Parede
document.getElementById("btn_feet_none").onclick = function hideShowLegs() {
  scene.getObjectByName("legs").visible = false;
  scene.getObjectByName("legs2").visible = false;
};

//Pés Integrados
document.getElementById("btn_feet_classic").onclick =
  function hideShowLegsClassic() {
    scene.getObjectByName("legs").visible = true;
    scene.getObjectByName("legs2").visible = false;
  };

//Pés Modernos
document.getElementById("btn_feet_modern").onclick =
  function hideShowLegsModern() {
    scene.getObjectByName("legs").visible = false;
    scene.getObjectByName("legs2").visible = true;
  };
//#endregion

//#region Vistas
//VistaFrente
document.getElementById("btn_frontView").onclick = function frontView() {
  controls.autoRotate = false;
  gsap
    .to(camera.position, 2, {
      x: 0,
      y: 5,
      z: 20, // target position of the camera
      ease: Power4.easeInOut, // easing function
    })
    .play(); // start the animation
};

//VistaBaixo
document.getElementById("btn_backView").onclick = function backView() {
  controls.autoRotate = false;
  gsap
    .to(camera.position, 2, {
      x: -1.4076543736997558,
      y: 5,
      z: -22, // target position of the camera
      ease: Power4.easeInOut, // easing function
    })
    .play(); // start the animation
};

//VistaTopo
document.getElementById("btn_topView").onclick = function topView() {
  controls.autoRotate = false;
  gsap
    .to(camera.position, 2, {
      x: 0,
      y: 25,
      z: 0, // target position of the camera
      ease: Power4.easeInOut, // easing function
    })
    .play(); // start the animation
};

//VistaBaixo
document.getElementById("btn_downView").onclick = function downView() {
  controls.autoRotate = false;
  gsap
    .to(camera.position, 2, {
      x: 0,
      y: -20,
      z: 0, // target position of the camera
      ease: Power4.easeInOut, // easing function
    })
    .play(); // start the animation
};

//VistaDireita
document.getElementById("btn_rightView").onclick = function rightView() {
  controls.autoRotate = false;
  gsap
    .to(camera.position, 2, {
      x: -25,
      y: 5,
      z: 0, // target position of the camera
      ease: Power4.easeInOut, // easing function
    })
    .play(); // start the animation
};

//VistaEsquerda
document.getElementById("btn_leftView").onclick = function leftView() {
  controls.autoRotate = false;
  gsap
    .to(camera.position, 2, {
      x: 25,
      y: 5,
      z: 0, // target position of the camera
      ease: Power4.easeInOut, // easing function
    })
    .play(); // start the animation
};
//#endregion

//#region Modo Diurno / Noturno
document.getElementById("btn_night").onclick = function leftView() {
  if (isNight == false) {
    //Ativar Modo Noturno
    rectLight.intensity = 10;
    rectLight.intensity = 150;
    light.intensity = 0.75;
    new THREE.RGBELoader()
      .setDataType(THREE.UnsignedByteType)
      .load(
        "assets/SceneEnvironments/StudioLighting_Night.hdr",
        function (texture) {
          const envMap = pmremGenerator.fromEquirectangular(texture).texture;
          scene.environment = envMap;
          texture.dispose();
          pmremGenerator.dispose();
        }
      );
    new THREE.RGBELoader()
      .setDataType(THREE.UnsignedByteType)
      .load(
        "assets/SceneEnvironments/StudioLighting_Night_World.hdr",
        function (texture) {
          const envMap = pmremGenerator.fromEquirectangular(texture).texture;
          scene.background = envMap;
          texture.dispose();
          pmremGenerator.dispose();
        }
      );
    isNight = true;
  } else {
    //Ativar Modo Diurno
    light.intensity = 1;
    rectLight.intensity = 0;
    rectLight2.intensity = 0;
    new THREE.RGBELoader()
      .setDataType(THREE.UnsignedByteType)
      .load(
        "assets/SceneEnvironments/StudioLighting_Day.hdr",
        function (texture) {
          const envMap = pmremGenerator.fromEquirectangular(texture).texture;
          scene.environment = envMap;
          texture.dispose();
          pmremGenerator.dispose();
        }
      );
    scene.background = new THREE.Color(0xf4f3f1); //LIGHT BACKGROUND
    isNight = false;
  }
};
//#endregion

//#endregion
