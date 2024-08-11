"use client";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { IoAddCircleOutline } from "react-icons/io5";
import { Edge, Train, Package, Move, InputFormValues } from "../props/type";
import MoveList from "./MoveList";
import ProcessDijkstra from "../algorithm/ProcessDijkstra";

const defaultValues: InputFormValues = {
  stations: ["A", "B", "C"],
  edges: [
    { name: "E1", node1: "A", node2: "B", time: 30 },
    { name: "E2", node1: "B", node2: "C", time: 10 },
  ],
  trains: [{ name: "Q1", capacity: 6, startingNode: "B" }],
  packages: [{ name: "K1", weight: 5, startNode: "A", endNode: "C" }],
};

const InputForms: React.FC = () => {
  const { register, handleSubmit, control } = useForm<InputFormValues>({
    defaultValues: defaultValues,
  });

  const { fields: edgeFields, append: appendEdge } = useFieldArray({
    control,
    name: "edges",
  });

  const { fields: trainFields, append: appendTrain } = useFieldArray({
    control,
    name: "trains",
  });

  const { fields: packagesFields, append: appendPackages } = useFieldArray({
    control,
    name: "packages",
  });

  const [moves, setMoves] = useState<Move[]>([]);

  const onSubmit = (data: InputFormValues) => {
    const generatedMoves: Move[] = ProcessDijkstra(data);
    setMoves(generatedMoves);
    // Process form data
  };

  return (
    <div className="flex flex-col border border-red-300">
      <form
        className="flex flex-row border border-blue-700 borde"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="m-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Stations
          </label>
          <input
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 
          shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
            {...register("stations")}
            placeholder="Node Name"
            defaultValue={"A,B,C"}
          />
        </div>

        <div className="m-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Edges
          </label>
          {edgeFields.map((field, index) => (
            <div key={field.id} className=" my-3">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Edge {index + 1}
              </label>
              <input
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 
          shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900 my-2"
                {...register(`edges.${index}.name` as const)}
                placeholder="Edge Name"
              />
              <input
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 
          shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900 my-2"
                {...register(`edges.${index}.node1` as const)}
                placeholder="Node 1"
              />
              <input
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 
          shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900 my-2"
                {...register(`edges.${index}.node2` as const)}
                placeholder="Node 2"
              />
              <input
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 
          shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900 my-2"
                {...register(`edges.${index}.time` as const)}
                placeholder="Time"
                type="number"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              appendEdge({ name: "", node1: "", node2: "", time: 0 })
            }
            className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 
          focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex 
          items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 
          dark:hover:bg-blue-500 my-2"
          >
            <IoAddCircleOutline size={42}></IoAddCircleOutline>
            Add Edge
          </button>
        </div>

        <div className="m-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Train
          </label>
          {trainFields.map((field, index) => (
            <div key={field.id}>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Train {index + 1}
              </label>
              <input
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 
          shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900 my-2"
                {...register(`trains.${index}.name`)}
                placeholder="Train Name"
              />
              <input
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 
          shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900 my-2"
                {...register(`trains.${index}.capacity`)}
                placeholder="Capacity (Kg)"
                type="number"
              />
              <input
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 
          shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900 my-2"
                {...register(`trains.${index}.startingNode`)}
                placeholder="Starting Node"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              appendTrain({ name: "", capacity: 0, startingNode: "" })
            }
            className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 
          focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex 
          items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 
          dark:hover:bg-blue-500 my-2"
          >
            <IoAddCircleOutline size={42}></IoAddCircleOutline>
            Add Train
          </button>
        </div>

        <div className="m-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Packages
          </label>
          {packagesFields.map((field, index) => (
            <div key={field.id}>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Package {index + 1}
              </label>
              <input
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 
          shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900 my-2"
                {...register(`packages.${index}.name`)}
                placeholder="Package Name"
              />
              <input
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 
          shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900 my-2"
                {...register(`packages.${index}.weight`)}
                placeholder="Weight (Kg)"
                type="number"
              />
              <input
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 
          shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900 my-2"
                {...register(`packages.${index}.startNode`)}
                placeholder="Start Node"
              />
              <input
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 
          shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900 my-2"
                {...register(`packages.${index}.endNode`)}
                placeholder="End Node"
              />
            </div>
          ))}
          <button
            className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 
          focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex 
          items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 
          dark:hover:bg-blue-500 my-2"
            type="button"
            onClick={() =>
              appendPackages({
                name: "",
                weight: 0,
                startNode: "",
                endNode: "",
              })
            }
          >
            <IoAddCircleOutline size={42}></IoAddCircleOutline>
            Add Package
          </button>
        </div>

        <div className="m-5">
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 
        font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 
        dark:focus:ring-blue-800"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
      <MoveList moves={moves}></MoveList>
    </div>
  );
};

export default InputForms;
