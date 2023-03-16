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

  const handleItems = (result) => {
    if (!result.destination) return;
    if (
      result.destination.droppableId === "tables" &&
      result.source.droppableId === "table2"
    ) {
      const customerList = Array.from(stateCustomers);
      const customer = customers.find((item) => item.id === result.draggableId);
      customerList.splice(result.destination.index, 0, customer);
      const orderList = Array.from(stateOrders);
      orderList.splice(result.source.index, 1);

      setStateOrders(orderList);
      setStateCustomers(customerList);
    } else if (result.destination.droppableId === "tables") {
      const customerList = Array.from(stateCustomers);
      const [reorderedCustomerlist] = customerList.splice(
        result.source.index,
        1
      );
      customerList.splice(result.destination.index, 0, reorderedCustomerlist);

      setStateCustomers(customerList);
    } else {
      if (result.source.droppableId === "tables") {
        const orderList = Array.from(stateOrders);
        const customer = customers.find(
          (item) => item.id === result.draggableId
        );
        const customerList = Array.from(stateCustomers);
        customerList.splice(result.source.index, 1);

        orderList.splice(result.destination.index, 0, customer);
        setStateCustomers(customerList);
        setStateOrders(orderList);
        const d = new Date();
        setDateDelivery({
          day: new Date(d.setDate(d.getDate() + 7)).getDate().toString(),
          month: d.getMonth() + 1,
          year: d.getFullYear(),
        });
      } else {
        const orderList = Array.from(stateCustomers);
        const [reorderedOrderlist] = orderList.splice(result.source.index, 1);
        orderList.splice(result.destination.index, 0, reorderedOrderlist);

        setStateOrders(orderList);
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
