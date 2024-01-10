import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function testRoad() {
    let w = window.innerWidth,
        h = window.innerHeight;
    const scene = new Three.Scene(),
        stat = new Stat();
    
    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 100)
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)

    scene.add(new Three.AmbientLight(0xffffff, 0.2))
    const directional = new Three.DirectionalLight(0xffffff)
    directional.position.set(0, 1, 1)
    scene.add(directional)

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(w, h)
    // 设置背景色，默认是黑色
    renderer.setClearColor(0x95e4e8)
    renderer.shadowMap.enabled = true
    renderer.render(scene, camera)

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

        // camera
        camera.aspect = w / h
        camera.updateProjectionMatrix()

        // render
        renderer.setSize(w, h)
    })
}