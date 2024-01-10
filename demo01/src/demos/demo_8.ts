import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function solarSystem() {
    const w = window.innerWidth,
        h = window.innerHeight,
        stat = new Stat(),
        scene = new Three.Scene();

    const sunGroup = new Three.Group(),
        earthGroup = new Three.Group(),
        sunInfos = {
            geometry: {
                radius: 0.5
            },
            material: {
                color: 0xff0000
            },
            position: {
                x: 0,
                y: 0,
                z: 0
            }
        },
        earthInfos = {
            geometry: {
                radius: 0.3
            },
            material: {
                color: 0x00ff00
            },
            position: {
                x: 0,
                y: 0,
                z: 0
            }
        },
        moonInfos = {
            geometry: {
                radius: 0.1
            },
            material: {
                color: 0x0000ff
            },
            position: {
                x: 0,
                y: 0.5,
                z: 0
            }
        };
    earthGroup.position.y = 1.3
    function getSphere ({ geometry, material, position }: any) {
        const g = new Three.SphereGeometry(...Object.values(geometry)),
            m = new Three.MeshBasicMaterial(...Object.values(material)),
            sphere = new Three.Mesh(g, m);
        sphere.position.set(...Object.values(position))
        return sphere
    }

    const sun = getSphere(sunInfos)
    sunGroup.add(sun)

    const earth = getSphere(earthInfos)
    earthGroup.add(earth)

    const moon = getSphere(moonInfos)
    earthGroup.add(moon)
    

    sunGroup.add(earthGroup)
    scene.add(sunGroup)

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

    const clock = new Three.Clock(),
        orbitControls = new OrbitControls(camera, renderer.domElement);

    function tick() {
        const time = clock.getElapsedTime()
        sunGroup.rotation.z = time / 2
        earthGroup.rotation.z = time
        requestAnimationFrame(tick)
        renderer.render(scene, camera)
        orbitControls.update()
        stat.update()
    }
    tick()
}