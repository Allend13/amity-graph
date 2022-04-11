import React, { useEffect, useRef, useState } from 'react'
import cytoscape from 'cytoscape'

import './styles.css'
import { GraphVizualizationProps } from './interface'

const LAYOUT: cytoscape.GridLayoutOptions = {
  // @ts-ignore
  name: 'circle',
  fit: true, // whether to fit the viewport to the graph
  padding: 30, // the padding on fit
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  avoidOverlap: true,
  nodeDimensionsIncludeLabels: false,
  spacingFactor: undefined,
  radius: undefined,
  startAngle: (3 / 2) * Math.PI,
  sweep: undefined,
  clockwise: true,
  sort: undefined,
  animate: false, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
  animateFilter() { return true },
  ready: undefined, // callback on layoutready
  stop: undefined, // callback on layoutstop
  transform(node, position) { return position },
}

const STYLE = [ // the stylesheet for the graph
  {
    selector: 'node',
    style: {
      'background-color': '#666',
      label: 'data(id)',
    },
  },

  {
    selector: 'edge',
    style: {
      width: 1,
      'line-color': '#ccc',
      'target-arrow-color': '#ccc',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
    },
  },
]

export default function GraphVizualization({
  citiesGraph,
}: GraphVizualizationProps) {
  const container = useRef(null)
  const [cyInstance, setCyInstance] = useState<null | cytoscape.Core>(null)

  useEffect(() => {
    if (container) {
      const cy = cytoscape({
        container: container.current,
        style: STYLE,
      })

      setCyInstance(cy)
    }
  }, [container])

  useEffect(() => {
    if (cyInstance) {
      const cities = Array.from(citiesGraph.keys())

      const elements = cities.reduce((allNodesAndEdges, city) => {
        allNodesAndEdges.push({
          group: 'nodes',
          data: { id: city },
        })

        const adjacentCities = citiesGraph.get(city)

        if (adjacentCities) {
          const edges: cytoscape.ElementDefinition[] = Object.keys(
            adjacentCities,
          ).map((adjacentCity) => ({
            group: 'edges',
            data: {
              id: `${city}${adjacentCity}`,
              source: city,
              target: adjacentCity,
            },
          }))

          allNodesAndEdges.push(...edges)
        }

        return allNodesAndEdges
      }, [] as cytoscape.ElementDefinition[])

      cyInstance.add(elements)
      const layout = cyInstance.elements().layout(LAYOUT)
      layout.run()
    }
  }, [cyInstance, citiesGraph])

  return <div ref={container} />
}
