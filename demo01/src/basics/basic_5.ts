import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import * as dat from 'dat.gui'
// import gsap from 'gsap'

export default function basicTriangle() {
    const w = window.innerWidth,
        h = window.innerHeight,
        stat = new Stat(),
        scene = new Three.Scene();
    
    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 100)
    camera.position.set(0, 0, 8)
    camera.lookAt(0, 0, 0)

    const light = new Three.AmbientLight(0xffffff, 0.2)
    scene.add(light)

    const axes = new Three.AxesHelper(1)
    scene.add(axes)
    
    // 创建50个三角形
    for (let i = 0; i < 50; i++) {
        const color = new Three.Color(Math.random(), Math.random(), Math.random())
        const material = new Three.MeshBasicMaterial({ color, transparent: true, opacity: 0.5 })
        const geometry = new Three.BufferGeometry()
        const positionArray = new Float32Array(9)
        // 每个三角形有三个顶点，每个顶点坐标(x, y, z)三个值
        for (let j = 0; j < 9; j++) {
            positionArray[j] = Math.random() * 6 - 3
        }
        geometry.setAttribute('position', new Three.BufferAttribute(positionArray, 3))

        const mesh = new Three.Mesh(geometry, material)
        scene.add(mesh)
    }


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