import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function testCarMove() {
    const w = window.innerWidth,
        h = window.innerHeight,
        stat = new Stat(),
        scene = new Three.Scene();
    
    const carGroup = new Three.Group(),
        carBodyGroup = new Three.Group();
    
    const axes = new Three.AxesHelper(1)
    scene.add(axes)

    // new Three.MeshNormalMaterial()
    // 车身
    const carBodyCube1 = new Three.Mesh(
        new Three.BoxGeometry(1, 2, 0.5),
        new Three.MeshBasicMaterial({
            color: 0xff0000
        })
    )
    carBodyGroup.add(carBodyCube1)

    // 人
    const carPerson = new Three.Mesh(
        new Three.BoxGeometry(0.5, 0.5, 0.5),
        new Three.MeshBasicMaterial({
            color: 0xfff666
        })
    )
    carPerson.position.z = 0.5
    carBodyGroup.add(carPerson)

    // 轮子
    const wheels: any[] = [],
        wheelInfos: any[] = [
            {
                position: {
                    x: -0.5,
                    y: -1,
                    z: -0.25
                }
            },
            {
                position: {
                    x: -0.5,
                    y: 1,
                    z: -0.25
                }
            },
            {
                position: {
                    x: 0.5,
                    y: -1,
                    z: -0.25
                }
            },
            {
                position: {
                    x: 0.5,
                    y: 1,
                    z: -0.25
                }
            }
        ];
    function getWheelGroup ({ position }: any) {
        const wheelGroup = new Three.Group(),
            wheel = new Three.Mesh(
                new Three.BoxGeometry(0.25, 0.25, 0.25),
                new Three.MeshBasicMaterial({
                    color: 0x6666
                })
            );
        wheelGroup.add(wheel)
        // @ts-ignore
        wheelGroup.position.set(...Object.values(position))
        wheelGroup.add(getCircle())
        return wheelGroup
    }
    // 轮胎
    function getCircle () {
        const circle = new Three.Group(),
            n = 20,
            r = 0.2;
        for(let i = 0; i < n; i++) {
            const g = new Three.BoxGeometry(0.1, 0.1, 0.2),
                m = new Three.MeshBasicMaterial({
                    color: 0xeeeeee
                }),
                hub = new Three.Mesh(g, m);
            hub.position.x = r * Math.cos(Math.PI * 2 / n * i)
            hub.position.y = r * Math.sin(Math.PI * 2 / n * i)
            
            circle.add(hub)
            circle.rotation.y = 0.5 * Math.PI
        }
        return circle
    }
    
    wheelInfos.forEach(info => {
        const wheelGroup = getWheelGroup(info)
        
        wheels.push(wheelGroup)
        carGroup.add(wheelGroup)
    })
    carGroup.add(carBodyGroup)
    scene.add(carGroup)

    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 1000)
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(w, h)
    renderer.render(scene, camera)

    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stat.dom)

    const clock = new Three.Clock(),
        orbitControls = new OrbitControls(camera, renderer.domElement);
    function tick () {
        const time = clock.getElapsedTime()
        wheels.forEach(wheel => {
            wheel.rotation.x = -time
        })
        carGroup.position.y = time % 4 - 2
        requestAnimationFrame(tick)
        renderer.render(scene, camera)
        stat.update()
        orbitControls.update()
    }

    tick()
}