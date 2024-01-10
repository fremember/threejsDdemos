import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function basicCube() {
    let w = window.innerWidth,
        h = window.innerHeight;
    const stat = new Stat(),
        scene = new Three.Scene();
    // 创建环境光
    const light = new Three.AmbientLight(0xffffff, 0.2)
    scene.add(light)

    // 创建摄像机
    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 100)
    camera.position.set(0, 1, 3)
    camera.lookAt(0, 0, 0)

    // 坐标系
    const axes = new Three.AxesHelper(1)
    scene.add(axes)

    // 创建立方体
    const cube = new Three.Mesh(
        new Three.BoxGeometry(1, 1, 1),
        new Three.MeshBasicMaterial({ color: 0xff0000 })
    )
    scene.add(cube)
    
    // 创建渲染器
    const renderer = new Three.WebGLRenderer()
    // 设置背景颜色，默认是黑色
    renderer.setClearColor(0x333333, 0.2)
    renderer.setSize(w, h)

    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stat.dom)

    const clock = new Three.Clock(),
        orbitControls = new OrbitControls(camera, renderer.domElement);
    
    function tick() {
        const time = clock.getElapsedTime()

        cube.rotation.z = time

        requestAnimationFrame(tick)
        camera.updateProjectionMatrix()
        renderer.render(scene, camera)
        stat.update()
        orbitControls.update()
    }
    tick()

    window.addEventListener('resize', () => {
        w = window.innerWidth
        h = window.innerHeight

        camera.aspect = w / h
        camera.updateProjectionMatrix()
        
        renderer.setSize(w, h)
    })
}