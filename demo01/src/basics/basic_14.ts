import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import * as dat from 'dat.gui'

const star = new URL('./../img/textures/particles/9.png', import.meta.url).href // 图片加载

export default function starFromRandomPoint() {
    let w = window.innerWidth,
        h = window.innerHeight;
    const stat = new Stat(),
        // gui = new dat.GUI(),
        scene = new Three.Scene(); // 创建场景
    
    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 1000) // 创建相机
    camera.position.set(0, 0, 10) // 设置相机位置
    camera.lookAt(0, 0, 0) // 设置相机目标位置
    scene.add(camera) // 场景中添加相机

    // 添加坐标轴辅助器
    const axesHelper = new Three.AxesHelper(3)
    scene.add(axesHelper)

    const ambientLight = new Three.AmbientLight(0xffffff, 0.2), // 环境光
        directionalLight = new Three.DirectionalLight(0xffffff, 1); // 平行光
    directionalLight.position.set(5, 5, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.radius = 20 // 设置贴图的模糊程度
    directionalLight.shadow.mapSize.set(2048, 2048) // 设置阴影贴图的分辨率
    // 设置平行光投射相机的属性
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 500
    directionalLight.shadow.camera.top = 5
    directionalLight.shadow.camera.right = 5
    directionalLight.shadow.camera.bottom = -5
    directionalLight.shadow.camera.left = -5

    scene.add(ambientLight, directionalLight)

    const pointsGeometry = new Three.BufferGeometry(),// 设置粒子集合体
        count = 1000, // 设置粒子数量
        countLen = count * 3, // 设置粒子位置的长度，每个粒子坐标三位（x、y、z轴坐标）
        positions = new Float32Array(countLen), // 设置缓冲区数组
        colors = new Float32Array(countLen); // 设置粒子顶点颜色
    for (let i = 0; i < countLen; i++) {
        positions[i] = (Math.random() - 0.5) * 50
        colors[i] = Math.random()
    }
    // 设置粒子的坐标和颜色值
    pointsGeometry.setAttribute('position', new Three.BufferAttribute(positions, 3))
    pointsGeometry.setAttribute('color', new Three.BufferAttribute(colors, 3))
    
    const pointsMaterial = new Three.PointsMaterial() // 设置粒子材质
    pointsMaterial.size = 0.5
    pointsMaterial.color.set(0xffffff)
    pointsMaterial.sizeAttenuation = true // 相机深度而衰减

    // 加载纹理
    const textureLoader = new Three.TextureLoader(),
        texture = textureLoader.load(star);
    // 设置粒子材质纹理
    pointsMaterial.map = texture
    pointsMaterial.alphaMap = texture
    pointsMaterial.transparent = true
    pointsMaterial.depthWrite = false
    pointsMaterial.blending = Three.AdditiveBlending
    pointsMaterial.vertexColors = true // 设置启动顶点颜色
    
    const points = new Three.Points(pointsGeometry, pointsMaterial)
    scene.add(points)

    const renderer = new Three.WebGLRenderer() // 初始化渲染器
    renderer.setSize(w, h) // 设置渲染器尺寸
    renderer.shadowMap.enabled = true // 开启场景中的阴影贴图

    document.body.appendChild(renderer.domElement) // 将webgl渲染的canvas内容添加到body
    document.body.appendChild(stat.dom)

    const orbitControls = new OrbitControls(camera, renderer.domElement) // 设置轨道控制器
    orbitControls.enableDamping = true // 设置控制器阻尼，让控制器更有真实效果，必须在动画循环里调用 .update()

    // const clock = new Three.Clock()

    function tick() {
        // const elapsedTime = clock.getElapsedTime()
        // material.uniforms.uTime.value = elapsedTime
        requestAnimationFrame(tick)
        stat.update()
        orbitControls.update()
        renderer.render(scene, camera)
        // console.log(elapsedTime)
    }
    tick()

    // 监听屏幕大小改变的变化，设置渲染的尺寸
    window.addEventListener('resize', () => {
        w = window.innerWidth
        h = window.innerHeight

        camera.aspect = w / h // 更新摄像头
        camera.updateProjectionMatrix() // 更新摄像机的投影矩阵

        renderer.setSize(w, h) // 更新渲染器
        renderer.setPixelRatio(window.devicePixelRatio) // 设置渲染器的像素比
    })
}