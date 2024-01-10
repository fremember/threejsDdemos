import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function testMouseControl() {
    const w = window.innerWidth,
        h = window.innerHeight;

    const stat = new Stat()

    // 创建一个场景
    const scene = new Three.Scene()

    // const geometry = new Three.BoxGeometry(1, 1, 1)
    // const material = new Three.MeshBasicMaterial()

    const geometry = new Three.SphereGeometry(1)
    const material = new Three.MeshNormalMaterial()

    const cube = new Three.Mesh(geometry, material)
    scene.add(cube)

    const axes = new Three.AxesHelper(1)
    scene.add(axes)

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

    // 创建控制器
    const orbitControls = new OrbitControls(camera, renderer.domElement)

    // const clock = new Three.Clock()
    function tick() {
        // const time = clock.getElapsedTime()
        // cube.rotation.z = time
        // cube.position.x = Math.cos(time * 2) * 2
        // cube.position.y = Math.sin(time * 2) * 2
        requestAnimationFrame(tick)
        renderer.render(scene, camera)
        stat.update()
        orbitControls.update()
    }

    tick()
}