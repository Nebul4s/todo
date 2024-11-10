import React from "react";

const Row = ({ item, deleteTask }) => {
  return (
    <li key={item.id}>
      {item.description}
      <button className="delete--btn" onClick={() => deleteTask(item.id)}>
        delete
      </button>
    </li>
  );
};

export default Row;
