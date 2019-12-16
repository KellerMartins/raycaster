// Based on: https://github.com/ssloy/tinyraycaster/wiki
let width = 512
let height = 512
let depthStep = 0.001

function Game(mapDiagram) {
  this.player = {
    x: 0, y: 0, angle: Math.PI / 2, fov: 65,
    speed: 3, turnspeed: 4
  }

  this.map = {}

  // Textures, converted with: https://repl.it/@KellerMartins/wtex
  this.map.textures = {
    wall: {
      width: 128,
      height: 128,
      palette: [
        { r: 90, g: 90, b: 90 },
        { r: 108, g: 110, b: 91 },
        { r: 63, g: 51, b: 66 },
        { r: 72, g: 69, b: 79 },
      ],
      rawdata: "0000000000000000111111111111111111111111221111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111112211111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001122110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011221100000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000000000000000000000000000112211000000000000000000000000000000000033300000000000000000000000000000000000000000000000000000000000000000000000000000000000001122110000000000000000000000000000000000000333000000000000000000000000000000000000000000000000000000000000000000000000000000000011221100000000000000000000000000000000000000033333333333333000000000000000000000000000000000000000000000000000000000000000000000112211000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001122110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011221100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000112211000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001122110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011221100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000112211000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000022330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000223300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002233000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000022330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000223300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002233000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000022330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000223300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002233000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000022330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000223300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000332233000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003322330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033223300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000332233000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003322333000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000333333333333333333333223333333333333333333333333333333333333000000000000000000000000000000000000000000000000000000000000000000003333333333333333333332233333333333333333333333333333333333330000000000000000000000000000000000000000000000000222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222200000000000000000000000000000000000000000000000000111111111111111111111111111221111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000000001111111111111111111111111112211111111111111111111111111111111111000000000000000033330000000000000000000000000000000000000000000000000000000000000000000001122000000000000000000000000000000000000000000000000000000330000000000000000000000000000000000000000000000000000000000000000000011220000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000000000112200000000000000000000000000000000000000000000000000000003300000000000000000000000000000000000000000000000000000000000000000001122000000000000000000000000000000000000000000000000000000003330000000000000000000000000000000000000000000000000000000000000000011220000000000000000000000000000000000000000000000000000000000330000000000000000000000000000000000000000000000000000000000000000112200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001122000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011220000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000112200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001122000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033220000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000332200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003322000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033220000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000332200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003322000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033220000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000332200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003322000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033220000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000332200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003322000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033220000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000332200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003322000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033220000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000333333333333333333332200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003333333333333333333322000000000000000000000000000000000000000000000000022222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222220000000000000000000000001111111111111111111111111111221111111111111111111111111111111111111111111111111333333333333333333333333300000000000000000000000011111111111111111111111111112211111111111111111111111111111111111111111111111113333333333333333333333333000000000000000000000000000000000000000000000000001122000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011220000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000112200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001122000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011220000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000112200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001122000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000330000011220000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033000000112200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033300000000000000000003300000001122000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033003330000000000000333300000000011220000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000300000333000000033333000000000000112200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033330003000000000000000001122000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033330000000000000000011220000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033333000000000000000112200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003322000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033220000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000332200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003322000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033220000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000332200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003322000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033220000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000332200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003322000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033220000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033333333333333332200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000333333333333333322000000000000000000000000000000000000000000000000000000000000000000000000002222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222333333333333333333333333333333333333333333333333333331111111111111111111111111111111111111122111111111111111111111111111111111113333333333333333333333333333333333333333333333333333311111111111111111111111111111111111111221111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000112211000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001122110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011221100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000112211000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001122330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011223300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000112233000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001122330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011223300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000112233000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003333300000000000000000033300001122330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000333000000000000033300000011223300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033000000000003300000000112233000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003300003333330000000001122330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000333330000000000000000223300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033330000000000000002233000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033300000000000022330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000333300000000223300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003300000002233000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000022330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000223300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002233000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000022330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000223300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002233000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000022330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000223300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002233000000000000000000000000000000000"
    },

    gold: {
      width: 32,
      height: 32,
      palette: [
        null,
        { r: 20, g: 12, b: 28 },
        { r: 222, g: 238, b: 214 },
        { r: 210, g: 125, b: 44 },
        { r: 133, g: 76, b: 48 },
        { r: 218, g: 212, b: 94 },
      ],
      rawdata: "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011110000000000000000000000000011233411000000000000000000000001142533341100000000000000000000001311553234110000000000000000000013441155553411000000000000000000013444115533341100000000000000000134444411553325100000000000000000134443441155444100000000000000001344334444145344100000000000000001433334443433441000000000000001133113333445434410000000000001153443311333354344100000000001155444443331133354331000000001122444422544443113543100000000012335533443425544311410000000000155533554355333443531100000000001535553455444444554431000000000015333555445544554433310000000000153555555544224433353100000000001552254533553333333531000000000011555545333553333332310000000000001155553333533335533100000000000000113533335335533311000000000000000011333353533311000000000000000000001155533311000000000000000000000000115311000000000000000000000000000011000000000000000000000000000000000000000000000000000000000000000000000000000000"
    },

  }

  // Parse texture rawdata to 2D array
  for (var [k, v] of Object.entries(this.map.textures)) {
    this.map.textures[k].data = [...Array(v.width)].map(x => Array(v.height).fill([0, 0, 0]))
    for (let y = 0; y < v.height; y++) {
      let row = v.rawdata.slice(y * v.width, y * v.width + v.width).split("")
      for (let x = 0; x < v.width; x++) {
        this.map.textures[k].data[x][y] = v.palette[+row[x]]
      }
    }
  }

  this.entityTypes = {
    empty: 0,
    wall: 1,
    player: 2,
    gold: 3,
    fakewall: 4,
    '': 0,
    '  ': 0,
    '##': 1,
    'P': 2,
    'G': 3,
    '#F': 4,
  }

  this.map.entities = []

  this.map.diagram = mapDiagram
  var m = mapDiagram.split('\n')

  this.map.width = Math.max(...m.map(x => x.length)) / 2
  this.map.height = m.length

  // Parse map diagram to 2D data
  this.map.data = [...Array(this.map.width)].map(x => Array(this.map.height).fill(this.entityTypes.empty))
  m.map((x, i) => {
    for (let j = 0; j < x.length / 2; j++) {
      let ent = this.entityTypes[x.slice(j * 2, j * 2 + 2).trim()]
      this.map.data[j][i] = ent

      if (ent == this.entityTypes.player) {
        this.map.data[j][i] = this.entityTypes.empty
        this.player.x = j
        this.player.y = i
      } else if (ent == this.entityTypes.gold) {
        this.map.data[j][i] = this.entityTypes.empty
        this.map.entities.push({ x: j, y: i, sprite: 'gold' })
      } else if (ent == this.entityTypes.fakewall) {
        this.map.data[j][i] = this.entityTypes.empty
        this.map.entities.push({ x: j, y: i, sprite: 'wall' })
      }
    }
  })

  //================================ Rendering ================================//
  this.renderBackground = function (renderbuffer) {
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let t = (y - height / 2) / (height / 2)
        let col = y < height / 2 ? { r: 28, g: 22, b: 30 } :
          {
            r: 53 * t + 23 * (1 - t),
            g: 47 * t + 21 * (1 - t),
            b: 56 * t + 26 * (1 - t)
          }
        let i = x + y * width
        renderbuffer[i * 4] = col.r
        renderbuffer[i * 4 + 1] = col.g
        renderbuffer[i * 4 + 2] = col.b
        renderbuffer[i * 4 + 3] = 255
      }
    }
  }

  this.renderScene = function (renderbuffer) {
    let fogcol = { r: 28, g: 22, b: 30 }
    let maxdepth = Math.ceil(Math.sqrt(this.map.width * this.map.width + this.map.height * this.map.height))
    for (let x = 0; x < width; x++) {

      let angle = this.player.angle + (this.player.fov * (x / width - 0.5)) * Math.PI / 180
      let dx = Math.cos(angle)
      let dy = Math.sin(angle)


      // Original, constant step
      //for (var d = 0.1; d < 10; d+=depthStep) {
      //  let yi = Math.round(this.player.y + dy*d)
      //  let xi = Math.round(this.player.x + dx*d)
      //  if (xi >= this.map.width || xi < 0 ||
      //      yi >= this.map.height || yi < 0 ||
      //      this.map.data[xi][yi] === this.entityTypes.wall)
      //  {
      //    break
      //  }
      //}


      // Optimized, variable step
      var step = depthStep
      for (var d = 0.02; d < maxdepth; d += step) {
        let yi = Math.round(this.player.y + dy * d)
        let xi = Math.round(this.player.x + dx * d)
        if (xi >= this.map.width || xi < 0 ||
          yi >= this.map.height || yi < 0 ||
          this.map.data[xi][yi] === this.entityTypes.wall) {
          if (step > depthStep) {
            d -= step
            step = depthStep
          } else {
            break
          }
        }

        // If the next space is still empty after
        // increasing the step, increase it
        let nextstep = Math.min(1, step * 2)
        let nextx = Math.round(this.player.x + dx * (d + nextstep))
        let nexty = Math.round(this.player.y + dy * (d + nextstep))
        if (nextx < this.map.width && nextx >= 0 && this.map.data[nextx][yi] !== this.entityTypes.wall &&
          nexty < this.map.height && nexty >= 0 && this.map.data[xi][nexty] !== this.entityTypes.wall) {
          step = nextstep
        } else {
          step = depthStep
        }
      }

      // Lighting values
      let fog = Math.max(1 - d / 5, 0)
      let torch = Math.max(1 - d / 2, 0)

      // Draw wall line
      let wallSize = 1 / (d * Math.cos(angle - this.player.angle)) * 200
      let min = height / 2 - wallSize
      let max = height / 2 + wallSize
      for (var y = Math.max(min, 0); y < Math.min(max, height); y++) {
        let i = x + Math.round(y) * width

        let cy = this.player.y + dy * d
        let cx = this.player.x + dx * d
        let hitx = cx - Math.floor(cx + 0.5)
        let hity = cy - Math.floor(cy + 0.5)
        let u = 0.5 + (Math.abs(hitx) < Math.abs(hity) ? hitx : hity)
        let v = (y - min) / (max - min)

        let col = this.map.textures.wall.data
        [Math.floor(u * this.map.textures.wall.width)]
        [Math.floor(v * this.map.textures.wall.height)]

        if (col) {
          renderbuffer[i * 4] = Math.round(col.r * (fog + torch) + fogcol.r * (1 - fog))
          renderbuffer[i * 4 + 1] = Math.round(col.g * (fog + torch * 0.5) + fogcol.g * (1 - fog))
          renderbuffer[i * 4 + 2] = Math.round(col.b * fog + fogcol.b * (1 - fog))
          renderbuffer[i * 4 + 3] = d + 0.25
        }
      }
    }
  }

  this.renderSprites = function (renderbuffer) {
    let fogcol = { r: 28, g: 22, b: 30 }
    for (let e of this.map.entities) {
      let tex = this.map.textures[e.sprite]
      let diffx = e.x - this.player.x
      let diffy = e.y - this.player.y
      let spritedir = Math.atan2(diffy, diffx)

      while (spritedir - this.player.angle > Math.PI) spritedir -= 2 * Math.PI;
      while (spritedir - this.player.angle < -Math.PI) spritedir += 2 * Math.PI;

      let d = Math.sqrt(diffx * diffx + diffy * diffy)

      // Draw sprite line
      let spritesize = Math.round(Math.min(1000, height / d * tex.height / 128))
      let offsetx = Math.round((spritedir - this.player.angle) * width / (this.player.fov * Math.PI / 180) + width / 2 - spritesize / 2)
      let offsety = Math.round(height / 2 - spritesize / 2 - spritesize * (tex.height - 128) / 128)

      // Lighting values
      let fog = Math.max(1 - d / 5, 0)
      let torch = Math.max(1 - d / 2, 0)
      for (let sx = 0; sx < spritesize; sx++) {
        let x = offsetx + sx
        if (x < 0 || x >= width)
          continue
        for (let sy = 0; sy < spritesize; sy++) {
          let y = offsety + sy
          if (y < 0 || y >= height)
            continue

          let i = x + y * width
          if (renderbuffer[i * 4 + 3] < d)
            continue

          let u = sx / spritesize
          let v = sy / spritesize

          let col = tex.data[Math.floor(u * tex.width)]
          [Math.floor(v * tex.height)]

          if (col) {
            renderbuffer[i * 4] = Math.round(col.r * (fog + torch) + fogcol.r * (1 - fog))
            renderbuffer[i * 4 + 1] = Math.round(col.g * (fog + torch * 0.5) + fogcol.g * (1 - fog))
            renderbuffer[i * 4 + 2] = Math.round(col.b * fog + fogcol.b * (1 - fog))
            renderbuffer[i * 4 + 3] = d
          }
        }
      }
    }
  }

  this.renderUI = function (renderbuffer, g) {
    let mapScale = 8
    let entityScale = 4
    for (let x = 0; x < this.map.width; x++) {
      for (let y = 0; y < this.map.height; y++) {
        let ent = this.map.data[x][y]
        if (ent == this.entityTypes.empty)
          continue

        let col = { r: 0.5, g: 0.5, b: 0.5 }
        var scale = ent !== this.entityTypes.wall ? entityScale : mapScale
        for (let px = 0; px < scale; px++) {
          for (let py = 0; py < scale; py++) {
            let i = x * mapScale + px - (mapScale - scale) / 2 + (y * mapScale + py - (mapScale - scale) / 2) * width
            renderbuffer[i * 4] = col.r * 255
            renderbuffer[i * 4 + 1] = col.g * 255
            renderbuffer[i * 4 + 2] = col.b * 255
            renderbuffer[i * 4 + 3] = 255
          }
        }
      }
    }

    // Render player icon on the map
    for (let px = 0; px < entityScale; px++) {
      for (let py = 0; py < entityScale; py++) {
        let i = Math.round(this.player.x * mapScale + px + (mapScale - entityScale) / 2) +
          Math.round(this.player.y * mapScale + py + (mapScale - entityScale) / 2) * width
        renderbuffer[i * 4] = 0
        renderbuffer[i * 4 + 1] = 255
        renderbuffer[i * 4 + 2] = 0
        renderbuffer[i * 4 + 3] = 255
      }
    }
  }

  this.restoreAlpha = function (renderbuffer) {
    for (let i = 3; i < width * height * 4; i += 4) {
      renderbuffer[i] = 255
    }
  }

  this.render = function (renderbuffer) {
    g.renderBackground(renderbuffer)
    g.renderScene(renderbuffer)
    g.renderSprites(renderbuffer)
    g.renderUI(renderbuffer)
    g.restoreAlpha(renderbuffer)
  }

  //================================ Controls ================================//
  this.buttons = {
    "FWD": false, "BACK": false,
    "LEFT": false, "RIGHT": false,
    "SHOOT": false, "ESC": false
  }

  
  this.setKey = function(key, val) {
    keyToButton = {
      "Down": 'BACK',
      "ArrowDown": 'BACK',
      "Up": 'FWD',
      "ArrowUp": 'FWD',
      "Left": 'LEFT',
      "ArrowLeft": 'LEFT',
      "Right": 'RIGHT',
      "ArrowRight": 'RIGHT',
      " ": 'SHOOT',
      "Esc": 'ESC',
      "Escape": 'ESC',
    }
    this.buttons[keyToButton[key]] = val
  }

  //================================ Logic ================================//
  this.updateStep = function(deltaTime) {
    // Player movement
    let walk = this.buttons['FWD'] ? 1 : this.buttons['BACK'] ? -1 : false
    if (walk) {
      let dx = walk * Math.cos(this.player.angle) * this.player.speed * deltaTime
      let dy = walk * Math.sin(this.player.angle) * this.player.speed * deltaTime
      if (this.map.data[Math.round(this.player.x + dx)][Math.round(this.player.y + dy)] !== this.entityTypes.wall) {
        this.player.x += dx
        this.player.y += dy
      }
    }

    let turn = this.buttons['LEFT'] ? -1 : this.buttons['RIGHT'] ? 1 : false
    if (turn) {
      this.player.angle += turn * this.player.turnspeed * deltaTime
    }
  }
}



