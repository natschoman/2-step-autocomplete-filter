import { createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
import { Theme, TextField } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      padding: theme.spacing(0.5),
      margin: 0,
    },
    chip: {
      margin: theme.spacing(0.5),
    },
  })
);




export const FilterTextField = withStyles((theme: Theme) => createStyles({
  root: {
    "& label.Mui-focused": {
      // color: "green",
      color: theme.palette.grey[900]
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "green",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        // borderColor: "red",
        border: "none"
      },
      "&:hover fieldset": {
        // borderColor: "yellow",
      },
      "&.Mui-focused fieldset": {
        // borderColor: "green",
      },
    },
  },
}))(TextField);