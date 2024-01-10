import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function testMovings() {
    const w = window.innerWidth,
        h = window.innerHeight,
        stat = new Stat();
    
    const scene = new Three.Scene()
    // const geometry = new Three.BoxGeometry(1, 1, 1)
    // const material = new Three.MeshBasicMaterial()
    // const cube = new Three.Mesh(geometry, material)
    // scene.add(cube)
    function getCube (color: any) {
        const geometry = new Three.BoxGeometry(1, 1, 1)
        const material = new Three.MeshBasicMaterial({
            color
        })
        return new Three.Mesh(geometry, material)
    }
    const cube1 = getCube(0xff0000)
    const cube2 = getCube(0x00ff00)
    const cube3 = getCube(0x0000ff)
    cube1.position.y = 1.5
    cube2.position.y = 0
    cube3.position.y = -1.5
    scene.add(cube1)
    scene.add(cube2)
    scene.add(cube3)

    const light = new Three.AmbientLight()
    scene.add(light)

    const axes = new Three.AxesHelper(1)
    scene.add(axes)

    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 1000)
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(w, h)
    renderer.render(scene, camera)

    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stat.dom)

    const orbitControls = new OrbitControls(camera, renderer.domElement)
    const clock = new Three.Clock()

    function tick() {
        const time = clock.getElapsedTime()
        cube1.rotation.z = time
        cube2.rotation.z = time
        cube3.rotation.z = time
        // cube.position.x = Math.cos(time * 2) * 2
        // cube.position.y = Math.sin(time * 2) * 2
        requestAnimationFrame(tick)
        renderer.render(scene, camera)
        stat.update()
        orbitControls.update()
    }

    tick()
}