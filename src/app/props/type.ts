export interface Edge {
  name: string;
  node1: string;
  node2: string;
  time: number;
}

export interface Train {
  name: string;
  capacity: number;
  startingNode: string;
}

export interface Package {
  name: string;
  weight: number;
  startNode: string;
  endNode: string;
}

export interface Move {
  time: number; // Time in seconds
  train: string; // Train name
  startNode: string; // Starting node
  pickedPackages: string[]; // List of package names picked up
  endNode: string; // Ending node
  droppedPackages: string[]; // List of package names dropped off
}

export interface InputFormValues {
  stations: string[];
  edges: Edge[];
  trains: Train[];
  packages: Package[];
}
