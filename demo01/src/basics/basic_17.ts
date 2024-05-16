import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function testRaycaster () {
    const win = window,
        stat = new Stat(),
        scene = new Three.Scene(); // 创建场景
    let w = win.innerWidth,
        h = win.innerHeight;

    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 30) // 创建相机
    camera.position.set(0, 0, 10) // 设置相机位置
    camera.lookAt(0, 0, 0) // 设置相机目标位置
    scene.add(camera) // 场景中添加相机

    const axes = new Three.AxesHelper(3)
    scene.add(axes)

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

    const boxGeometry = new Three.BoxGeometry(1, 1, 1),
        normalMaterial = new Three.MeshBasicMaterial({
            wireframe: true
        }),
        redMaterial = new Three.MeshBasicMaterial({
            color: '#ff0000'
        })
    // 创建1000几何体
    const boxArr: any[] = []
    for(let i = -5; i < 5; i++) {
        for(let j = -5; j < 5; j++) {
            for(let k = -5; k < 5; k++) {
                const box = new Three.Mesh(boxGeometry, normalMaterial)
                box.position.set(i, j, k)
                scene.add(box)
                boxArr.push(box)
            }
        }
    }

    // 创建投射光线对象
    const raycaster = new Three.Raycaster()

    // 鼠标的位置对象
    const mouse = new Three.Vector2()

    // 坚挺鼠标的位置
    // win.addEventListener('mousemove', (e) => {
    //     // console.log(e)
    //     mouse.x = (e.clientX / win.innerWidth) * 2 - 1 // 将 x 的数值转变成 -1～1
    //     mouse.y = -((e.clientY / win.innerHeight) * 2 - 1) // 将 y 的数值转变成 -1～1

    //     raycaster.setFromCamera(mouse, camera)
    //     const result = raycaster.intersectObjects(boxArr)// 检测物体
    //     console.log(result)
    //     result.forEach((item: any) => {
    //         item.object.material = redMaterial
    //     })
    // })

    win.addEventListener('click', (e) => {
        // console.log(e)
        mouse.x = (e.clientX / win.innerWidth) * 2 - 1 // 将 x 的数值转变成 -1～1
        mouse.y = -((e.clientY / win.innerHeight) * 2 - 1) // 将 y 的数值转变成 -1～1

        raycaster.setFromCamera(mouse, camera)
        const result = raycaster.intersectObjects(boxArr)// 检测物体
        console.log(result)
        result.forEach((item: any) => {
            item.object.material = redMaterial
        })
    })

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(w, h)
    renderer.shadowMap.enabled = true
    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stat.dom)

    const orbitControls = new OrbitControls(camera, renderer.domElement) // 设置轨道控制器
    orbitControls.enableDamping = true // 设置控制器阻尼，让控制器更有真实效果，必须在动画循环里调用 .update()


    function tick() {
        renderer.render(scene, camera)
        stat.update()

        orbitControls.update()
        requestAnimationFrame(tick)
    }
    tick()

    // 监听屏幕大小改变的变化，设置渲染的尺寸
    win.addEventListener('resize', () => {
        w = win.innerWidth
        h = win.innerHeight

        camera.aspect = w / h // 更新摄像头
        camera.updateProjectionMatrix() // 更新摄像机的投影矩阵

        renderer.setSize(w, h) // 跟新渲染器
        renderer.setPixelRatio(win.devicePixelRatio) // 设置渲染器的像素比
    })
}