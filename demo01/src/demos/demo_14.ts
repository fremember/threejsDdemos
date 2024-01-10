import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'

export default function testLight() {
    const w = window.innerWidth,
        h = window.innerHeight,
        stat = new Stat(),
        gui = new dat.GUI(),
        scene = new Three.Scene();
    

    const planeG = new Three.PlaneGeometry(4, 4),
        planeM  = new Three.MeshPhongMaterial({ color: 0xcccccc }),
        plane = new Three.Mesh(planeG, planeM);
    plane.rotation.x = -0.5 * Math.PI
    scene.add(plane)

    // 添加环境光
    // const light = new Three.AmbientLight(0xffffff)
    // light.intensity = 0.2 // 修改环境光强度
    const light = new Three.AmbientLight(0xffffff, 0.2)
    scene.add(light)

    // 线性光
    const directionalInfo = {
        color: 0xffffff
    }
    const directionalLight = new Three.DirectionalLight(directionalInfo.color)
    directionalLight.intensity = 1
    directionalLight.position.set(1, 1, 1)

    const directionalFolder = gui.addFolder('线性光')
    directionalFolder.addColor(directionalInfo, 'color').onChange(() => {
        directionalLight.color.set(directionalInfo.color)
    })
    directionalFolder.add(directionalLight, 'intensity', 0, 1, 0.01).name('光强度')
    directionalFolder.add(directionalLight.position, 'x', -5, 5, 0.1).name('位置-x')
    directionalFolder.add(directionalLight.position, 'y', -5, 5, 0.1).name('位置-y')
    directionalFolder.add(directionalLight.position, 'z', -5, 5, 0.1).name('位置-z')

    const directionalLightHelper = new Three.DirectionalLightHelper(directionalLight)
    // scene.add(directionalLightHelper)
    // scene.add(directionalLight)

    // 锥形光
    const spotInfo = {
        color: 0xffffff
    }
    const spotLight = new Three.SpotLight(spotInfo.color)
    spotLight.position.set(1, 1, 1)
    spotLight.angle = 60 / 180 * Math.PI // 设置锥形光的角度
    // spotLight.distance = 1 // 设置锥型光照射的长度

    const spotFolder = gui.addFolder('锥形光')
    spotFolder.addColor(spotInfo, 'color').onChange(() => {
        spotLight.color.set(spotInfo.color)
    })
    spotFolder.add(spotLight, 'intensity', 0, 1, 0.01).name('光强度')
    spotFolder.add(spotLight.position, 'x', -5, 5, 0.1).name('位置-x')
    spotFolder.add(spotLight.position, 'y', -5, 5, 0.1).name('位置-y')
    spotFolder.add(spotLight.position, 'z', -5, 5, 0.1).name('位置-z')
    spotFolder.add(spotLight, 'angle', 0.01, 3.14, 0.01).name('角度')
    const spotLightHelper = new Three.SpotLightHelper(spotLight)
    // scene.add(spotLightHelper)
    // scene.add(spotLight)

    // 点光源
    const pointInfo = {
            color: 0xffffff
        },
        pointLight = new Three.PointLight(pointInfo.color);
    pointLight.position.set(1, 1, 1)
    pointLight.intensity = 1
    pointLight.distance = 2

    const pointFolder = gui.addFolder('点光源')
    pointFolder.addColor(pointInfo, 'color').onChange(() => {
        pointLight.color = new Three.Color(pointInfo.color)
    })
    pointFolder.add(pointLight, 'intensity', 0, 1, 0.01).name('光强度')
    pointFolder.add(pointLight.position, 'x', -5, 5, 0.1).name('位置-x')
    pointFolder.add(pointLight.position, 'y', -5, 5, 0.1).name('位置-y')
    pointFolder.add(pointLight.position, 'z', -5, 5, 0.1).name('位置-z')
    pointFolder.add(pointLight, 'distance', 0, 5).name('照射的长度')
    const pointLightHelper = new Three.PointLightHelper(pointLight)
    // scene.add(pointLightHelper)
    // scene.add(pointLight)

    // 矩形光源，只对 MeshStandardMaterial MeshPhysicalMaterial 有效
    const rectAreaInfo = {
        color: 0xffffff
    }
    const rectAreaLight = new Three.RectAreaLight(rectAreaInfo.color, 1, 2, 2)
    rectAreaLight.position.set(0, 1.5, 0)
    rectAreaLight.rotation.x = -0.5 * Math.PI
    const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
    // scene.add(rectAreaLightHelper)
    // scene.add(rectAreaLight)

    // 半球光 HemisphereLight 两个颜色值 第一个从上往下照射，第二个从下往上照射
    const hemisphereLight = new Three.HemisphereLight(0xff0000, 0x0000ff)
    scene.add(hemisphereLight)

    // const commonM = new Three.MeshPhongMaterial({ color: 0xff00ff })
    // 矩形光源
    const commonM = new Three.MeshStandardMaterial({ color: 0xff00ff })

    // 创建球体
    const sphereG = new Three.SphereGeometry(0.5),
        sphere = new Three.Mesh(sphereG, commonM);
    sphere.position.y = 0.5
    scene.add(sphere)
    // 创建立方体
    const cube = new Three.Mesh(
        new Three.BoxGeometry(0.5, 0.5, 0.5),
        commonM
    )
    cube.position.set(1, 0.8, 0)
    scene.add(cube)
    // 创建圆环体
    const torusG = new Three.TorusGeometry(0.5, 0.1, 10, 20),
        torus = new Three.Mesh(torusG, commonM);
    torus.position.set(-1, 0.8, 0)
    torus.rotation.x = -0.5 * Math.PI
    scene.add(torus)

    const axes = new Three.AxesHelper(1)
    scene.add(axes)
    
    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 1000)
    camera.position.set(0, 2, 3)
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

        cube.rotation.x = time * 0.4
        cube.rotation.y = time * 0.4
        torus.rotation.x = time * 0.4
        torus.rotation.y = time * 0.4

        requestAnimationFrame(tick)
        renderer.render(scene, camera)
        stat.update()
        orbitControls.update()
        directionalLightHelper.update()
        spotLightHelper.update()
        pointLightHelper.update()
    }
    tick()
}