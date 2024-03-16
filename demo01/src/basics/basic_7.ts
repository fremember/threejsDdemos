/*
 * @Author: fremember
 * @Date: 2024-01-19 22:55:19
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
import doorHeight from './../img/textures/door/height.jpg' // 置换贴图
import doorRoughness from './../img/textures/door/roughness.jpg' // 粗糙度
import doorMetal from './../img/textures/door/metalness.jpg' // 金属度
import doorNormal from './../img/textures/door/normal.jpg' // 法线贴图


export default function basicPbr() {
    const w = window.innerWidth,
        h = window.innerHeight,
        stat = new Stat(),
        scene = new Three.Scene();
    
    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 100)
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)
    scene.add(camera)

    const light = new Three.AmbientLight(0xffffff, 0.2)
    const directionalLight = new Three.DirectionalLight(0xffffff)
    directionalLight.position.set(0, 5, 5)
    scene.add(light, directionalLight)

    const axes = new Three.AxesHelper(5)
    scene.add(axes)

    // const gridHelper = new Three.GridHelper(10, 10)
    // scene.add(gridHelper)

    // 设置加载管理器（统一设置纹理的加载回调函数）
    // const loadingManage = new Three.LoadingManager(
    //     ( url, itemsLoaded, itemsTotal ) => {
    //         console.log(url)
    //         console.log(itemsLoaded)
    //         console.log(itemsTotal)
    //     },
    //     ( url, itemsLoaded, itemsTotal ) => {
    //         console.log(url)
    //         console.log(itemsLoaded)
    //         console.log(itemsTotal)
    //     },
    //     ( url ) => {
    //         console.log(url)
    //     }
    // )

    const loadingManage = new Three.LoadingManager()
    loadingManage.onLoad = function() {
        console.log('加载完成')
    }
    loadingManage.onError = function() {
        console.log('加载失败')
    }
    loadingManage.onProgress = function(url, num, total) {
        console.log('图片加载完成', url)
        console.log('图片加载进度', num)
        console.log('图片总数', total)
        console.log('加载进度：', (num / total * 100).toFixed(2))
    }

    const textureLoader = new Three.TextureLoader(loadingManage),
        doorColorTexture = textureLoader.load(doorColor),
        doorAlphaTexture = textureLoader.load(doorAlpha),
        doorAoTexture = textureLoader.load(doorAo),
        doorHeightTexture = textureLoader.load(doorHeight),
        doorRoughnessTexture = textureLoader.load(doorRoughness),
        doorMetalTexture = textureLoader.load(doorMetal),
        doorNormalTexture = textureLoader.load(doorNormal);
        // 单独设置一个纹理的加载回调函数
        // doorNormalTexture = textureLoader.load(
        //     doorNormal,
        //     function(texture) {
        //         console.log(texture)
        //         console.log('图片加载完成')
        //     },
        //     function(e) {
        //         console.log(e)
        //         console.log('加载进度')
        //     },
        //     function(e) {
        //         console.log(e)
        //         console.log('图片加载错误')
        //     }
        // );

    const cubeGeometry = new Three.BoxGeometry(1, 1, 1, 100, 100, 100),
        material = new Three.MeshStandardMaterial({
            color: 0xffff00,
            map: doorColorTexture,
            alphaMap: doorAlphaTexture,
            transparent: true,
            aoMap: doorAoTexture,
            aoMapIntensity: 1,
            displacementMap: doorHeightTexture,
            displacementScale: 0.05,
            roughness: 1,
            roughnessMap: doorRoughnessTexture,
            metalness: 1,
            metalnessMap: doorMetalTexture,
            normalMap: doorNormalTexture
        });
    material.side = Three.DoubleSide
    const cube = new Three.Mesh(cubeGeometry, material);
    scene.add(cube)

    cubeGeometry.setAttribute(
        "uv2",
        new Three.BufferAttribute(cubeGeometry.attributes.uv.array, 2)
    )

    const planeGeometry = new Three.PlaneGeometry(1, 1, 100, 100) 
    planeGeometry.setAttribute('uv2', new Three.BufferAttribute(planeGeometry.attributes.uv.array, 2))
    const plane = new Three.Mesh(
        planeGeometry,
        material
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