import React, { createContext, useEffect, useState } from "react";
import { GroupInterface, PersonInterface } from "../../types";
import { GridCellParams, GridRowModel, useGridApiRef } from "@mui/x-data-grid";
import getRandomColor from "../function";

type PersonContextType = {
  getData: () => any;

  dataPersons: GridRowModel[];
  setDataPersons: (value: GridRowModel[]) => void;

  currentRowId: string;
  setCurrentRowId: (value: string) => void;

  createPerson: () => void;
  setPersonsName: (value: string) => void;

  updatePerson: (value: GridCellParams) => void;
  apiRef: any;

  deletePerson: (selectedIds: any) => void;

  addGroup: (idOfThisPerson: string, rowId: string) => void;
  deleteGroup: (idPersons: string, idOfFather: string) => void;

  test: () => void;
};

const PersonsContext = createContext<PersonContextType>(
  {} as PersonContextType
);

function PersonsProvider({ children }: { children: React.ReactNode }) {
  const [dataPersons, setDataPersons] = useState<GridRowModel[]>([]);
  const [currentRowId, setCurrentRowId] = useState<string>(""); // to keep the id of the row modified

  // const [persons, setPersons] = useState<PersonInterface[]>([]); // stocké la personne elle même dans le state

  const [personName, setPersonsName] = useState("");

  const test = () => {
    console.log("test");
  };

  const getData = async () => {
    const response2 = await fetch("http://localhost:3000/person/");
    const persons = await response2.json();
    return persons;
  };

  const createPerson = () => {
    const body = {
      name: personName,
    };
    fetch("http://localhost:3000/person/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  };

  const apiRef = useGridApiRef();
  const updatePerson = (params: GridCellParams) => {
    setTimeout(() => {
      const updatedValue = apiRef.current.getCellValue(params.id, params.field);
      const body = {
        name: updatedValue,
      };
      fetch("http://localhost:3000/person/update/" + params.id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).then(() => {
        const updatedDataPersons = dataPersons.map((person) => {
          if (!person) {
            return person;
          }

          if (person.id === params.row.id) {
            return {
              ...person,
              name: updatedValue,
            };
          } else {
            return {
              ...person,
            };
          }
        });
        setDataPersons(updatedDataPersons);
      });
    }, 0);
  };

  const deletePerson = (selectedIds: string[]) => {
    const selectedRows = dataPersons.filter((row) =>
      selectedIds.includes(row.id)
    );
    const deleteRows = selectedRows.map((row) =>
      fetch("http://localhost:3000/person/delete/" + row.id)
    );

    Promise.all(deleteRows).then(() => {
      const updatedDataPersons = dataPersons.filter(
        (person) => !selectedRows.includes(person)
      );

      setDataPersons(updatedDataPersons);
    });
  };

  const addGroup = async (idOfThisPersons: string, rowId: string) => {
    // const body = {
    //   personFather: rowId,
    // };
    // fetch("http://localhost:3000/person/update/" + idOfThisPersons, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(body),
    // }).then(() => {
    //   const personToAdd = dataPersons.find(
    //     (person) => person.id === idOfThisPersons
    //   );
    //   const updatedDataPersons = dataPersons.map((person) => {
    //     if (person.id === rowId && personToAdd) {
    //       return {
    //         ...person,
    //         persons: person.persons
    //           ? [...person.persons, personToAdd]
    //           : [personToAdd],
    //       };
    //     }
    //     return person;
    //   });
    //   setDataPersons(updatedDataPersons);
    // });
  };

  const deleteGroup = (idPersons: string, idOfFather: string) => {
    // fetch("http://localhost:3000/deleteFromGroup/" + idPersons).then(() => {
    //   const updatedDataPersons = dataPersons.map((person) => {
    //     if (person.id === idOfFather && person.persons) {
    //       return {
    //         ...person,
    //         persons: person.persons.filter(
    //           (personChild: PersonInterface) => personChild._id !== idPersons
    //         ),
    //       };
    //     }
    //     return person;
    //   });
    //   setDataPersons(updatedDataPersons);
    // });
  };

  return (
    <PersonsContext.Provider
      value={{
        test,
        getData,
        dataPersons,
        setDataPersons,
        currentRowId,
        setCurrentRowId,
        // persons,
        // setPersons,
        createPerson,
        setPersonsName,
        updatePerson,
        apiRef,
        deletePerson,
        addGroup,
        deleteGroup,
      }}
    >
      {children}
    </PersonsContext.Provider>
  );
}

export { PersonsContext, PersonsProvider };
