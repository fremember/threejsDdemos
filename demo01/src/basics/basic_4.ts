import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import * as dat from 'dat.gui'
// import gsap from 'gsap'

export default function basicBufferGeometry() {
    const w = window.innerWidth,
        h = window.innerHeight,
        stat = new Stat(),
        // gui = new dat.GUI(),
        scene = new Three.Scene();
    
    // 添加摄像机
    const camera = new Three.PerspectiveCamera(75, w / h,  0.1, 100)
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)

    // 添加环境光
    const light = new Three.AmbientLight(0xffffff, 0.2)
    scene.add(light)

    // 添加坐标参考
    const axes = new Three.AxesHelper(1)
    scene.add(axes)

    const material = new Three.MeshBasicMaterial({ color: 0xffff00 })
    const geometry = new Three.BufferGeometry(),
        vertices = new Float32Array([ // 顶点坐标（）
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, -1.0, 1.0
        ]);
    // 设置骨架的顶点坐标，以3个点为一个坐标
    geometry.setAttribute('position', new Three.BufferAttribute(vertices, 3))

    const mesh = new Three.Mesh(geometry, material)
    scene.add(mesh)
    // 添加渲染器
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