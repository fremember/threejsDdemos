import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

export default function testShadow() {
    let w = window.innerWidth,
        h = window.innerHeight;
    const stat = new Stat(),
        gui = new dat.GUI(),
        scene = new Three.Scene();

    const light = new Three.AmbientLight(0xffffff, 0.2)
    scene.add(light)

    // 能够产生阴影的灯光有：directional、spotLight、pointLight
    const directional = new Three.DirectionalLight(0xffffff, 1)
    directional.position.set(1, 1, 1)
    // 灯光产生阴影
    directional.castShadow = true
    directional.shadow.mapSize.width = 2048
    directional.shadow.mapSize.height = 2048
    scene.add(directional)

    const directionalFolder = gui.addFolder('光线位置')
    directionalFolder.add(directional.position, 'x', -5, 5, 0.01).name('x')
    directionalFolder.add(directional.position, 'y', -5, 5, 0.01).name('y')
    directionalFolder.add(directional.position, 'z', -5, 5, 0.01).name('z')

    const plane = new Three.Mesh(
        new Three.PlaneGeometry(4, 4),
        new Three.MeshStandardMaterial({
            color: 0xcccccc
        })
    )
    // 接收阴影
    plane.receiveShadow = true
    scene.add(plane)

    const sphere = new Three.Mesh(
        new Three.SphereGeometry(0.5),
        new Three.MeshStandardMaterial({
            color: 0xffff00
        })
    )
    sphere.position.z = 0.5
    sphere.rotation.x = -0.5 * Math.PI
    // 物体形成阴影
    sphere.castShadow = true
    scene.add(sphere)
    
    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 1000)
    camera.position.set(0, 1, 3)
    camera.lookAt(0, 0, 0)

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(w, h)
    // 允许渲染器显示阴影
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = Three.PCFSoftShadowMap;
    renderer.render(scene, camera)
    
    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stat.dom)

    const clock = new Three.Clock(),
        orbitControls = new OrbitControls(camera, renderer.domElement);
    
    function tick() {
        const time = clock.getElapsedTime()
        sphere.position.z = Math.abs(Math.sin(time)) + 0.5
        renderer.render(scene, camera)
        stat.update()
        orbitControls.update()
        requestAnimationFrame(tick)
    }
    tick()

    // 窗口自适应大小
    window.addEventListener('resize', () => {
        w = window.innerWidth
        h = window.innerHeight

        camera.aspect = w / h
        camera.updateProjectionMatrix()

        renderer.setSize(w, h)
    })
    // 鼠标移动
    // window.addEventListener('mousemove', (e: MouseEvent) => {
    //     const mousePosX = (e.clientX / w  - 0.5) * 2
    //     const mousePosY = (e.clientX / h  - 0.5) * 2
    //     console.log(mousePosX, mousePosY)
    //     camera.position.x = -mousePosX
    //     camera.position.y = mousePosY
    // })
}