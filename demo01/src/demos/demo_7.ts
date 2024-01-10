import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function testGroupMoving() {
    const w = window.innerWidth,
        h = window.innerHeight,
        stat = new Stat();
    
    const scene = new Three.Scene()
    const cubeInfos = [
            {
                color: 0xff0000,
                position: {
                    x: 0,
                    y: -1.5,
                    z: 0
                }
            },
            {
                color: 0x00ff00,
                position: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            },
            {
                color: 0x0000ff,
                position: {
                    x: 0,
                    y: 1.5,
                    z: 0
                }
            }
        ],
        cubes: any[] = [];
    // 创建组合
    const group = new Three.Group()

    function getCube({ color, position }: any) {
        const geometry = new Three.BoxGeometry(1, 1, 1),
            material = new Three.MeshBasicMaterial({
                color
            }),
            cube = new Three.Mesh(geometry, material),
            { x, y, z } = position;
        cube.position.set(x, y, z)
        // 将组合添加到场景中
        group.add(cube)
        return cube
    }

    cubeInfos.forEach(info => {
        cubes.push(getCube(info))
    })

    scene.add(group)

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

    const orbitControls = new OrbitControls(camera, renderer.domElement)
    const clock = new Three.Clock()

    function tick () {
        const time = clock.getElapsedTime()
        // 设置组的rotation
        group.rotation.z = time
        requestAnimationFrame(tick)
        renderer.render(scene, camera)
        stat.update()
        orbitControls.update()
    }

    tick()
}