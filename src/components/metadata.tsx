import React, { useState } from "react";
import ReactDOM from "react-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";

const Component = () => {
  const [open, setOpen] = useState(true);
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>xxxx</DialogTitle>
      xxx
    </Dialog>
  );
};

export function render(dom: HTMLElement) {
  ReactDOM.render(<Component />, dom);
}
