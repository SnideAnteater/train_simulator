import React from "react";
import { Move } from "../props/type";

interface MoveListProps {
  moves: Move[];
}

const MoveList: React.FC<MoveListProps> = ({ moves }) => {
  const formatPackages = (packages: string[]) => {
    return packages.length > 0 ? `{${packages.join(", ")}}` : "{}";
  };
  return (
    <div>
      <label className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">
        Move List
      </label>
      {moves.length > 0 ? (
        <ul>
          {moves.map((move, index) => (
            <div key={index}>
              <li>
                <strong>Time:</strong> {move.time} seconds
                <br />
                <strong>Train:</strong> {move.train}
                <br />
                <strong>
                  Move from {move.startNode} to {move.endNode}
                </strong>
                <br />
                {move.pickedPackages.length > 0 && (
                  <span>
                    <strong>Picked up packages:</strong>{" "}
                    {move.pickedPackages.join(", ")}
                    <br />
                  </span>
                )}
                {move.droppedPackages.length > 0 && (
                  <span>
                    <strong>Dropped off packages:</strong>{" "}
                    {move.droppedPackages.join(", ")}
                    <br />
                  </span>
                )}
                <div className=" my-3">
                  <strong>W={move.time}</strong>, T={move.train}, N1=
                  {move.startNode}, P1={formatPackages(move.pickedPackages)},
                  N2={move.endNode}, P2={formatPackages(move.droppedPackages)}
                </div>
                <hr />
              </li>
            </div>
          ))}
        </ul>
      ) : (
        <p>No moves to display.</p>
      )}
    </div>
  );
};

export default MoveList;
