import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

export default function testMaterial() {
    const w = window.innerWidth,
        h = window.innerHeight,
        gui = new dat.GUI(),
        stat = new Stat(),
        scene = new Three.Scene();

    // 添加环境光
    scene.add(new Three.AmbientLight(0xffffff, 0.2))
    // 添加平行光
    const light = new Three.DirectionalLight(0xffffff)
    light.position.set(2, 2, 2)
    scene.add(light)
    
    const lightFolder = gui.addFolder('灯光位置')
    lightFolder.add(light.position, 'x', -5, 5).name('x')
    lightFolder.add(light.position, 'y', -5, 5).name('y')
    lightFolder.add(light.position, 'z', -5, 5).name('z')

    const axes = new Three.AxesHelper(1)
    scene.add(axes)

    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 1000)
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)

    const geometry = new Three.SphereGeometry(0.5)

    // 基本材质
    // const material = new Three.MeshBasicMaterial()
    // 基本材质 - 修改颜色
    // const material = new Three.MeshBasicMaterial({
    //     color: 0xff0000
    // })
    // 基本材质 - 显示线框
    // const material = new Three.MeshBasicMaterial({
    //     wireframe: true
    // })
    // 基本材质 - 元素显示或隐藏
    // const material = new Three.MeshBasicMaterial({
    //     visible: false
    // })

    // 属性统一设置
    // const material = new Three.MeshBasicMaterial({
    //     color: 0xff0000,
    //     wireframe: true
    // })
    // 属性分开设置
    // const material = new Three.MeshBasicMaterial()
    // material.wireframe = true
    // // material.visible = false
    // // material.color = new Three.Color(0xff0000)
    // material.color.set('red')

    // const material = new Three.MeshNormalMaterial({
    //     // wireframe: true,
    //     flatShading: true // flatShading 是否显示切角渲染，true切角渲染更立体，false的时候平滑渲染
    // })

    // const mesh = new Three.Mesh(geometry, material)
    // scene.add(mesh)

    // MeshLambertMaterial - 需要灯光才能看到
    const material1 = new Three.MeshLambertMaterial({
        color: 0xff00ff
    }) 
    // MeshPhongMaterial - 与 MeshLambertMaterial 相似，但是有高光效果
    const material2 = new Three.MeshPhongMaterial({
        color: 0xff00ff,
        shininess: 100
    })
    // MeshStandardMaterial - 标准 - 需要灯光才能看到
    const material3 = new Three.MeshStandardMaterial({
        color: 0xff00ff,
        roughness: 0, // 粗糙程度
        metalness: 0.2// 金属性
    })
    gui.add(material3, 'roughness', 0, 1, 0.01)
    gui.add(material3, 'metalness', 0, 1, 0.01)

    const mesh1 = new Three.Mesh(geometry, material1)
    mesh1.position.y = 1.5
    const mesh2 = new Three.Mesh(geometry, material2)
    mesh2.position.y = 0
    const mesh3 = new Three.Mesh(geometry, material3)
    mesh3.position.y = -1.5
    scene.add(mesh1, mesh2, mesh3)


    const renderer = new Three.WebGLRenderer()
    renderer.setSize(w, h)
    renderer.render(scene, camera)

    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stat.dom)

    const clock = new Three.Clock()
    const orbitControls = new OrbitControls(camera, renderer.domElement)

    function tick() {
        const time = clock.getElapsedTime()
        requestAnimationFrame(tick)
        renderer.render(scene, camera)
        stat.update()
        orbitControls.update()
    }
    tick()
}