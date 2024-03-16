/*
 * @Author: fremember
 * @Date: 2024-03-09 17:03:43
 * @Description: 
 */
import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

export default function spotLightShadow() {
    const w = window.innerWidth,
        h = window.innerHeight,
        stat = new Stat(),
        gui = new dat.GUI(),
        scene = new Three.Scene();
    
    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 1000)
    camera.position.set(0, 0, 10)
    camera.lookAt(0, 0, 0)
    scene.add(camera)

    const axes = new Three.AxesHelper(2)
    scene.add(axes)

    const planeGeometry = new Three.PlaneGeometry(10, 10),
        material = new Three.MeshStandardMaterial(),
        plane = new Three.Mesh(planeGeometry, material);
    plane.receiveShadow = true
    plane.position.set(0, -1, 0)
    plane.rotation.x = -Math.PI / 2
    scene.add(plane)

    const sphereGeometry = new Three.SphereGeometry(1, 20, 20),
        sphere = new Three.Mesh(sphereGeometry, material);
    sphere.castShadow = true
    scene.add(sphere)

    const light = new Three.AmbientLight(0xffffff, 0.2),
        spotLight = new Three.SpotLight(0xffffff, 1);
    spotLight.castShadow = true
    spotLight.position.set(5, 5, 5)
    spotLight.intensity = 2 // 光源的强度
    spotLight.shadow.radius = 4
    spotLight.shadow.mapSize.set(2048, 2048)
    spotLight.target = sphere
    spotLight.angle = Math.PI / 6
    spotLight.distance = 0
    spotLight.penumbra = 0
    spotLight.decay = 0
    scene.add(light, spotLight)

    gui.add(sphere.position, 'x').min(-5).max(5).step(0.1)
    gui
        .add(spotLight, 'angle')
        .min(0)
        .max(Math.PI / 2)
        .step(0.01)
    gui.add(spotLight, 'distance').min(0).max(10).step(0.01)
    gui.add(spotLight, 'penumbra').min(0).max(1).step(0.01)
    gui.add(spotLight, 'decay').min(0).max(5).step(0.01)

    const renderer = new Three.WebGLRenderer()
    renderer.shadowMap.enabled = true
    renderer.setSize(w, h)

    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stat.dom)

    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.enableDamping = true // 设置控制器阻尼，让控制器更有真实效果，必须在动画循环里调用 .update()

    function tick() {
        requestAnimationFrame(tick)
        renderer.render(scene, camera)
        stat.update()
        orbitControls.update()
    }

    tick()
}