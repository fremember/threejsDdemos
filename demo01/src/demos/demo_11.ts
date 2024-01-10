import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function testGeometryCarMove() {
    const w = window.innerWidth,
        h = window.innerHeight,
        stat = new Stat(),
        scene = new Three.Scene();
    
    const carGroup = new Three.Group(), // 车子
        material = new Three.MeshNormalMaterial();
    // 创建车轮
    function createWheel() {
        // 车轮
        const wheel = new Three.Group()
        // 轮胎
        const tire = new Three.Mesh(
            new Three.TorusGeometry(0.5, 0.1),
            material
        )
        const n = 10
        for (let i = 0; i < n; i++) {
            let hub = new Three.Mesh(
                new Three.CylinderGeometry(0.03, 0.03, 1)
            )
            hub.rotation.z = i * 2 * Math.PI / n
            wheel.add(hub)
        }
        wheel.add(tire)
        return wheel
    }
    // 创建左右轮+车轴
    function createWheelGroup() {
        const wheelLeft = createWheel(),
            wheelRight = createWheel(),
            wheelGroup = new Three.Group();
        // 车轴
        const distance = 1.8
        const axle = new Three.Mesh(
            new Three.CylinderGeometry(0.06, 0.06, distance),
            material
        )
        wheelLeft.position.z = -distance / 2
        wheelRight.position.z = distance / 2
        axle.rotation.x = 0.5 * Math.PI
        wheelGroup.add(wheelLeft, axle, wheelRight)
        return wheelGroup
    }
    // 创建前轮组和后轮组
    const frontWheelGroup = createWheelGroup(),
        behindWheelGroup = createWheelGroup();
    frontWheelGroup.position.x = -1.3
    behindWheelGroup.position.x = 1.3

    function createBodyGroup() {
        const carBodyGroup = new Three.Group() // 车身组
        // 车底
        const cube = new Three.Mesh(
            new Three.BoxGeometry(0.5, 4, 1.4),
            material
        )
        carBodyGroup.rotation.z = 0.5 * Math.PI

        // 车顶
        const roof = new Three.Mesh(
            new Three.CylinderGeometry(1, 1, 1.2, 3, 1, false, Math.PI / 2, Math.PI),
            material
        )
        roof.rotation.z = Math.PI / 2
        roof.rotation.y = -Math.PI / 2
        return carBodyGroup.add(cube, roof)
    }

    carGroup.add(frontWheelGroup, behindWheelGroup, createBodyGroup())
    scene.add(carGroup)

    const plane = new Three.Mesh(
        new Three.PlaneGeometry(10, 10),
        new Three.MeshBasicMaterial({
            color: 0x666666
        })
    )
    plane.rotation.x = -0.5 * Math.PI
    plane.position.y = -0.6
    scene.add(plane)
    
    const light = new Three.AmbientLight()
    scene.add(light)

    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 1000)
    camera.position.set(5, 5, 5)
    camera.lookAt(0, 0, 0)

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(w, h)
    renderer.render(scene, camera)
    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stat.dom)

    const orbitControls = new OrbitControls(camera, renderer.domElement),
        clock = new Three.Clock();
    
    function tick() {
        const time = clock.getElapsedTime()
        frontWheelGroup.rotation.z = time
        behindWheelGroup.rotation.z = time
        carGroup.position.x = -time % 2 + 1
        requestAnimationFrame(tick)
        renderer.render(scene, camera)
        stat.update()
        orbitControls.update()
    }
    tick()
}