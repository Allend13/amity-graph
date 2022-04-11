import React from 'react'

import GraphVizualization from './GraphVizualization'
import { useCitiesGraph } from '../../hooks/useCitiesGraph'
import { CityPathsInput } from '../../hooks/interface'

const DEMO_CITIES_INPUT: CityPathsInput = ['AB1', 'AC4', 'AD10', 'BE3', 'CD4', 'CF2', 'DE1', 'EB3', 'EA2', 'FD1']

export default function CitiesGraph() {
  const { citiesGraph, getDeliveryCost, getAllPathsCount } = useCitiesGraph(DEMO_CITIES_INPUT)

  console.log('getDeliveryCost', {
    'A-B-E': getDeliveryCost(['A', 'B', 'E']),
    'A-D': getDeliveryCost(['A', 'D']),
    'E-A-C-F': getDeliveryCost(['E', 'A', 'C', 'F']),
    'A-D-F': getDeliveryCost(['A', 'D', 'F']),
  })

  console.log('getAllPathsCount', {
    ED: getAllPathsCount('E', 'D'),
    AE: getAllPathsCount('A', 'E'),
    EE: getAllPathsCount('E', 'E'),
  })

  return <GraphVizualization citiesGraph={citiesGraph} />
}
