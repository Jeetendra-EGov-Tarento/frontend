import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { Dialog, DialogContent } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import VerticalStepper from "../Stepper";

const styles = theme => ({
  root: {
    marginTop: 24,
    width: "100%"
  }
});

const TaskDialog = props => {
  const { open, onClose, history } = props;
  let fullscreen = false;
  if (window.innerWidth <= 768) {
    fullscreen = true;
  }
  return (
    <Dialog
      fullScreen={fullscreen}
      open={open}
      onClose={onClose}
      maxWidth={false}
    >
      <DialogContent
        children={
          <Container
            children={
              <Grid container="true" sm="12" spacing={16} marginTop={16}>
                <Grid
                  style={{ alignItems: "center", display: "flex" }}
                  item
                  sm={10}
                >
                  <Typography component="h2" variant="subheading">
                    <LabelContainer
                      labelName="Task Status"
                      labelKey="TL_TASK_STATUS"
                    />
                  </Typography>
                  <Grid
                    item
                    sm={2}
                    style={{
                      textAlign: "right",
                      cursor: "pointer",
                      position: "absolute",
                      right: "20px"
                    }}
                    onClick={onClose}
                  >
                    <CloseIcon />
                  </Grid>
                </Grid>
                <VerticalStepper content={history} />
              </Grid>
            }
          />
        }
      />
    </Dialog>
  );
};

export default withStyles(styles)(TaskDialog);
