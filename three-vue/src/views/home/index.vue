<template name="home-view">
    <section class="home-view">
        <section class="page page1">
            <h1>Ray 投射光线</h1>
            <h3>Three.Raycaster 实现3D交互效果</h3>
        </section>
        <section class="page page2">
            <h1>Three.BufferGeometry</h1>
            <h3>打造炫酷的三角形</h3>
        </section>
        <section class="page page3">
            <h1>活泼点光源</h1>
            <h3>点光源围绕照亮小球</h3>
        </section>
    </section>
</template>

<script setup lang="ts">
    import { nextTick, onMounted } from 'vue'
    import * as Three from 'three'
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
    import gsap from 'gsap'

    const win = window

    let scene: any = null, // 场景
        w: number = 0, // 宽度
        h: number = 0, // 高度
        camera: any = null,// 相机
        renderer: any = null, // 渲染器
        orbitControls: any = null, // 轨道控制器
        currentPage = 0,
        arrGroup: any[] = [];
    const redMaterial = new Three.MeshBasicMaterial({
            color: '#ff0000'
        }),
        boxArr: any[] = [];
    const isSceneValidate = () => {
            return scene
        },
        initScene = () => { // 创建场景
            scene = new Three.Scene()
        },
        initCamera = () => {
            if(isSceneValidate()) {
                camera = new Three.PerspectiveCamera(75, w / h, 0.1, 1000)
                camera.position.set(0, 0, 18) // 设置相机位置
                camera.lookAt(0, 0, 0) // 设置相机目标位置
                scene.add(camera) // 场景中添加相机
            } else {
                initThreeScene()
            }
        },
        initLight = () => {
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
        },
        initRenderer = () => { // 初始化渲染器
            renderer = new Three.WebGLRenderer()
            renderer.setSize(w, h)
            renderer.shadowMap.enabled = true
            document.body.appendChild(renderer.domElement)
        },
        initOrbitControls = () => {
            orbitControls = new OrbitControls(camera, renderer.domElement)
            orbitControls.enabled = true
            orbitControls.enableDamping = true
            orbitControls.update()
        },
        initRaycaster = () => {
            const boxGeometry = new Three.BoxGeometry(1, 1, 1),
                normalMaterial = new Three.MeshBasicMaterial({
                    wireframe: true
                });
            // 创建1000几何体
            
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
        },
        animate = () => {// 动画刷新
            requestAnimationFrame(animate)
            renderer.render(scene, camera)
        },
        initThreeScene = () => {
            w = window.innerWidth
            h = window.innerHeight
            nextTick(() => {
                initScene()
                initCamera()
                initLight()
                initRenderer()
                initOrbitControls()
                initRaycaster()

                animate()
            })
        };
    onMounted(() => {
        initThreeScene()

        win.addEventListener('resize', () => {
            w = win.innerWidth
            h = win.innerHeight
            if (camera) {
                camera.aspect = w / h // 更新摄像头
                camera.updateProjectionMatrix() // 更新摄像机的投影矩阵
            }
            if (renderer) {
                renderer.setSize(w, h) // 跟新渲染器
                renderer.setPixelRatio(win.devicePixelRatio) // 设置渲染器的像素比
            }
        })

        win.addEventListener('scroll', () => {
            const newPage = Math.round(win.scrollY / win.innerHeight)
            if (newPage != currentPage) {
                currentPage = newPage
                console.log(`改变页面，当前是：${currentPage}`)
                console.log(arrGroup[currentPage].rotation)

                gsap.to(arrGroup[currentPage].rotation, {
                    z: '+=' + Math.PI * 2,
                    x: '+=' + Math.PI * 2,
                    duration: 2,
                    onComplete: () => {
                        console.log('旋转完成')
                    }
                })
                gsap.fromTo(
                    `.page${currentPage} h1`,
                    { x: -300 },
                    { x: 0, rotate: '+=360', duration: 1 }
                )
            }
        })
    })
</script>

<style lang="less">
.home-view {
    background: rgb(36, 58, 66);
    
    .page {
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        z-index: 10;
        color: #fff;
        h1 {
            margin: 30px;
            font-size: 40px;
        }
        h3 {
            font-size: 20px;
        }
    }
}
canvas {
    position: fixed;
    top: 0;
    left: 0;
}
::-webkit-scrollbar {
    display: none;
}
</style>
