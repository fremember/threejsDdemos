import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import * as dat from 'dat.gui'

 // 图片加载
const snow = new URL('./../img/textures/particles/14.png', import.meta.url).href,
    xh = new URL('./../img/textures/particles/xh.png', import.meta.url).href;

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
    function createPoints(textureSource: string, size: number = 0.5) {
        const pointsGeometry = new Three.BufferGeometry(),// 设置粒子集合体
            count = 300, // 设置粒子数量
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
        pointsMaterial.size = size
        pointsMaterial.color.set(0xffffff)
        pointsMaterial.sizeAttenuation = true // 相机深度而衰减

        // 加载纹理
        const textureLoader = new Three.TextureLoader(),
            texture = textureLoader.load(textureSource);
        // 设置粒子材质纹理
        pointsMaterial.map = texture
        pointsMaterial.alphaMap = texture
        pointsMaterial.transparent = true
        pointsMaterial.depthWrite = false
        pointsMaterial.blending = Three.AdditiveBlending
        pointsMaterial.vertexColors = true // 设置启动顶点颜色

        return new Three.Points(pointsGeometry, pointsMaterial)
    }
    const points1 = createPoints(snow, 0.5)
    scene.add(points1)
    const points2 = createPoints(xh, 1)
    scene.add(points2)
    const points3 = createPoints(xh, 2)
    scene.add(points3)

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(w, h)
    renderer.shadowMap.enabled = true
    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stat.dom)

    const orbitControls = new OrbitControls(camera, renderer.domElement) // 设置轨道控制器
    orbitControls.enableDamping = true // 设置控制器阻尼，让控制器更有真实效果，必须在动画循环里调用 .update()

    const clock = new Three.Clock()

    function tick() {//
        renderer.render(scene, camera)
        stat.update()
        orbitControls.update()
        const time = clock.getElapsedTime()
        points1.rotation.x = time * 0.1
        points2.rotation.x = time * 0.2
        points2.rotation.y = time * 0.05
        points3.rotation.x = time * 0.2
        points3.rotation.y = time * 0.05
        requestAnimationFrame(tick)
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