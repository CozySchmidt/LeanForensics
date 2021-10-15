import React, { useEffect } from "react";

const BatchEditorScreen = () => {
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
      });
  }, []);
  return <div>BatchEditorScreen</div>;
};

export default BatchEditorScreen;
