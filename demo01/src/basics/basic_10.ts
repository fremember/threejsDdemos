/*
 * @Author: fremember
 * @Date: 2024-03-09 15:58:32
 * @Description: 
 */
import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

/**
 * 灯光与阴影
 * 1、材质要满足能够对光照有反应
 * 2、设置渲染器开启阴影的计算，renderer.shadowMap.enable = true
 * 3、设置光照投射阴影 directionalLight.castShadow = true
 * 4、设置物体投射阴影 sphere.castShadow = true
 * 5、设置物体接收阴影 plane.receiveShadow = true
 */

export default function directionalLightShadow() {
    const w = window.innerWidth,
        h = window.innerHeight,
        stat = new Stat(),
        gui = new dat.GUI(),
        scene = new Three.Scene();
    
    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 100)
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)
    scene.add(camera)

    const sphereGeometry = new Three.SphereGeometry(1, 20, 20),
        material = new Three.MeshStandardMaterial(),
        sphere = new Three.Mesh(sphereGeometry, material);
    sphere.castShadow = true // 设置物体投射阴影
    scene.add(sphere)

    const planeGeometry = new Three.PlaneGeometry(10, 10),
        plane = new Three.Mesh(planeGeometry, material);
    plane.position.set(0, -1, 0)
    plane.rotation.x = -Math.PI / 2
    plane.receiveShadow = true // 设置物体接收阴影
    scene.add(plane)

    const light = new Three.AmbientLight(0xffffff, 0.2),
        directionalLight = new Three.DirectionalLight(0xffffff, 1); // 平行光
    directionalLight.position.set(10, 10, 10)

    directionalLight.castShadow = true // 设置光照投射阴影
    directionalLight.shadow.radius = 20 // 设置阴影贴图模糊度
    directionalLight.shadow.mapSize.set(2048, 2048) // 设置阴影贴图的分辨率

    // 设置平行光投射相机的属性
    directionalLight.shadow.camera.near = 0.5 // 近端
    directionalLight.shadow.camera.far = 500 // 远端
    directionalLight.shadow.camera.top = 5 // 上面
    directionalLight.shadow.camera.right = 5 // 右面
    directionalLight.shadow.camera.bottom = -5 // 下面
    directionalLight.shadow.camera.left = -5 // 左面

    scene.add(light, directionalLight)

    gui
        .add(directionalLight.shadow.camera, 'near')
        .min(0)
        .max(20)
        .step(0.2)
        .onChange(() => {
            directionalLight.shadow.camera.updateProjectionMatrix()
        })

    const axes = new Three.AxesHelper(5)
    scene.add(axes)

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(w, h)
    renderer.shadowMap.enabled = true // 设置渲染器开启阴影的计算

    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stat.dom)

    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.enableDamping = true // 设置控制器阻尼，让控制器更有真实效果，必须在动画循环里调用 .update()

    function tick() {
        requestAnimationFrame(tick)
        renderer.render(scene, camera)
        stat.update()
        orbitControls.update()
    }

    tick()
}