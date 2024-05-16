import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 图片加载
const snow = new URL('./../img/textures/particles/1.png', import.meta.url).href;

export default function galaxy() {
    let w = window.innerWidth,
        h = window.innerHeight;
    const stat = new Stat(),
        scene = new Three.Scene(); // 创建场景
    
    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 30) // 创建相机
    camera.position.set(0, 0, 10) // 设置相机位置
    camera.lookAt(0, 0, 0) // 设置相机目标位置
    scene.add(camera) // 场景中添加相机

    // 添加坐标轴辅助器
    const axesHelper = new Three.AxesHelper(3)
    scene.add(axesHelper)

    const ambientLight = new Three.AmbientLight(0xffffff, 0.2), // 环境光
        directionalLight = new Three.DirectionalLight(0xffffff, 1); // 平行光
    directionalLight.position.set(10, 10, 10)
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

    const textureLoader = new Three.TextureLoader(),
        texture = textureLoader.load(snow);

    const params = {
        count: 10000,
        size: 0.1,
        radius: 5,// 半径
        branch: 3, // 分支数
        color: '#ff6030',
        rotateScale: 0.3, // 弯曲程度
        endColor: '#1b3984'
    }
    let geometry = null,
        material = null,
        points = null;
    const centerColor = new Three.Color(params.color), // 中心颜色
        endColor = new Three.Color(params.endColor); // 边缘颜色

    const generateGalaxy = () => {
        geometry = new Three.BufferGeometry()
        
        const positions = new Float32Array(params.count * 3), // 随机生成顶点位置
            colors = new Float32Array(params.count * 3); // 随机生成颜色值

        // 循环生成顶点坐标
        for (let i = 0; i < params.count; i++) {
            const branchAngel = (i % params.branch) * ((2 * Math.PI) / params.branch), // 当前的点应该在哪一条分支角度上
                distance = Math.random() * params.radius * Math.pow(Math.random(), 3), // 当前点距离圆形的距离
                current = i * 3,
                randomX = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5,
                randomY = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5,
                randomZ = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
            // positions[current], positions[current + 1], positions[current + 2] 分别对应的是 第 current 个顶点的 x、y、z轴的坐标
            positions[current] = Math.cos(branchAngel + distance * params.rotateScale) * distance + randomX
            positions[current + 1] = 0 + randomY
            positions[current + 2] = Math.sin(branchAngel + distance * params.rotateScale) * distance + randomZ

            // 混合颜色形成渐变色
            const mixColor = centerColor.clone()
            mixColor.lerp(endColor, distance / params.radius)
            
            colors[current] = mixColor.r
            colors[current + 1] = mixColor.g
            colors[current + 2] = mixColor.b
        }
        // 设置点坐标
        geometry.setAttribute('position', new Three.BufferAttribute(positions, 3))
        geometry.setAttribute('color', new Three.BufferAttribute(colors, 3))
        // 设置点材质
        material = new Three.PointsMaterial({
            // color: new Three.Color(params.color),
            size: params.size,
            sizeAttenuation: true,
            depthWrite: false,
            blending: Three.AdditiveBlending,
            map: texture,
            alphaMap: texture,
            transparent: true,
            vertexColors: true
        })
        points = new Three.Points(geometry, material)
        scene.add(points)
    }

    generateGalaxy()

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(w, h)
    renderer.shadowMap.enabled = true
    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stat.dom)

    const orbitControls = new OrbitControls(camera, renderer.domElement) // 设置轨道控制器
    orbitControls.enableDamping = true // 设置控制器阻尼，让控制器更有真实效果，必须在动画循环里调用 .update()

    // const clock = new Three.Clock()

    function tick() {
        renderer.render(scene, camera)
        stat.update()
        orbitControls.update()
        // const time = clock.getElapsedTime()
        // console.log(time)
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