//================================ Main ================================//
var debugText = document.getElementById('debugText')

// Setup canvas 
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

canvas.width = width
canvas.height = height

var imgdata = ctx.getImageData(0, 0, width, height)
var image = imgdata.data

function resize() {
  var scale = Math.min(window.innerWidth / width, window.innerHeight / height)
  canvas.style.width = (width * scale) + "px"
  canvas.style.height = (height * scale) + "px"
}
window.addEventListener("resize", resize)
resize()


// Instantiate the game
let g = new Game(`
  ####################
  ##                ##
  ##  P     ##########
  ##        ##      ##
  ##  G G   #F      ##
  ####G ######      ##
  ##        ##      ##
  ##        ##      ##
  ##        ##      ##
  ####################
`)

// Setup key press callback
window.addEventListener('keydown', (e) => {
  if (!e.repeat)
    g.setKey(e.key, true)
})

window.addEventListener('keyup', (e) => {
  g.setKey(e.key, false)
})


// Run game
; (update = function (deltaTime) {
  let start = Date.now()
  debugText.textContent = ""

  g.updateStep(deltaTime) // Execute logic step
  g.render(image) // Render to imgdata data array
  ctx.putImageData(imgdata, 0, 0) //Pass data to canvas

  // Calculate delta time
  deltaTime = (Date.now() - start) / 1000
  debugText.textContent += deltaTime * 1000 + " ms"

  setTimeout(update, 0, deltaTime)
})(0)