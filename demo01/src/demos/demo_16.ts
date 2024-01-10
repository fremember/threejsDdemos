import * as Three from 'three'
import Stat from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function testRoad() {
    let w = window.innerWidth,
        h = window.innerHeight;
    const scene = new Three.Scene(),
        stat = new Stat();
    
    const camera = new Three.PerspectiveCamera(75, w / h, 0.1, 100)
    camera.position.set(0, 0.5, 3)
    camera.lookAt(0, 0, 0)

    scene.add(new Three.AmbientLight(0xffffff, 0.2))
    const directional = new Three.DirectionalLight(0xffffff)
    directional.position.set(0, 1, 1)
    scene.add(directional)

    const groundW = 50,
        groundH = 10;
    
    
    const groundGroup = new Three.Group(),// 地面组合
        roadGroup = new Three.Group();// 马路组合
    
    // 路面
    const roadPlane = new Three.Mesh(
        new Three.PlaneGeometry(2, groundH),
        new Three.MeshBasicMaterial({ color: 0x4c4a4d })
    )
    // 马路左侧实线
    const leftLine = new Three.Mesh(
        new Three.PlaneGeometry(0.1, groundH),
        new Three.MeshBasicMaterial({ color: 0xffffff })
    )
    leftLine.position.z = 0.0001
    leftLine.position.x = -0.8
    
    // 马路右侧实线
    const rightLine = leftLine.clone()
    rightLine.position.x = 0.8
    
    // 马路中间虚线
    const dashLineGroup = new Three.Group(),
        dashNum = 24;
    for(let i = 0; i < dashNum; i++) {
        const mesh = new Three.Mesh(
            new Three.PlaneGeometry(0.1, 0.3),
            new Three.MeshBasicMaterial({ color: 0xffffff })
        )
        mesh.position.z = 0.0001
        mesh.position.y = -groundH / 2 + 0.5 * i
        dashLineGroup.add(mesh)
    }

    // 草坪
    const frontGrass = new Three.Mesh(
        new Three.PlaneGeometry(groundW, groundH / 2),
        new Three.MeshBasicMaterial({ color: 0x61974b })
    )
    frontGrass.position.z = -0.0001
    frontGrass.position.y = -groundH / 4

    const backGrass = new Three.Mesh(
        new Three.PlaneGeometry(groundW, groundH / 2),
        new Three.MeshBasicMaterial({ color: 0xb1d744 })
    )
    backGrass.position.z = -0.0001
    backGrass.position.y = groundH / 4

    roadGroup.add(roadPlane, leftLine, rightLine, dashLineGroup)
    groundGroup.add(roadGroup, frontGrass, backGrass)
    groundGroup.rotation.x = -0.5 * Math.PI

    // 树组合
    const treesGroup = new Three.Group(),
        leftTreeGroup = new Three.Group(),
        singTreeGroup = new Three.Group();
    
    const treeTop = new Three.Mesh(
        new Three.ConeGeometry(0.2, 0.2, 5),
        new Three.MeshBasicMaterial({ color: 0x64a525 })
    )
    const treeMid = new Three.Mesh(
        new Three.ConeGeometry(0.3, 0.3, 5),
        new Three.MeshBasicMaterial({ color: 0x64a525 })
    )
    const treeBottom = new Three.Mesh(
        new Three.CylinderGeometry(0.05, 0.05, 0.4),
        new Three.MeshBasicMaterial({ color: 0x7a5753 })
    )
    const treeShadow = new Three.Mesh(
        new Three.CircleGeometry(0.3, 5),
        new Three.MeshBasicMaterial({ color: 0x3f662d })
    )
    treeTop.position.y = 0.55
    treeMid.position.y = 0.4
    treeBottom.position.y = 0.2
    treeShadow.rotation.x = -0.5 * Math.PI
    singTreeGroup.add(treeTop, treeMid, treeBottom, treeShadow)
    singTreeGroup.scale.set(0.5, 0.5, 0.5)

    const treeNum = 20
    for(let i = 0; i < treeNum; i++) {
        const group = singTreeGroup.clone()
        group.position.z = -groundH / 2 + i * 0.5
        group.position.x = -1.2 // 因为路面宽度是2，所以取 1/2 就是1，与路边的距离设0.2，则x坐标就是1.2
        leftTreeGroup.add(group)
    }
        
    const rightTreeGroup = leftTreeGroup.clone()
    rightTreeGroup.position.x = 1.2 * 2
    
    treesGroup.add(leftTreeGroup, rightTreeGroup)

    // 建筑物
    const buildingGroup = new Three.Group(),
        buildNum = 20;
    for(let i = 0; i < buildNum; i++) {
        const _w = Math.random() + 1,
            _h = Math.random() + 1,
            deep = Math.random(),
            mesh = new Three.Mesh(
                new Three.BoxGeometry(_w, _h, deep),
                new Three.MeshStandardMaterial({ color: 0x75d1c2 })
            )
        mesh.position.x = -groundW / 2 + i * 2 + (Math.random() - 0.5) * 3
        mesh.position.z = -groundH / 2
        mesh.position.y = _h / 2
        buildingGroup.add(mesh)
    }

    // 云朵
    const cloudGroup = new Three.Group(),
        cloudMaterial = new Three.MeshBasicMaterial({ color: 0xffffff }),
        cloud1 = new Three.Mesh(new Three.SphereGeometry(0.6), cloudMaterial),
        cloud2 = new Three.Mesh(new Three.SphereGeometry(0.8), cloudMaterial),
        cloud3 = new Three.Mesh(new Three.SphereGeometry(1), cloudMaterial),
        cloud4 = new Three.Mesh(new Three.SphereGeometry(0.7), cloudMaterial),
        cloud5 = new Three.Mesh(new Three.SphereGeometry(0.5), cloudMaterial);
    cloud1.position.x = -1.6
    cloud1.position.y = -0.05
    cloud2.position.x = -1
    cloud2.position.y = -0.1
    cloud4.position.x = 1
    cloud5.position.x = 1.4
    cloudGroup.add(cloud1, cloud2, cloud3, cloud4, cloud5)
    cloudGroup.position.z = -groundH / 2 - 2
    cloudGroup.position.y = 3

    scene.add(groundGroup, treesGroup, buildingGroup, cloudGroup)

    const renderer = new Three.WebGLRenderer()
    renderer.setSize(w, h)
    // 设置背景色，默认是黑色
    renderer.setClearColor(0x95e4e8)
    renderer.shadowMap.enabled = true
    renderer.render(scene, camera)

    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stat.dom)

    const clock = new Three.Clock(),
        orbitControls = new OrbitControls(camera, renderer.domElement);
    
    function tick() {
        const time = clock.getElapsedTime()

        dashLineGroup.position.y = -time * 0.2 % 3
        treesGroup.position.z = time * 0.2 % 3
        cloudGroup.position.x = Math.sin(time * 0.1) * 7

        requestAnimationFrame(tick)
        renderer.render(scene, camera)
        camera.updateProjectionMatrix()
        stat.update()
        orbitControls.update()
    }
    tick()

    window.addEventListener('resize', () => {
        w = window.innerWidth
        h = window.innerHeight

        // camera
        camera.aspect = w / h
        camera.updateProjectionMatrix()

        // render
        renderer.setSize(w, h)
    })
}