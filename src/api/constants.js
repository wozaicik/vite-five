export const siderbarOptions = [
  {
    id: 'A001',
    name: '测量',
    path: 'measure',
    icon: 'Mic'
  },
  {
    id: 'B001',
    name: '绘制图形',
    icon: 'Edit',
    children: [
      { id: 'B001001', name: '添加地标', path: 'addpoint', icon: 'Location' },
      { id: 'B001002', name: '绘制线条', path: 'addpolyline', icon: 'Share' },
      { id: 'B001003', name: '绘制多边形', path: 'addpolygon', icon: 'Crop' },
      { id: 'B001004', name: '绘制多面体', path: 'addpolyhedron', icon: 'Box' }
    ]
  }
]
