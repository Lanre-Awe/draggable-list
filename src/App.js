import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import classes from "./app.module.css";

const customers = [
  {
    id: "1",
    name: "lanre",
    pickup: "lagos",
    dropOff: "abuja",
  },
  {
    id: "2",
    name: "funto",
    pickup: "benin",
    dropOff: "kogi",
  },
  {
    id: "3",
    name: "fisayo",
    pickup: "adamawa",
    dropOff: "Gombe",
  },
];
const orders = [];
function App() {
  const [stateCustomers, setStateCustomers] = useState(customers);
  const [stateOrders, setStateOrders] = useState(orders);
  const [date, setDateDelivery] = useState("");

  const updateList = (stateList, result, mainList) => {
    const list = Array.from(stateList);
    const item = mainList.find((item) => item.id === result.draggableId);
    list.splice(result.destination.index, 0, item);
    return list;
  };
  const listStructure = (stateList, result) => {
    const list = Array.from(stateList);
    list.splice(result.source.index, 1);
    return list;
  };
  const arrangeList = (stateList, result) => {
    const list = Array.from(stateList);
    const [reorderedList] = list.splice(result.source.index, 1);
    list.splice(result.destination.index, 0, reorderedList);

    return list;
  };

  const handleItems = (result) => {
    if (!result.destination) return;
    if (
      result.destination.droppableId === "tables" &&
      result.source.droppableId === "table2"
    ) {
      setStateOrders(listStructure(stateOrders, result));
      setStateCustomers(updateList(stateCustomers, result, customers));
    } else if (result.destination.droppableId === "tables") {
      setStateCustomers(arrangeList(stateCustomers, result));
    } else {
      if (result.source.droppableId === "tables") {
        setStateCustomers(listStructure(stateCustomers, result));
        setStateOrders(updateList(stateOrders, result, customers));
        const d = new Date();
        setDateDelivery({
          day: new Date(d.setDate(d.getDate() + 7)).getDate().toString(),
          month: d.getMonth() + 1,
          year: d.getFullYear(),
        });
      } else {
        setStateOrders(arrangeList(stateOrders, result));
      }
    }
  };

  return (
    <>
      <h1>Delivery Planner</h1>
      <p>
        <i>Drag to drop items into planner</i>
      </p>
      <DragDropContext onDragEnd={handleItems}>
        <div className={classes.customerContainer}>
          <h3>Customers</h3>
          <Droppable droppableId="tables">
            {(provided) => (
              <table
                className={classes.customer}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <thead>
                  <tr>
                    <th>Customer ID</th>
                    <th>Customer Name</th>
                    <th>Pick Up Location</th>
                    <th>Drop Up Location</th>
                  </tr>
                </thead>
                <tbody>
                  {stateCustomers.map((item, index) => {
                    return (
                      <Draggable
                        draggableId={item.id}
                        index={index}
                        key={item.id}
                      >
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.pickup}</td>
                            <td>{item.dropOff}</td>
                          </tr>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </div>
        <div className={classes.orderContainer}>
          <h3>Planner</h3>
          <table className={classes.order}>
            <thead>
              <tr>
                <th>Slot</th>
                <th>Name</th>
                <th>Pick Up</th>
                <th>DropOff</th>
                <th>Date</th>
              </tr>
            </thead>
            <Droppable droppableId="table2">
              {(provided) => (
                <tbody {...provided.droppableProps} ref={provided.innerRef}>
                  {stateOrders.map((item, index) => {
                    return (
                      <Draggable
                        draggableId={item.id}
                        index={index}
                        key={item.id}
                      >
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <th>{`Slot ${index + 1}`}</th>
                            <td>{item.name}</td>
                            <td>{item.pickup}</td>
                            <td>{item.dropOff}</td>
                            <td>
                              {date.day}-{date.month}-{date.year}
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </table>
        </div>
      </DragDropContext>
    </>
  );
}

export default App;
