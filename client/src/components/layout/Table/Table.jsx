import React from "react";
import "./Table.scss"

const Table = ({ table, caption }) => {
  return (
    table.length > 0 && (
      <table className="table-rule">
        <caption>{caption}</caption>
        <tbody>
          {table.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, columnIndex) => {
                return (
                  <td
                    key={columnIndex}
                    style={
                      rowIndex === 0
                        ? { background: "#efefef" }
                        : { background: "white" }
                    }
                  >
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    )
  );
};

export default Table;
