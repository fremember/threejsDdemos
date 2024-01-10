import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

export default function testDat() {
    const w = window.innerWidth,
        h = window.innerHeight,
        stat = new Stat(),
        gui = new dat.GUI(),
        scene = new Three.Scene();

    const cubeControls = {
        color: 0xff0000
    }
    const cubeM = new Three.MeshBasicMaterial({
        color: cubeControls.color
    })
    
    const cube = new Three.Mesh(
        new Three.BoxGeometry(1, 1, 1),
        cubeM
    )
    scene.add(cube)

    const axes = new Three.AxesHelper(1)
    scene.add(axes)

    const light = new Three.AmbientLight()
    scene.add(light)

    const camera = new Three.PerspectiveCamera(75, w / h,  0.1, 1000)
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)

    // 添加页面交互控制 - 控制设相机位置
    // gui.add(camera.position, 'x', -5, 5, 0.01).name('相机位置-x')
    // gui.add(camera.position, 'y', -5, 5, 0.01).name('相机位置-y')
    // gui.add(camera.position, 'z', -5, 5, 0.01).name('相机位置-z')

    // 添加页面交互控制 - 控制设相机位置 - 折叠形式
    const cameraPosition = gui.addFolder('相机位置')
    cameraPosition.add(camera.position, 'x', -5, 5, 0.01).name('x')
    cameraPosition.add(camera.position, 'y', -5, 5, 0.01).name('y')
    cameraPosition.add(camera.position, 'z', -5, 5, 0.01).name('z')

    // 添加页面交互控制 - 控制 cube 位置
    const cubePosition = gui.addFolder('cube位置')
    cubePosition.add(cube.position, 'x', -3, 3).name('x')
    cubePosition.add(cube.position, 'y', -3, 3).name('y')
    cubePosition.add(cube.position, 'z', -3, 3).name('z')
    gui.addColor(cubeControls, 'color', 0x000000, 0xffffff).name('立方体颜色').onChange(() => {
        // cubeM.color.set(cubeControls.color)
        cubeM.color = new Three.Color(cubeControls.color)
    })
    
    const sphereM = new Three.MeshNormalMaterial()
    // sphereM.wireframe
    const sphere = new Three.Mesh(
        new Three.SphereGeometry(0.5),
        sphereM
    )
    // sphere.position.y = 1.5
    scene.add(sphere)

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(w, h)
    renderer.render(scene, camera)

    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stat.dom)

    const clock = new Three.Clock(),
        orbitControls = new OrbitControls(camera, renderer.domElement),
        controls = {
            r: 1.5,
            speed: 1,
            stop: () => {
                controls.speed = controls.speed == 0 ? 1 : 0
            }
        };
    const sphereFolder = gui.addFolder('球运动控制')
    sphereFolder.add(controls, 'r', 0, 2).name('半径')
    sphereFolder.add(controls, 'speed', 0, 4).name('速度')
    sphereFolder.add(sphereM, 'wireframe').name('是否显示骨架')
    sphereFolder.add(controls, 'stop').name('点击停止运动')

    function tick() {
        const time = clock.getElapsedTime()
        sphere.position.x = Math.cos(time * controls.speed) * controls.r
        sphere.position.z = Math.sin(time * controls.speed) * controls.r
        renderer.render(scene, camera)
        stat.update()
        orbitControls.update()
        requestAnimationFrame(tick)
    }
    tick()
}