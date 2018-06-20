import * as THREE from 'three'

onmessage = (evt) => {
  var self = this
  self.localStorage = {}
  self.indexedDB = {}

  var formula = evt.data.formula

  let positions = []

  // update positions
  var mover = {
    index: 0,
    angle: 0,
    position: { x: 0, y: 0, z: 0 },
    plane: 'xy',
    reset: () => {
      mover.plane = 'xy'
      mover.angle = 0
      mover.position.x = 0
      mover.position.y = 0
      mover.position.z = 0
    },
    usePlane: (plane) => {
      mover.plane = plane
    },
    turnBy: (by, plane) => {
      mover.angle += by / 360 * (Math.PI * 2)
      mover.plane = plane || mover.plane
    },
    moveBy: (by, plane) => {
      var dx = by * Math.sin(mover.angle)
      var dy = by * Math.cos(mover.angle)
      var dz = 0.0
      mover.plane = plane || mover.plane

      if (mover.plane === 'xy') {
        mover.position.x += dx
        mover.position.y += dy
        mover.position.z += dz
      } else if (mover.plane === 'xz') {
        mover.position.x += dx
        mover.position.y += dz
        mover.position.z += dy
      } else if (mover.plane === 'yz') {
        mover.position.x += dz
        mover.position.y += dx
        mover.position.z += dy
      }

      positions[mover.index++] = mover.position.x
      positions[mover.index++] = mover.position.y
      positions[mover.index++] = mover.position.z
    }
  }
  var mover3D = {
    index: 0,
    position: new THREE.Vector3(),
    object3D: new THREE.Object3D(),
    reset: () => {
      mover3D.object3D = new THREE.Object3D()
      mover3D.position = new THREE.Vector3()
    },
    turnBy: (x, y, z) => {
      x = x || 0
      y = y || 0
      z = z || 0

      mover3D.object3D.rotation['x'] = x / 360 * (Math.PI * 2)
      mover3D.object3D.rotation['y'] = y / 360 * (Math.PI * 2)
      mover3D.object3D.rotation['z'] = z / 360 * (Math.PI * 2)
    },
    moveBy: (x, y, z) => {
      x = x || 0
      y = y || 0
      z = z || 0

      mover3D.object3D.position['x'] = x
      mover3D.object3D.position['y'] = y
      mover3D.object3D.position['z'] = z

      mover3D.object3D.updateMatrix()
      mover3D.position.applyMatrix4(mover3D.object3D.matrix)

      positions[mover3D.index++] = mover3D.position.x
      positions[mover3D.index++] = mover3D.position.y
      positions[mover3D.index++] = mover3D.position.z
    }
  }

  /* eslint-disable */
  var makeVertex = new Function('positions', 'mover2D', 'mover3D', formula)
  /* eslint-enable */
  makeVertex(positions, mover, mover3D)
  console.log(positions)
  postMessage({ positions })
}
