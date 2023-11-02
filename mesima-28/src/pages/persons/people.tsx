import { useState, useEffect, forwardRef } from "react";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Slide,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AddIcon from "@mui/icons-material/Add";
import { GroupInterface, PersonInterface } from "../../types";
import GroupBtn from "../../components/buttons";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import { PersonsContext } from "../persons/personContext";

import React, { useContext } from "react";
import getRandomColor from "../function";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function People() {
  const {
    getData,
    dataPersons,
    setDataPersons,
    currentRowId,
    setCurrentRowId,
    createPerson,
    setPersonsName,
    updatePerson,
    apiRef,
    deletePerson,
    addGroup,
    deleteGroup,
  } = useContext(PersonsContext);

  const [isLoading, setIsLoading] = useState(true);
  const [openGroup, setOpenGroup] = useState(false); // check if dialog is open or not
  const [openNewRow, setOpenNewRow] = useState(false); // open dialog new row
  const [selectedValue, setSelectedValue] = useState(""); // for the select menu
  const [validPersonsList, setValidPersonsList] = useState<GridRowModel[]>([]); // list of the Persons available
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // for keep the ids

  const putDataOnTheRow = (dataPersons: PersonInterface[]) => {
    const rows: GridRowModel[] = [];
    dataPersons.forEach((person) => {
      const listGroups: GroupInterface[] = [];

      if (person.groups) {
        person.groups.forEach((group) => {
          if (person.groups) {
            group.color = getRandomColor(group.name);
          }
          listGroups.push(group);
        });
      }

      rows.push({
        id: person._id,
        name: person.name,
        groups: listGroups,
        color: getRandomColor(person.name),
      });
    });
    setDataPersons(rows);
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      console.log(data);
      putDataOnTheRow(data);
      // const response2 = await fetch("http://localhost:3000/person/");
      // const persons = await response2.json();
      // putDataOnTheRow(persons);
    };
    fetchData();
  }, []);

  const openGroupDialog = (id: string) => {
    setCurrentRowId(id);
    setOpenGroup(true);
    const currentPersons = dataPersons.find((g) => g.id === id);
    if (currentPersons) {
      const personFiltered = dataPersons.filter(
        (person) =>
          person.id !== id &&
          person.personFather !== id &&
          currentPersons.personFather !== person.id
      );
      setValidPersonsList(personFiltered);
    }
  };

  const closeDialog = (type: string) => {
    if (type === "group") {
      setOpenGroup(false);
    } else if (type === "add") {
      setOpenNewRow(false);
    }
    setSelectedValue("");
  };

  const submitGroup = () => {
    if (selectedValue.length > 0) {
      addGroup(selectedValue, currentRowId);
      closeDialog("group");
      setSelectedValue("");
    } else {
      alert("נו דיי");
    }
  };

  const putDataOnTheColumn = () => {
    const buttonStyle = {
      padding: "5px",
      borderRadius: "12px",
      color: "white",
      width: "100%",
    };

    const myButtons = (idRow: string) => (
      <>
        <Button
          variant="contained"
          className="menu"
          color="error"
          endIcon={<GroupAddIcon />}
          onClick={() => openGroupDialog(idRow)}
        >
          Add Group
        </Button>
      </>
    );

    const columns: GridColDef[] = [
      { field: "id", headerName: "ID", filterable: false, width: 100 },
      {
        field: "name",
        editable: true,
        hideable: false,
        headerName: "Name",
        width: 130,
      },
      {
        field: "groups",
        headerName: "Groups",
        width: 200,
        sortable: false,
        filterable: false,
        hideable: false,
        description: "the column of the group of this person",
        renderCell: (params) => (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              lineHeight: "normal",
            }}
          >
            {params.value.map((group: PersonInterface, index: number) => (
              <div key={index} style={{ margin: "5px" }}>
                <span style={{ ...buttonStyle, backgroundColor: group.color }}>
                  <span
                    style={{ marginRight: "5px", cursor: "pointer" }}
                    onClick={() => deleteGroup(group._id, params.row.id)}
                  >
                    ✖
                  </span>
                  {group.name}
                </span>
              </div>
            ))}
          </span>
        ),
      },
      {
        field: "buttons",
        headerName: "Action",
        renderHeader: () => (
          <div
            style={{
              display: "flex",
              width: 270,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontWeight: "var(--unstable_DataGrid-headWeight)" }}>
              Action
            </span>
            <Button
              variant="contained"
              className="menu"
              startIcon={<AddIcon />}
              onClick={() => setOpenNewRow(true)}
            >
              Add row
            </Button>
          </div>
        ),
        width: 310,
        sortable: false,
        filterable: false,
        hideable: false,
        description: "the column for the action on the person",
        renderCell: (params) => (
          <span style={{ display: "flex", alignItems: "center" }}>
            <GroupBtn children={myButtons(params.row.id)} />
          </span>
        ),
      },
    ];
    return columns;
  };

  return (
    <div style={{ width: "100%" }}>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Dialog open={openGroup} onClose={() => closeDialog("group")}>
            <DialogTitle>Select group</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please choose a group among the following
              </DialogContentText>
              <Select
                value={selectedValue}
                onChange={(event) => setSelectedValue(event.target.value)}
                fullWidth
              >
                {validPersonsList.length > 0 ? (
                  validPersonsList.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>no groups available</MenuItem>
                )}
              </Select>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => closeDialog("group")}>Cancel</Button>
              <Button onClick={submitGroup}>Confirm</Button>
            </DialogActions>
          </Dialog>

          <Dialog
            fullScreen
            open={openNewRow}
            onClose={() => closeDialog("add")}
            TransitionComponent={Transition}
          >
            <AppBar sx={{ position: "relative" }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={() => closeDialog("add")}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography
                  sx={{ ml: 2, flex: 1 }}
                  variant="h6"
                  component="div"
                >
                  Create new Persons
                </Typography>
                <Button
                  autoFocus
                  color="inherit"
                  onClick={() => {
                    createPerson();
                    closeDialog("add");
                  }}
                >
                  save
                </Button>
              </Toolbar>
            </AppBar>
            <Box
              p={3}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={3}
            >
              <form
                style={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <TextField
                  fullWidth
                  label="Name"
                  onChange={(event) => setPersonsName(event.target.value)}
                  variant="outlined"
                  margin="normal"
                />
              </form>
            </Box>
          </Dialog>

          <DataGrid
            rows={dataPersons}
            columns={putDataOnTheColumn()}
            apiRef={apiRef}
            rowHeight={100}
            style={{ lineHeight: "normal" }}
            onRowSelectionModelChange={(rowSelected: any) => {
              setSelectedIds(rowSelected);
            }}
            onCellEditStop={updatePerson}
            onCellClick={(_, event: React.MouseEvent) => {
              event.stopPropagation();
            }}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  id: false,
                },
              },
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 20, 40, 80]}
            checkboxSelection
          />
          {selectedIds.length > 0 && (
            <Button
              sx={{ marginTop: "20px" }}
              variant="contained"
              color="error"
              onClick={() => {
                deletePerson(selectedIds);
              }}
              endIcon={<DeleteIcon />}
            >
              delete the {selectedIds.length} rows select
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export default People;
