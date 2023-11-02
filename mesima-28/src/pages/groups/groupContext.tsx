import React, { createContext, useEffect, useState } from "react";
import { GroupInterface, PersonInterface } from "../../types";
import {
  GridCellParams,
  GridRowModel,
  GridValidRowModel,
  useGridApiRef,
} from "@mui/x-data-grid";
import getRandomColor from "../function";
import { debug } from "console";

type GroupContextType = {
  getData: () => any;

  dataGroups: GridRowModel[];
  setDataGroups: (value: GridRowModel[]) => void;

  currentRowId: string;
  setCurrentRowId: (value: string) => void;

  persons: PersonInterface[];
  setPersons: (value: PersonInterface[]) => void;

  createGroup: () => void;
  setGroupName: (value: string) => void;

  updateGroup: (value: GridCellParams) => void;
  apiRef: any;

  deleteGroup: (selectedIds: any) => void;

  addPerson: (personId: string, groupId: string) => void;
  deletePerson: (idPerson: string, idGroup: string) => void;

  addSubGroup: (idOfThisGroup: string, rowId: string) => void;
  deleteSubGroup: (idGroup: string, idOfFather: string) => void;
};

const GroupContext = createContext<GroupContextType>({} as GroupContextType);

function GroupProvider({ children }: { children: React.ReactNode }) {
  const [dataGroups, setDataGroups] = useState<GridRowModel[]>([]);
  const [currentRowId, setCurrentRowId] = useState<string>(""); // to keep the id of the row modified

  const [persons, setPersons] = useState<PersonInterface[]>([]); // stocké la personne elle même dans le state

  const [groupName, setGroupName] = useState("");

  const getData = async () => {
    const response2 = await fetch("http://localhost:3000/person/");
    const persons = await response2.json();
    setPersons(persons);

    const response = await fetch("http://localhost:3000/group/hierarchy");
    const data = await response.json();
    return data;
  };

  // GROUP
  // rajouter toute les fonctions ici
  // corriger les problemes lorsqu'on effectue des actions

  const createGroup = () => {
    const body = {
      name: groupName,
    };
    fetch("http://localhost:3000/group/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((data) => {
        const dataJson = data.json();
        return dataJson;
      })
      .then((newGroup: GridValidRowModel) => {
        newGroup = {
          ...newGroup,
          id: newGroup._id,
          color: getRandomColor(newGroup.name),
          groupFather: undefined,
          groups: [],
          persons: [],
        };
        const updatedDataGroups = [...dataGroups, newGroup];
        setDataGroups(updatedDataGroups);
      });
  };

  const apiRef = useGridApiRef();
  const updateGroup = (params: GridCellParams) => {
    setTimeout(() => {
      const updatedValue = apiRef.current.getCellValue(params.id, params.field);
      const body = {
        name: updatedValue,
      };
      fetch("http://localhost:3000/group/update/" + params.id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).then(() => {
        const updatedDataGroups = dataGroups.map((group) => {
          if (!group.groups) {
            return group;
          }

          const updatedSubGroups = group.groups.map(
            (groupChild: GroupInterface) => {
              const groupChildId = groupChild._id
                ? groupChild._id
                : groupChild.id;
              if (groupChildId === params.row.id) {
                return {
                  ...groupChild,
                  color: getRandomColor(updatedValue),
                  name: updatedValue,
                };
              }
              return groupChild;
            }
          );
          if (group.id === params.row.id) {
            return {
              ...group,
              name: updatedValue,
              groups: updatedSubGroups,
            };
          } else {
            return {
              ...group,
              groups: updatedSubGroups,
            };
          }
        });
        setDataGroups(updatedDataGroups);
      });
    }, 0);
  };

  const deleteGroup = (selectedIds: string[]) => {
    const selectedRows = dataGroups.filter((row) =>
      selectedIds.includes(row.id)
    );
    const deleteRows = selectedRows.map((row) =>
      fetch("http://localhost:3000/group/delete/" + row.id)
    );

    Promise.all(deleteRows).then(() => {
      const allGroups = selectedIds;
      console.log(dataGroups, "tout");
      selectedRows.map((group) => {
        if (group.groups) {
          group.groups.forEach((subGroup: GridValidRowModel) => {
            allGroups.push(subGroup._id);
          });
        }
      });

      const newList = dataGroups.filter((group: any) => {
        return !allGroups.includes(group.id);
      });

      const updatedDataGroups = newList.map((group) => {
        const updatedSubGroups = group.groups.filter(
          (groupChild: GroupInterface) => !selectedIds.includes(groupChild._id)
        );
        return {
          ...group,
          groups: updatedSubGroups,
        };
      });

      setDataGroups(updatedDataGroups);
    });
  };

  const addPerson = async (personId: string, groupId: string) => {
    fetch(
      "http://localhost:3000/group/addPerson/" + personId + "/" + groupId
    ).then(() => {
      const person = persons.map((person) => {
        if (person._id === personId) {
          return {
            ...person,
            color: getRandomColor(person.name),
          };
        } else {
          return person;
        }
      });
      const addPerson = person.find((person) => person._id === personId);

      setDataGroups((prev) =>
        prev.map((group) =>
          group.id !== groupId
            ? group
            : { ...group, persons: [...group.persons, addPerson] }
        )
      );
    });
  };

  const deletePerson = (idPerson: string, idGroup: string) => {
    fetch(
      "http://localhost:3000/person/deleteFromGroup/" + idPerson + "/" + idGroup
    ).then(() => {
      const updatedDataGroups = dataGroups.map((group) => {
        if (group.id === idGroup) {
          return {
            ...group,
            persons: group.persons.filter(
              (person: PersonInterface) => person._id !== idPerson
            ),
          };
        }
        return group;
      });
      setDataGroups(updatedDataGroups);
    });
  };

  const addSubGroup = async (idOfThisGroup: string, rowId: string) => {
    const body = {
      groupFather: rowId,
    };
    fetch("http://localhost:3000/group/update/" + idOfThisGroup, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then(() => {
      const groupToAdd = dataGroups.find((group) => group.id === idOfThisGroup);

      const updatedDataGroups = dataGroups.map((group) => {
        if (group.id === rowId && groupToAdd) {
          return {
            ...group,
            groups: group.groups ? [...group.groups, groupToAdd] : [groupToAdd],
          };
        }

        return group;
      });
      setDataGroups(updatedDataGroups);
    });
  };

  const deleteSubGroup = (idGroup: string, idOfFather: string) => {
    fetch("http://localhost:3000/group/deleteFather/" + idGroup).then(() => {
      console.log(dataGroups);
      // console.log(idGroup, idOfFather);
      const updatedDataGroups = dataGroups.map((group) => {
        if (group.id === idOfFather && group.groups) {
          console.log(group, "asdas");
          return {
            ...group,
            groups: group.groups.filter(
              (groupChild: GroupInterface) =>
                groupChild._id ? groupChild._id : groupChild.id !== idGroup
              // comprendre pourquoi avec la condition ca marche pas
            ),
          };
        }
        return group;
      });
      setDataGroups(updatedDataGroups);
    });
  };

  return (
    <GroupContext.Provider
      value={{
        apiRef,
        deleteGroup,
        getData,
        dataGroups,
        setDataGroups,
        currentRowId,
        setCurrentRowId,
        persons,
        setPersons,
        createGroup,
        setGroupName,
        updateGroup,
        addPerson,
        deletePerson,
        addSubGroup,
        deleteSubGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export { GroupContext, GroupProvider };
