import { useState, useEffect, forwardRef } from "react";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRowModel,
  useGridApiRef,
} from "@mui/x-data-grid";
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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
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
import { GroupContext } from "./groupContext";
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

function Groups() {
  const {
    getData,
    dataGroups,
    setDataGroups,
    currentRowId,
    setCurrentRowId,
    persons,
    createGroup,
    setGroupName,
    updateGroup,
    apiRef,
    deleteGroup,
    addSubGroup,
    deleteSubGroup,
    addPerson,
    deletePerson,
  } = useContext(GroupContext);

  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false); // check if dialog is open or not
  const [openGroup, setOpenGroup] = useState(false);
  const [selectedValue, setSelectedValue] = useState(""); // for the select menu
  const [validGroupList, setValidGroupList] = useState<GridRowModel[]>([]); // list of the Group available
  const [validPersonList, setValidPersonList] = useState<GridRowModel[]>([]); // same things but for the person
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openNewRow, setOpenNewRow] = useState(false);

  const putDataOnTheRow = (dataGroups: GroupInterface[]) => {
    const rows: GridRowModel[] = [];
    dataGroups.forEach((group) => {
      group.persons.forEach((person) => {
        person.color = getRandomColor(person.name);
      });
      const listGroup: GroupInterface[] = [];

      if (group.groups) {
        group.groups.forEach((group) => {
          group.color = getRandomColor(group.name);
          listGroup.push(group);
        });
      }

      rows.push({
        id: group._id,
        name: group.name,
        persons: group.persons,
        groups: listGroup,
        color: getRandomColor(group.name),
        groupFather: group.groupFather,
      });
    });
    setDataGroups(rows);
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      putDataOnTheRow(data);
    };
    fetchData();
  }, []);

  const openGroupDialog = (id: string) => {
    setCurrentRowId(id);
    setOpenGroup(true);
    const currentGroup = dataGroups.find((g) => g.id === id);
    if (currentGroup) {
      const groupFiltered = dataGroups.filter(
        (group) =>
          group.id !== id &&
          group.groupFather !== id &&
          currentGroup.groupFather !== group.id
      );
      setValidGroupList(groupFiltered);
    }
  };

  const openPersonDialog = (id: string) => {
    setCurrentRowId(id);
    setOpen(true);
    const currentGroup = dataGroups.find((g) => g.id === id);
    if (currentGroup) {
      const personFiltered = persons.filter(
        (person: PersonInterface) =>
          !currentGroup.persons.some(
            (currentPerson: { _id: string }) => currentPerson._id === person._id
          )
      );
      setValidPersonList(personFiltered);
    }
  };

  const closeDialog = (type: string) => {
    if (type === "person") {
      setOpen(false);
    } else if (type === "group") {
      setOpenGroup(false);
    } else if (type === "add") {
      setOpenNewRow(false);
    }
    setSelectedValue("");
  };

  const submitPerson = () => {
    if (selectedValue.length > 0) {
      addPerson(selectedValue, currentRowId);
      closeDialog("person");
      setSelectedValue("");
    } else {
      alert("מה אתה עושה ליור אתה לא יכל !");
    }
  };

  const submitGroup = () => {
    if (selectedValue.length > 0) {
      addSubGroup(selectedValue, currentRowId);
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
          endIcon={<PersonAddIcon />}
          onClick={() => openPersonDialog(idRow)}
        >
          Add person
        </Button>
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
        field: "persons",
        headerName: "Persons",
        width: 200,
        sortable: false,
        filterable: false,
        hideable: false,
        description: "the column of the person on this group",
        renderCell: (params) => (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              lineHeight: "normal",
            }}
          >
            {params.value.map((person: PersonInterface, index: number) => (
              <div key={index} style={{ margin: "10px" }}>
                <span style={{ ...buttonStyle, backgroundColor: person.color }}>
                  <span
                    style={{ marginRight: "5px", cursor: "pointer" }}
                    onClick={() => deletePerson(person._id, params.row.id)}
                  >
                    ✖
                  </span>
                  {person.name}
                </span>
              </div>
            ))}
          </span>
        ),
      },
      {
        field: "groups",
        headerName: "Groups",
        width: 200,
        sortable: false,
        filterable: false,
        hideable: false,
        description: "the column of the groups on this group",
        renderCell: (params) => (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              lineHeight: "normal",
            }}
          >
            {params.value.map((group: GroupInterface, index: number) => (
              <div key={index} style={{ margin: "5px" }}>
                <span style={{ ...buttonStyle, backgroundColor: group.color }}>
                  <span
                    style={{ marginRight: "5px", cursor: "pointer" }}
                    onClick={() =>
                      deleteSubGroup(
                        group._id ? group._id : group.id,
                        params.row.id
                      )
                    }
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
        description: "the column for the action on the group",
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
          <Dialog open={open} onClose={() => closeDialog("person")}>
            <DialogTitle>Select name</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please choose a name among the following
              </DialogContentText>
              <Select
                value={selectedValue}
                onChange={(event) => setSelectedValue(event.target.value)}
                fullWidth
              >
                {validPersonList.length > 0 ? (
                  validPersonList.map((person) => (
                    <MenuItem key={person._id} value={person._id}>
                      {person.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>no person available</MenuItem>
                )}
              </Select>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => closeDialog("person")}>Cancel</Button>
              <Button onClick={submitPerson}>Confirm</Button>
            </DialogActions>
          </Dialog>

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
                {validGroupList.length > 0 ? (
                  validGroupList.map((group) => (
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
                  Create new Group
                </Typography>
                <Button
                  autoFocus
                  color="inherit"
                  onClick={() => {
                    createGroup();
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
                  onChange={(event) => setGroupName(event.target.value)}
                  variant="outlined"
                  margin="normal"
                />
              </form>
            </Box>
          </Dialog>

          <DataGrid
            rows={dataGroups}
            columns={putDataOnTheColumn()}
            apiRef={apiRef}
            rowHeight={100}
            style={{ lineHeight: "normal" }}
            onRowSelectionModelChange={(rowSelected: any) => {
              setSelectedIds(rowSelected);
            }}
            onCellEditStop={updateGroup}
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
                deleteGroup(selectedIds);
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

export default Groups;
