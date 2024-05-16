<template name="login-view">
    <div class="login-view" ref="loginRef"></div>
</template>

<script setup lang="ts">
    import { ref, nextTick, onMounted } from 'vue'
    import * as Three from 'three'
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
    import _ from 'lodash'
    // import IMAGE_SKY from './../../assets/images/sky.png'
    const loginRef = ref<any>(null),
        IMAGE_SKY = new URL('./../../assets/images/sky.png', import.meta.url).href, // 图片加载
        EARTH = new URL('./../../assets/images/earth_bg.png', import.meta.url).href,
        star1 = new URL('./../../assets/images/starflake1.png', import.meta.url).href,
        star2 = new URL('./../../assets/images/starflake2.png', import.meta.url).href,
        cloud = new URL('./../../assets/images/cloud.png', import.meta.url).href,
        depth: number = 1400; // 深度
    let scene: any = null, // 场景
        width: number = 0, // 宽度
        height: number = 0, // 高度
        camera: any = null,// 相机
        zAxisNumber: number = 0, // 相机在Z轴的位置
        renderer: any = null, // 渲染器
        orbitControls: any = null, // 轨道控制器
        sphere: any= null, // 球体网格
        parameters: Array<any> = [], // 初始点的信息
        materials: Array<any> = [], // 材质
        particles_init_position: number = 0, // 初始时点的z轴的位置
        zprogress = 0, // 声明点1在z轴上的移动位置
        zprogress_second = 0, // 声明点2在z轴上的移动位置
        particles_first: any = [], // 声明点1
        particles_second: any = [], // 声明点2
        cloud_first: any = null, // 创建星云1
        cloud_second: any = null, // 创建星云2
        renderCloud_first: any = null, // 星云1运动的渲染函数
        renderCloud_second: any = null; // 星云2运动的渲染函数

    const initScene = () => { // 创建场景
            scene = new Three.Scene()
            // 添加雾的效果
            scene.fog = new Three.Fog(0x0000000, 0, 10000)
        },
        initSceneBg = () => {// 添加背景
            // 加载纹理
            new Three.TextureLoader().load(IMAGE_SKY, (texture: any) => {
                // 纹理加载完成的回调
                const geometry = new Three.BoxGeometry(width, height, depth), // 创建立方体
                    material = new Three.MeshBasicMaterial({ // 创建材质
                        map: texture,
                        side: Three.BackSide
                    }),
                    mesh = new Three.Mesh(geometry, material);
                scene.add(mesh)
            })
        },
        initSphere = () => { // 创建地球
            new Three.TextureLoader().load(EARTH, (texture: any) => {
                const geometry = new Three.SphereGeometry(50, 64, 32),
                    material = new Three.MeshPhongMaterial({
                        map: texture
                    });
                sphere = new Three.Mesh(geometry, material);
                sphere.position.set(-400, 200, -200)
                scene.add(sphere)
            })
        },
        initLight = () => { // 添加光照
            // 环境光
            const ambientLight = new Three.AmbientLight(0xfffff, 1)
            scene.add(ambientLight)
            // 点光源
            const pointLight = new Three.PointLight(0x0655fd, 5)
            pointLight.decay = 0
            pointLight.distance = 0
            pointLight.position.set(0, 100, -200)
            scene.add(pointLight)
        },
        renderSphereRotate = () => {
            sphere && sphere.rotateY(0.01)
        },
        initCamera = () => { // 创建相机
            // 视野夹角
            const fov = 15
            // 计算相机距离物体的距离
            const distance = width / 2 / Math.tan(Math.PI / 12)
            // const distance = width / 2 / Math.tan(fov)
            zAxisNumber = Math.floor(distance - depth / 2)
            camera = new Three.PerspectiveCamera(fov, width / height, 1, 30000)
            camera.position.set(0, 0, zAxisNumber)
            camera.lookAt(0, 0, 0)
        },
        initSceneStar = (initZPosition: number) => { // 初始化星星的效果
            const geometry = new Three.BufferGeometry(),
                vertices = [], // 星星位置的坐标
                textureLoader = new Three.TextureLoader(),
                sprite1 = textureLoader.load(star1),
                sprite2 = textureLoader.load(star2),
                pointsGeometry = [];
            parameters = [// 声明点的参数
                [ [ 0.6, 100, 0.75 ], sprite1, 50 ],
                [ [ 0, 0, 1 ], sprite2, 20 ]
            ];
            for(let i = 0; i < 1500; i++) { // 创建1500个星星
                const x = Three.MathUtils.randFloatSpread(width),
                    // y = _.random(0, height / 2),
                    y = _.random(-height / 2, height / 2),
                    z = _.random(-depth / 2, zAxisNumber);
                vertices.push(x, y, z)
            }
            geometry.setAttribute('position', new Three.Float32BufferAttribute(vertices, 3))
            // 创建两种不同的材质
            for (let i = 0; i < parameters.length; i++) {
                const color = parameters[i][0], // 颜色
                    sprite = parameters[i][1],  // 纹理
                    size = parameters[i][2]; // 点的大小
                materials[i] = new Three.PointsMaterial({
                    size,
                    map: sprite,
                    blending: Three.AdditiveBlending, // 点材质混合模式
                    transparent: true, // 使用父级背景色
                    depthTest: true // 开启深度测试
                })
                // 这是颜色HLS
                materials[i].color.setHSL(color[0], color[1], color[2])
                // 创建物体
                const particles = new Three.Points(geometry, materials[i])
                const rotateNumber = Math.random() * 0.2 - 0.25
                particles.rotation.set(rotateNumber, rotateNumber, rotateNumber)
                particles.position.setZ(initZPosition)
                pointsGeometry.push(particles)
                scene.add(particles)
            }
            return pointsGeometry
        },
        renderStarMove = () => { // 渲染星星的运动
            // 星星颜色的交替变化
            const time = Date.now() * 0.00005
            for (let i = 0; i < parameters.length; i++) {
                const color = parameters[i][0],
                    h = ((360 * color[0] + time) % 360) / 360;
                materials[i].color.setHSL(color[0], color[1], parseFloat(h.toFixed(2)))
            }
            // 星星运动
            zprogress += 1
            zprogress_second += 1
            if (zprogress > zAxisNumber + depth / 2) {
                zprogress = particles_init_position
            } else {
                particles_first.forEach((item: any) => {
                    item.position.setZ(zprogress)
                })
            }
            if (zprogress_second > zAxisNumber + depth / 2) {
                zprogress_second = particles_init_position * 2
            } else {
                particles_second.forEach((item: any) => {
                    item.position.setZ(zprogress_second)
                })
            }
        },
        initCloud = (width: number, height: number) => { // 初始化星云
            const geometry = new Three.PlaneGeometry(width, height),
                textureLoader = new Three.TextureLoader(),
                cloudTexture = textureLoader.load(cloud),
                material = new Three.MeshBasicMaterial({
                    map: cloudTexture,
                    blending: Three.AdditiveBlending,
                    transparent: true,
                    depthTest: false
                }),
                cloudMesh = new Three.Mesh(geometry, material);
            scene.add(cloudMesh)
            return cloudMesh
        },
        /**
         * cloud Three创建的星云实例
         * route 星云运动轨迹
         * speed 星云速度
         */
        initCloudMove = (cloud: any, route: any[], speed: number) => { // 星云的运动效果
            let cloudProgress = 0
            // 创建运动轨迹
            const curve = new Three.CatmullRomCurve3(route)
            return () => {
                if (cloudProgress <= 1) {
                    cloudProgress += speed
                    // 获取当前位置
                    const point = curve.getPoint(cloudProgress)
                    if (point && point.x) {
                        cloud.position.set(point.x, point.y, point.z)
                    }
                } else {
                    cloudProgress = 0
                }
            }
        },
        initRenderer = () => { // 初始化渲染器
            renderer = new Three.WebGLRenderer()
            renderer.setSize(width, height)
            loginRef.value.appendChild(renderer.domElement)
        },
        initOrbitControls = () => { // 添加轨道控制器
            orbitControls = new OrbitControls(camera, renderer.domElement)
            orbitControls.enabled = true
            orbitControls.update()
        },
        animate = () => {// 动画刷新
            requestAnimationFrame(animate)
            renderSphereRotate()
            renderStarMove()

            renderCloud_first()
            renderCloud_second()

            renderer.render(scene, camera)
        };
    const initThreeScene = () => {// 初始化数据
        nextTick(() => {
            width = loginRef.value.clientWidth
            height = loginRef.value.clientHeight
            initScene()
            initSceneBg()
            initSphere()
            initLight()
            initCamera()
            particles_init_position = -zAxisNumber - depth / 2
            zprogress = particles_init_position
            zprogress_second = particles_init_position / 2
            
            particles_first = initSceneStar(zprogress)
            particles_second = initSceneStar(zprogress_second)
            renderStarMove()

            cloud_first = initCloud(400, 200)
            cloud_second = initCloud(200, 100)
            renderCloud_first = initCloudMove(cloud_first, [
                new Three.Vector3(-width / 10, 0, -depth / 2),
                new Three.Vector3(-width / 4, height / 8, 0),
                new Three.Vector3(-width / 4, 0, zAxisNumber)
            ], 0.0002)
            renderCloud_second = initCloudMove(cloud_second, [
                new Three.Vector3(width / 8, height / 8, -depth / 2),
                new Three.Vector3(width / 8, height / 8, zAxisNumber)
            ], 0.0008)

            initRenderer()
            initOrbitControls()
            animate()
        })
    }
    onMounted(() => {
        initThreeScene()
    })
</script>

<style scoped lang="less">
    .login-view {
        width: 100%;
        height: 100vh;
    }
</style>
