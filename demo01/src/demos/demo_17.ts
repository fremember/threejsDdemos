import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import t1 from './../img/t1.jpg'
import front from './../img/flowers/front.png'
import back from './../img/flowers/back.png'
import top from './../img/flowers/top.png'
import right from './../img/flowers/right.png'
import bottom from './../img/flowers/bottom.png'
import left from './../img/flowers/left.png'

export default function testTexture() {
    let w = window.innerWidth,
        h = window.innerHeight;
    const stat = new Stat(),
        scene = new Three.Scene();
    
    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 100)
    camera.position.set(0, 1, 3)
    camera.lookAt(0, 0, 0)

    const light = new Three.DirectionalLight(0xffffff)
    light.position.set(1, 1, 1)
    light.castShadow = true
    scene.add(light)

    scene.add(new Three.AmbientLight(0xffffff, 0.2))

    const loader = new Three.TextureLoader()
    const texture = loader.load('https://threejs.org/manual/resources/images/compressed-but-large-wood-texture.jpg')
    const texture2 = loader.load('https://threejs.org/manual/resources/images/mip-low-res-enlarged.png')
    const texture3 = loader.load(t1)
    const planeG = new Three.PlaneGeometry(2, 2)
    const planeM = new Three.MeshStandardMaterial({
        // color: 0xff0000,
        map: texture,
        side: Three.DoubleSide
    })
    const plane = new Three.Mesh(planeG, planeM)
    plane.rotation.x = -0.5 * Math.PI
    plane.receiveShadow = true
    scene.add(plane)

    // 单一材质
    // const cube = new Three.Mesh(
    //     new Three.BoxGeometry(1, 1, 1),
    //     new Three.MeshStandardMaterial({
    //         // map: texture2
    //         map: texture3
    //     })
    // )
    // cube.position.y = 0.501
    // cube.castShadow = true
    // scene.add(cube)

    // 多种材质
    const textureImgs = [front, back, top, right, bottom, left]
    function getTextures(): any[] {
        const _textures: any[] = []
        textureImgs.forEach(t => {
            _textures.push(
                new Three.MeshStandardMaterial({
                    map: loader.load(t)
                })
            )
        })
        return _textures
    }
    const cube = new Three.Mesh(
        new Three.BoxGeometry(1, 1, 1),
        getTextures()
    )
    cube.position.y = 0.5
    scene.add(cube)
    
    const sphere = new Three.Mesh(
        new Three.SphereGeometry(0.25),
        new Three.MeshStandardMaterial({
            map: texture3
        })
    )
    sphere.position.y = 0.256
    sphere.castShadow = true
    // scene.add(sphere)

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(w, h)
    renderer.setClearColor(0x95e4e8)
    renderer.shadowMap.enabled = true

    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stat.dom)
    

    const clock = new Three.Clock(),
        orbitControls = new OrbitControls(camera, renderer.domElement);
    
    function tick() {
        const time = clock.getElapsedTime()
        requestAnimationFrame(tick)
        renderer.render(scene, camera)
        camera.updateProjectionMatrix()
        stat.update()
        orbitControls.update()
    }
    tick()

    window.addEventListener('resize', () => {
        w = window.innerWidth
        h = window.innerHeight

        camera.aspect = w / h
        camera.updateProjectionMatrix()

        renderer.setSize(w, h)
    })
}