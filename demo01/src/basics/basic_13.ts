/*
 * @Author: fremember
 * @Date: 2024-03-10 23:27:55
 * @Description: 
 */
import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import aperture from './../img/textures/particles/1.png'

export default function particle() {
    const w = window.innerWidth,
        h = window.innerHeight,
        stat = new Stat(),
        scene = new Three.Scene();
    
    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 100)
    camera.position.set(0, 0, 10)
    camera.lookAt(0, 0, 0)
    scene.add(camera)

    const axes = new Three.AxesHelper(2)
    scene.add(axes)

    // const sphereGeometry = new Three.SphereGeometry(3, 20, 20),
    //     material = new Three.MeshBasicMaterial({
    //         color: 0xffffff,
    //         wireframe: true
    //     }),
    //     sphere = new Three.Mesh(sphereGeometry, material);
    // scene.add(sphere)

    const sphereGeometry = new Three.SphereGeometry(3, 30, 30),
        pointsMaterial = new Three.PointsMaterial();
    pointsMaterial.size = 0.1
    pointsMaterial.color.set(0xfff000)
    pointsMaterial.sizeAttenuation = true // 相机深度而衰减 -- 透视效果，近大远小，true 衰减，false 不衰减

    // 加载并设置纹理
    const textureLoader = new Three.TextureLoader(),
        apertureTexture = textureLoader.load(aperture);
    
    pointsMaterial.map = apertureTexture
    pointsMaterial.alphaMap = apertureTexture
    pointsMaterial.transparent = true
    pointsMaterial.depthWrite = false
    pointsMaterial.blending = Three.AdditiveBlending

    const points = new Three.Points(sphereGeometry, pointsMaterial)
    scene.add(points)

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(w, h)

    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stat.dom)

    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.enableDamping = true

    function tick() {
        requestAnimationFrame(tick)
        renderer.render(scene, camera)
        stat.update()
        orbitControls.update()
    }
    tick()
}