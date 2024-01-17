// @ts-nocheck
import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'

export default function basicGsap() {
    let w = window.innerWidth,
        h = window.innerHeight;
    const stat = new Stat(),
        gui = new dat.GUI(),
        scene = new Three.Scene();
    
    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 100)
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)

    const light = new Three.AmbientLight(0xffffff, 0.2)
    scene.add(light)

    const axes = new Three.AxesHelper(1)
    scene.add(axes)

    const cubeInfo = {
        color: 0xff0000,
        fn: () => {
            gsap.to(cube.position, { x: 3, duration: 2, yoyo: true, repeat: -1 })
        }
    }
    const cube = new Three.Mesh(
        new Three.BoxGeometry(1, 1, 1),
        new Three.MeshBasicMaterial({ color: cubeInfo.color })
    )
    scene.add(cube)

    gui
        .add(cube.position, 'x')
        .min(0)
        .max(5)
        .step(0.01)
        .name('移动x轴坐标')
        .onChange((value) => {
            console.log('修改值：', value)
        })
        .onFinishChange((value) => {
            console.log('完全停下来：', value)
        })
    // 修改物体的颜色
    gui.addColor(cubeInfo, 'color').name('设置颜色值').onChange((value) => {
        console.log(value)
        // cube.material.color = new Three.Color(value)
        cube.material.color.set(value)
    })
    gui.add(cube, 'visible').name('是否显示')
    // 设置按钮点击触发某个事件
    gui.add(cubeInfo, 'fn').name('点击触发函数')

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(w, h)

    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stat.dom)

    // const clock = new Three.Clock(),
    //     orbitControls = new OrbitControls(camera, renderer.domElement);
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    // 设置控制器阻尼，让控制器更有真实效果，必须在动画循环里调用.update
    orbitControls.enableDamping = true

    // const animate1 = gsap.to(cube.position, {
    //     x: 5, // position 的 x 轴，变动到 5 的位置
    //     duration: 5, // 动画持续时间
    //     repeat: 2, // 动画重复多少次，无限次循环设置为 -1
    //     ease: 'power1.inOut', // 规定过渡效果的时间曲线
    //     yoyo: true, // 设置往返运动
    //     delay: 2, // 设置延迟，以 秒 为单位
    //     onStart: () => {// 开始的回调
    //         console.log('动画开始')
    //     },
    //     onComplete: () => {// 完成的回调
    //         console.log('动画完成')
    //     }
    // })
    // gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5 })

    function tick() {
        // const time = clock.getElapsedTime()
        requestAnimationFrame(tick)
        renderer.render(scene, camera)
        stat.update()
        orbitControls.update()
    }
    tick()

    // 监听画面变化，更新渲染画面
    window.addEventListener('resize', () => {
        w = window.innerWidth
        h = window.innerHeight

        // 更新摄像头
        camera.aspect = w / h
        // 更新摄像头的投影矩阵
        camera.updateProjectionMatrix()
        // 更新渲染器
        renderer.setSize(w, h)
        // 设置渲染器的像素比
        renderer.setPixelRatio(window.devicePixelRatio)
    })

    // window.addEventListener('dblclick', () => {
    //     console.log(animate1)
    //     if (animate1.isActive()) {// 判断是不是动画状态
    //         animate1.pause()// 暂停
    //     } else {
    //         animate1.resume() // 继续
    //     }
    // })

    // 控制屏幕进入全屏，退出全屏
    window.addEventListener('dblclick', () => {
        const fullscreenElement = document.fullscreenElement
        if (!fullscreenElement) {
            renderer.domElement.requestFullscreen()
        } else {
            if (document.exitFullscreen) { // W3C标准的退出全屏方法
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox特定的退出全屏方法
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome、Safari及Opera特定的退出全屏方法
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge特定的退出全屏方法
                document.msExitFullscreen();
            }
        }
    })
}