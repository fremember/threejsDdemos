/*
 * @Author: fremember
 * @Date: 2024-03-10 10:55:47
 * @Description: 
 */
import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

export default function pointLightShadow() {
    const w = window.innerWidth,
        h = window.innerHeight,
        stat = new Stat(),
        gui = new dat.GUI(),
        scene = new Three.Scene();
    
    const axes = new Three.AxesHelper(2)
    scene.add(axes)

    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 1000)
    camera.position.set(0, 0, 10)
    camera.lookAt(0, 0, 0)
    scene.add(camera)

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

    const smallBall = new Three.Mesh(
        new Three.SphereGeometry(0.1, 20, 20),
        new Three.MeshBasicMaterial({ color: 0xff0000 })
    )
    smallBall.position.set(2, 2, 2)

    const light = new Three.AmbientLight(0xffffff, 0.2),
        pointLight = new Three.PointLight(0xff0000, 1);
    pointLight.position.set(5, 5, 5)
    pointLight.castShadow = true
    pointLight.shadow.radius = 4
    pointLight.shadow.mapSize.set(2048, 2048)
    pointLight.decay = 0
    pointLight.distance = 0
    
    // 小球绑定点光源
    smallBall.add(pointLight)

    scene.add(light, smallBall)

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(w, h)
    renderer.shadowMap.enabled = true

    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stat.dom)

    const orbitControls = new OrbitControls(camera, renderer.domElement),
        clock = new Three.Clock();

    function tick() {
        const time = clock.getElapsedTime()
        smallBall.position.x = Math.cos(time) * 3
        smallBall.position.z = Math.sin(time) * 3
        smallBall.position.y = 2 + Math.sin(time) / 2
        requestAnimationFrame(tick)
        renderer.render(scene, camera)
        stat.update()
        orbitControls.update()
    }
    tick()
}