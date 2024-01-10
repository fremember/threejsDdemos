import * as Three from 'three'
export default function createCube() {
    // 创建一个场景
    const scene = new Three.Scene()
    const w = window.innerWidth
    const h = window.innerHeight

    // 创建骨架 geometry
    const geometry = new Three.BoxGeometry(1, 1, 1)
    // 创建材质 material)
    const material = new Three.MeshBasicMaterial()
    // 创建一个立方体，具有骨架和材质
    const cube = new Three.Mesh(geometry, material)

    // 将立方体放入场景
    scene.add(cube)

    // 创建灯光
    const light = new Three.AmbientLight()

    // 将灯光放入场景
    scene.add(light)

    // 创建相机
    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 1000)
    // 设置相机位置
    camera.position.set(5, 5, 5)
    // 设置相机朝向
    camera.lookAt(0, 0, 0)

    // 创建一个渲染器
    const renderer = new Three.WebGLRenderer()
    // 设置渲染器大小
    renderer.setSize(w, h)
    // 渲染
    renderer.render(scene, camera)

    console.log(renderer)
    // 将渲染的DOM内容放入页面中
    document.body.appendChild(renderer.domElement)
}