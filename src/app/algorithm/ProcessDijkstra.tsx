import React from "react";
import { Edge, Train, Package, Move, InputFormValues } from "../props/type";

// Helper function to build a graph from edges
const buildGraph = (edges: Edge[]): Record<string, Record<string, number>> => {
  const graph: Record<string, Record<string, number>> = {};

  edges.forEach((edge) => {
    if (!graph[edge.node1]) graph[edge.node1] = {};
    if (!graph[edge.node2]) graph[edge.node2] = {};
    graph[edge.node1][edge.node2] = edge.time * 60;
    graph[edge.node2][edge.node1] = edge.time * 60;
  });

  return graph;
};

// Dijkstra's algorithm to find the shortest path from a start node to all other nodes
const dijkstra = (
  startNode: string,
  stations: string[],
  graph: Record<string, Record<string, number>>
): Record<string, { time: number; path: string[]; timePath: number[] }> => {
  const distances: Record<
    string,
    { time: number; path: string[]; timePath: number[] }
  > = {};
  const visited = new Set<string>();

  // Initialize distances
  stations.forEach((station) => {
    distances[station] = { time: Infinity, path: [], timePath: [] };
  });
  distances[startNode].time = 0;
  distances[startNode].path = [startNode];
  distances[startNode].timePath = [0];

  while (visited.size < stations.length) {
    let minNode = "";
    let minTime = Infinity;

    // Find the unvisited node with the smallest distance
    for (const node in distances) {
      if (!visited.has(node) && distances[node].time < minTime) {
        minTime = distances[node].time;
        minNode = node;
      }
    }

    if (!minNode) break;
    visited.add(minNode);

    // Update distances for neighboring nodes
    for (const neighbor in graph[minNode]) {
      const newTime = distances[minNode].time + graph[minNode][neighbor];
      if (newTime < distances[neighbor].time) {
        distances[neighbor] = {
          time: newTime,
          path: [...distances[minNode].path, neighbor],
          timePath: [...distances[minNode].timePath, graph[minNode][neighbor]],
        };
      }
    }
  }

  return distances;
};

// Main function to process Dijkstra and manage train movements
const ProcessDijkstra = (data: InputFormValues): Move[] => {
  const moves: Move[] = [];
  const graph = buildGraph(data.edges);

  const packagesMap = new Map<string, Package>(
    data.packages.map((pkg) => [pkg.name, pkg])
  );

  data.trains.forEach((train) => {
    let currentNode = train.startingNode;
    let currentTime = 0;
    let carriedPackages: Package[] = [];

    while (packagesMap.size > 0) {
      let nextPackage: Package | undefined;
      let pickupPath:
        | { time: number; path: string[]; timePath: number[] }
        | undefined;
      let dropoffPath:
        | { time: number; path: string[]; timePath: number[] }
        | undefined;

      // Determine the next package to deliver
      packagesMap.forEach((pkg) => {
        const totalWeight = carriedPackages.reduce(
          (acc, p) => acc + p.weight,
          0
        );
        if (totalWeight + pkg.weight <= train.capacity) {
          const pathToStartNode = dijkstra(currentNode, data.stations, graph)[
            pkg.startNode
          ];
          const pathToDropOff = dijkstra(pkg.startNode, data.stations, graph)[
            pkg.endNode
          ];
          if (!pickupPath || pathToStartNode.time < pickupPath.time) {
            nextPackage = pkg;
            pickupPath = pathToStartNode;
            dropoffPath = pathToDropOff;
          }
        }
      });

      if (!nextPackage || !pickupPath || !dropoffPath) break;

      //   // Move to the package's start node
      //   console.log(pickupPath);
      //   console.log(nextPackage);
      //   console.log(dropoffPath);
      console.log(pickupPath.path.length - 1);
      if (pickupPath.path.length - 1 == 0) {
        moves.push({
          time: currentTime,
          train: train.name,
          startNode: pickupPath.path[0],
          pickedPackages: [nextPackage.name],
          endNode: pickupPath.path[0],
          droppedPackages: [],
        });
      }
      for (let i = 0; i < pickupPath.path.length - 1; i++) {
        console.log(i);
        currentTime += pickupPath.timePath[i + 1];
        moves.push({
          time: currentTime,
          train: train.name,
          startNode: pickupPath.path[i],
          pickedPackages:
            i === pickupPath.path.length - 2 ||
            pickupPath.path[i] === nextPackage.startNode
              ? [nextPackage.name]
              : [],
          endNode: pickupPath.path[i + 1],
          droppedPackages: [],
        });
      }
      carriedPackages.push(nextPackage);
      packagesMap.delete(nextPackage.name);
      console.log(nextPackage);

      for (let i = 0; i < dropoffPath.path.length - 1; i++) {
        currentTime += dropoffPath.timePath[i + 1];
        moves.push({
          time: currentTime,
          train: train.name,
          startNode: dropoffPath.path[i],
          pickedPackages: [],
          endNode: dropoffPath.path[i + 1],
          droppedPackages:
            dropoffPath.path[i + 1] == nextPackage.endNode
              ? [nextPackage.name]
              : [],
        });
      }

      carriedPackages = carriedPackages.filter((pkg) => pkg !== nextPackage);
    }
  });

  return moves;
};

export default ProcessDijkstra;
