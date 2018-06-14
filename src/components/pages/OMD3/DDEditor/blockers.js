export const makeItem = () => {
  return {
    id: '_' + Math.random().toString(36).substr(2, 9),
    type: 'statement',
    bucket: [],
    pos: { x: 0, y: 0, z: 0 },
    w: 30,
    h: 60,
    canDrop: true,
    isAt: false,
    next: false,
    isMainFn: false
  }
}

export const maker = () => {
  var state = {
    blockers: []
  }
  var api = {}
  api.state = state

  return api
}
