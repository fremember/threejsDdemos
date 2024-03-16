/*
 * @Author: fremember
 * @Date: 2024-03-09 14:29:00
 * @Description: 
 */
import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import px from './../img/textures/environmentMaps/1/px.jpg'
import py from './../img/textures/environmentMaps/1/py.jpg'
import pz from './../img/textures/environmentMaps/1/pz.jpg'
import nx from './../img/textures/environmentMaps/1/nx.jpg'
import ny from './../img/textures/environmentMaps/1/ny.jpg'
import nz from './../img/textures/environmentMaps/1/nz.jpg'


export default function environmentMap() {
    const w = window.innerWidth,
        h = window.innerHeight,
        stat = new Stat(),
        scene = new Three.Scene();
    
    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 100)
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)
    scene.add(camera)

    const light = new Three.AmbientLight(0xffffff, 0.2),
        directionalLight = new Three.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 5, 5)
    scene.add(light, directionalLight)

    const axes = new Three.AxesHelper(1)
    scene.add(axes)

    // 设置cube纹理加载器，加载环境贴图
    const cubeTextureLoader = new Three.CubeTextureLoader(),
        envMapTexture = cubeTextureLoader.load([px, nx, py, ny, pz, nz]);
    
    scene.background = envMapTexture // 给场景添加背景
    scene.environment = envMapTexture // 给场景中所有的物体添加默认的环境贴图，如果物体设置了环境贴图，该默认环境贴图会被覆盖
    
    const sphereGeometry = new Three.SphereGeometry(1, 20, 20),
        material = new Three.MeshStandardMaterial({
            metalness: 0.7,
            roughness: 0.1,
            envMap: envMapTexture // 给物体添加环境贴图，物体优先使用给自己设置的环境贴图
        }),
        sphere = new Three.Mesh(sphereGeometry, material);

    scene.add(sphere)

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