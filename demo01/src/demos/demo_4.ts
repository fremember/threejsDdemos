import  * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'

export default function testStat() {
    const w = window.innerWidth,
        h = window.innerHeight;
    
    const stat = new Stat()
    
    // 创建一个场景
    const scene = new Three.Scene()

    // 创建骨架
    const geometry = new Three.BoxGeometry(1, 1, 1)
    // 创建材质
    const material = new Three.MeshBasicMaterial({
        color: 0xff0000
    })
    // 创建立方体
    const cube = new Three.Mesh(geometry, material)
    scene.add(cube)

    // 创建坐标参考系
    const axes = new Three.AxesHelper(1)
    scene.add(axes)

    // 创建一个摄像机
    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 1000)
    // 设置相机位置
    camera.position.set(0, 0, 5)
    // 设置相机朝向
    camera.lookAt(0, 0, 0)

    // 创建渲染器
    const renderer = new Three.WebGLRenderer()
    // 设置渲染器大小
    renderer.setSize(w, h)
    // 渲染
    renderer.render(scene, camera)

    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stat.dom)

    const clock = new Three.Clock()
    function tick() {
        const time = clock.getElapsedTime()
        cube.rotation.z = time
        cube.position.x = Math.cos(time * 2) * 2
        cube.position.y = Math.sin(time * 2) * 2
        requestAnimationFrame(tick)
        renderer.render(scene, camera)
        stat.update()
    }

    tick()
}