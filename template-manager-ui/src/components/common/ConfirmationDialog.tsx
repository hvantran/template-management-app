import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogMetadata } from '../GenericConstants';

export default function ConfirmationDialog(props: DialogMetadata) {

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.negativeAction}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {props.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.negativeAction} variant="contained" aria-label="button group" autoFocus>{props.negativeText}</Button>
          <Button onClick={props.positiveAction}>{props.positiveText}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}