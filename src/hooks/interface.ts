export type CityPath = `${string}${string}${number}`

export type CityPathsInput = CityPath[]

export interface CityNeighborsWithWeight {
    [key: string]: number
}

export type CityPathsAdjacentList = Map<string, CityNeighborsWithWeight>

export interface UseCitiesGraph {
    getDeliveryCost: (deliveryPath: string[]) => number
    getAllPathsCount: (startNode: string, targetNode: string) => number
    citiesGraph: CityPathsAdjacentList
}
