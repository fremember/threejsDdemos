/*
 * @Author: fremember
 * @Date: 2024-03-09 15:03:31
 * @Description: 
 */
import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

export default function environmentMapHdr() {
    const w = window.innerWidth,
        h = window.innerHeight,
        stat = new Stat(),
        scene = new Three.Scene();
    
    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 100)
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)

    const light = new Three.AmbientLight(0xffffff, 0.2),
        directionalLight = new Three.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 5, 5)
    scene.add(light, directionalLight)

    const axes = new Three.AxesHelper(1)
    scene.add(axes)

    const rgbeLoader = new RGBELoader()
    rgbeLoader.loadAsync('./public/textures/hdr/002.hdr').then((texture: any) => {
        texture.mapping = Three.EquirectangularReflectionMapping
        scene.background = texture
        scene.environment = texture
    })

    const sphereGeometry = new Three.SphereGeometry(1, 20, 20),
        material = new Three.MeshStandardMaterial({
            metalness: 0.7,
            roughness: 0.1,
        }),
        sphere = new Three.Mesh(sphereGeometry, material);
    scene.add(sphere)

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(w, h)

    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stat.dom)

    const orbitControls = new OrbitControls(camera, renderer.domElement)

    function tick() {
        requestAnimationFrame(tick)
        renderer.render(scene, camera)
        stat.update()
        orbitControls.update()
    }

    tick()
}