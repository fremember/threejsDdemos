/*
 * @Author: fremember
 * @Date: 2024-01-19 20:52:18
 * @Description: 
 */
import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import * as dat from 'dat.gui'
// import gsap from 'gsap'

import doorColor from './../img/textures/door/color.jpg'
import doorAlpha from './../img/textures/door/alpha.jpg' // 透明材质
import doorAo from './../img/textures/door/ambientOcclusion.jpg' // 环境遮挡贴图

export default function  basicMaterial() {
    const w = window.innerWidth,
        h = window.innerHeight,
        stat = new Stat(),
        scene = new Three.Scene();
    
    const light = new Three.AmbientLight(0xffffff, 0.2)
    scene.add(light)

    const directionalLight = new Three.DirectionalLight(0xffffff)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    const axes = new Three.AxesHelper(1)
    scene.add(axes)

    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 100)
    camera.position.set(0, 0, 3)
    camera.lookAt(0, 0, 0)

    // 倒入纹理
    const textureLoader = new Three.TextureLoader()
    const doorColorTexture = textureLoader.load(doorColor)
    const doorAlphaTexture = textureLoader.load(doorAlpha)
    const doorAoTexture = textureLoader.load(doorAo)
    // 纹理的偏移
    // doorColorTexture.offset.x = 0.5
    // doorColorTexture.offset.y = 0.5
    // doorColorTexture.offset.set(0.5, 0.5)

    // 纹理的旋转
    // doorColorTexture.rotation = Math.PI / 4 // 转转45deg
    // doorColorTexture.center.set(0.5, 0.5) // 设置旋转的圆点

    // 设置纹理的重复
    // doorColorTexture.repeat.set(2, 3)// 水平方向重复2次，垂直方向重复3次
    // // 设置纹理重复的模式
    // doorColorTexture.wrapS = Three.MirroredRepeatWrapping // 镜像重复
    // doorColorTexture.wrapT = Three.RepeatWrapping // 堆叠重复

    // 纹理的显示设置
    // doorColorTexture.minFilter = Three.NearestFilter
    // doorColorTexture.magFilter = Three.NearestFilter

    doorColorTexture.minFilter = Three.LinearFilter
    doorColorTexture.magFilter = Three.LinearFilter

    const cubeGeometry = new Three.BoxGeometry(1, 1, 1)
    const cubeMaterial = new Three.MeshBasicMaterial({
        color: 0xffff00,
        map: doorColorTexture, // 设置自定义纹理，加载的图片

        alphaMap: doorAlphaTexture,// 设置透明纹理，加载的黑白图片
        transparent: true, // 设置允许透明

        // opacity: 0.3, // 设置可见度
        // side: Three.DoubleSide, // 设置渲染两面

        aoMap: doorAoTexture, // 设置遮挡贴图
        aoMapIntensity: 1 // 设置遮挡贴图的强度
    })
    const cube = new Three.Mesh(cubeGeometry, cubeMaterial)
    scene.add(cube)

    const planeGeometry = new Three.PlaneGeometry(1, 1) 

    // 给 planeGeometry 和 cubeGeometry 设置第二组 UV
    cubeGeometry.setAttribute('uv2', new Three.BufferAttribute(cubeGeometry.attributes.uv.array, 2))
    planeGeometry.setAttribute('uv2', new Three.BufferAttribute(planeGeometry.attributes.uv.array, 2))

    const plane = new Three.Mesh(
        planeGeometry,
        cubeMaterial
    )
    plane.position.set(1.5, 0, 0)
    
    scene.add(plane)

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(w, h)
    
    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stat.dom)

    const orbitControls = new OrbitControls(camera, renderer.domElement)

    function tick() {
        requestAnimationFrame(tick)
        renderer.render(scene, camera)
        stat.update()
        orbitControls.update()
    }
    tick()
}