import * as Three from 'three'

export default function testMoving(): void {
    const w = window.innerWidth,
        h = window.innerHeight;
    
    // 创建一个场景
    const scene = new Three.Scene()

    // 创建骨架
    const geometry = new Three.BoxGeometry(1, 1, 1)
    // 创建材质
    const material = new Three.MeshBasicMaterial()
    // 创建立方体
    const cube = new Three.Mesh(geometry, material)
    // 将立方体放入场景
    scene.add(cube)

    // 创建坐标系参考
    const axes = new Three.AxesHelper(1)
    scene.add(axes)

    // 创建一个相机
    const camera = new Three.PerspectiveCamera(75, w / h , 0.1, 1000)
    // 设置相机位置
    camera.position.set(0, 0, 5)
    // 设置相机朝向
    camera.lookAt(0, 0, 0)

    // 创建一个渲染器
    const renderer = new Three.WebGLRenderer()
    // 设置渲染器大小
    renderer.setSize(w, h)
    // 渲染
    renderer.render(scene, camera)
    
    document.body.appendChild(renderer.domElement)

    // setInterval(() => {
    //     cube.rotation.z += 0.01
    //     renderer.render(scene, camera)
    // }, 1000 / 60)

    // function tick() {
    //     cube.rotation.z += 0.01
    //     renderer.render(scene, camera)
    //     requestAnimationFrame(tick)
    // }
    // tick()

    // 解决不同刷新率的问题
    // let time = Date.now()
    // function tick() {
    //     const currentTime = Date.now()
    //     const deltaTime = currentTime - time
    //     time = currentTime
    //     cube.rotation.z += deltaTime * 0.001
    //     renderer.render(scene, camera)
    //     requestAnimationFrame(tick)
    // }
    // tick()

    const clock = new Three.Clock()
    function tick () {
        const time = clock.getElapsedTime()
        cube.rotation.z = time
        cube.position.x = Math.sin(time * 2) * 2
        cube.position.y = Math.cos(time * 2) * 2
        requestAnimationFrame(tick)
        renderer.render(scene, camera)
    }
    tick()
}