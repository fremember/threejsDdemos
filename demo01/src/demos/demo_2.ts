import * as Three from 'three'

export default function testTransform(): void {
    /*
        transform 变换
            position 位置
            rotation 旋转
            scale 缩放
        坐标系：
            x: 正方向向右
            y: 正方向向上
            z: 正方向向屏幕外
    */
    const w = window.innerWidth,
        h = window.innerHeight;
    // 创建场景
    const scene = new Three.Scene()

    // 创建骨架 geometry
    const geometry = new Three.BoxGeometry(1, 1, 1)
    // 创建材质
    const material = new Three.MeshBasicMaterial()
    // 创建集合体
    const cube = new Three.Mesh(geometry, material)
    // 将立方体放入场景
    scene.add(cube)

    // 创建坐标参考
    const axes = new Three.AxesHelper(1)
    scene.add(axes)

    // position
    // cube.position.x = -1
    // cube.position.y = -1
    // cube.position.z = -1
    cube.position.set(1, 1, -1)
    console.log(cube.position)

    // Rotation
    // cube.rotation.z = 45 / 180 * Math.PI
    // cube.rotation.x = 45 / 180 * Math.PI
    // cube.rotation.y = 45 / 180 * Math.PI
    cube.rotation.set(45 / 180 * Math.PI, 45 / 180 * Math.PI, 45 / 180 * Math.PI)
    console.log(cube.rotation)

    // scale
    // cube.scale.x = 2
    // cube.scale.y = 2
    // cube.scale.z = 2
    cube.scale.set(2, 2, 2)
    console.log(cube.scale)

    // 创建灯光
    const light = new Three.AmbientLight()
    // 将灯光放入场景
    scene.add(light)

    // 创建相机
    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 1000)
    // 设置相机位置
    camera.position.set(0, 0, 5)
    // 设置相机朝向
    camera.lookAt(0, 0, 0)

    // 创建渲染器
    const renderer = new Three.WebGLRenderer()
    // 设置渲染器大小
    renderer.setSize(w, h)
    // 渲染
    renderer.render(scene, camera)

    // 将渲染的DOM内容放入页面中
    document.body.appendChild(renderer.domElement)
}