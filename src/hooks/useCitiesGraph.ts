import { useEffect, useState, useCallback } from 'react'
import { CityPathsInput, CityPathsAdjacentList, UseCitiesGraph } from './interface'

function getAdjacentListFromCityPaths(cityPathsInput: CityPathsInput): CityPathsAdjacentList {
  const cityPathsAdjacentList: CityPathsAdjacentList = new Map()

  cityPathsInput.forEach((input) => {
    const [nodeA, nodeB, ...rest] = input.split('')

    cityPathsAdjacentList.set(nodeA, {
      ...(cityPathsAdjacentList.has(nodeA) ? cityPathsAdjacentList.get(nodeA) : {}),
      [nodeB]: Number(rest.join('')),
    })
  })

  return cityPathsAdjacentList
}

function calculateDeliveryCost(citiesGraph: CityPathsAdjacentList, deliveryPath: string[]): number {
  let cost = 0

  for (let cityIndex = 0; cityIndex < deliveryPath.length - 1; cityIndex += 1) {
    const cityId = deliveryPath[cityIndex]
    const cityNeighbors = citiesGraph.get(cityId)

    if (!cityNeighbors) {
      cost = -1
      break
    } else {
      const nextCityId = deliveryPath[cityIndex + 1]
      const pathWeight = cityNeighbors[nextCityId]

      if (pathWeight !== undefined) {
        cost += pathWeight
      } else {
        cost = -1
        break
      }
    }
  }

  return cost
}

// TODO: add max weight param
function dfs(
  citiesGraph: CityPathsAdjacentList,
  startNode: string,
  targetNode: string,
  path: string[],
  allPaths: string[][],
) {
  const directedPathFound = startNode === targetNode && path.length > 1

  if (directedPathFound) {
    allPaths.push(path)
    return
  }

  const adjCities = citiesGraph.get(startNode) || {}
  const adjCitiesIds = Object.keys(adjCities)

  for (const adjCity of adjCitiesIds) {
    // Case for round trip, ex.: E-E
    if (path[0] === adjCity && adjCity === targetNode) {
      allPaths.push(path)
      return
    }

    // Case for non-round trip, ex.: E-D
    if (!path.includes(adjCity)) {
      path.push(adjCity)
      dfs(citiesGraph, adjCity, targetNode, path, allPaths)
      path.pop()
    }
  }
}

function findAllPaths(
  citiesGraph: CityPathsAdjacentList,
  startNode: string,
  endNode: string,
): number {
  const path = [startNode]
  const allPaths: string[][] = []

  // TODO: get ride of allPaths mutation.
  dfs(citiesGraph, startNode, endNode, path, allPaths)

  return allPaths.length
}

export function useCitiesGraph(cityPathsInput: CityPathsInput): UseCitiesGraph {
  const [citiesGraph, setCitiesGraph] = useState<CityPathsAdjacentList>(new Map())

  useEffect(() => {
    setCitiesGraph(getAdjacentListFromCityPaths(cityPathsInput))
  }, cityPathsInput)

  const getDeliveryCost = useCallback((deliveryPath: string[]) => (
    calculateDeliveryCost(citiesGraph, deliveryPath)
  ), [citiesGraph])

  const getAllPathsCount = useCallback((startNode: string, targetNode: string) => (
    findAllPaths(citiesGraph, startNode, targetNode)
  ), [citiesGraph])

  return {
    getDeliveryCost,
    getAllPathsCount,
    citiesGraph,
  }
}
