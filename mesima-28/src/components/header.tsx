import { Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import GroupBtn from "./buttons";
import { useState } from "react";

function Header() {
  const [page, setPage] = useState(false);

  const myButtons = (
    <>
      <Button
        variant="contained"
        className="menu"
        disableElevation={!page}
        component={NavLink}
        to="/people"
        onClick={() => setPage(false)}
        endIcon={<PersonIcon />}
      >
        People
      </Button>
      <Button
        variant="contained"
        className="menu"
        color="error"
        disableElevation={page}
        component={NavLink}
        to="/groups"
        onClick={() => setPage(true)}
        endIcon={<GroupsIcon />}
      >
        Groups
      </Button>
    </>
  );
  return (
    <header>
      <nav>
        <GroupBtn children={myButtons}></GroupBtn>
      </nav>
    </header>
  );
}

export default Header;
