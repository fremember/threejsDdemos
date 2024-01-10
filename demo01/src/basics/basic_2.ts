import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function basicLine() {
    let w = window.innerWidth,
        h = window.innerHeight;
    const stat = new Stat(),
        scene = new Three.Scene();

    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 100)
    camera.position.set(0, 0, 10)
    camera.lookAt(0, 0, 10)

    const material = new Three.LineBasicMaterial({ color: 0x0000ff })
    const points = []
    points.push(new Three.Vector3(-5, 0, 0))
    points.push(new Three.Vector3(0, 5, 0))
    points.push(new Three.Vector3(5, 0, 0))
    const geometry = new Three.BufferGeometry().setFromPoints(points)
    const line = new Three.Line(geometry, material)
    scene.add(line)

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(w, h)
    renderer.render(scene, camera)

    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stat.dom)

}