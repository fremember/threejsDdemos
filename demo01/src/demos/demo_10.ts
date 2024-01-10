import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function testGeometry() {
    const w = window.innerWidth,
        h = window.innerHeight,
        stat = new Stat(),
        scene = new Three.Scene();
    
    const cube = new Three.Mesh(
        new Three.BoxGeometry(1, 1, 1),
        new Three.MeshBasicMaterial({
            color: 0xff0000
        })
    )
    scene.add(cube)

    const sphere = new Three.Mesh(
        new Three.SphereGeometry(0.5),
        new Three.MeshNormalMaterial()
    )
    sphere.position.y = 1.5
    scene.add(sphere)

    const plane = new Three.Mesh(
        new Three.PlaneGeometry(2, 2),
        new Three.MeshBasicMaterial({
            color: 0x00ffff,
            side: Three.DoubleSide
        })
    )
    plane.position.y = -1
    plane.rotation.x = 0.5 * Math.PI
    scene.add(plane)

    const light = new Three.AmbientLight()
    scene.add(light)

    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 1000)
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(w, h)
    renderer.render(scene, camera)

    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stat.dom)
    
    const orbitControls = new OrbitControls(camera, renderer.domElement)
    // const clock = new Three.Clock()

    function tick() {
        // const time = clock.getElapsedTime()
        requestAnimationFrame(tick)
        renderer.render(scene, camera)
        stat.update()
        orbitControls.update()
    }
    tick()
}