import React from 'react';
import { ReactWidget } from "@jupyterlab/apputils";
import DashboardComponent from "../components/DashboardComponent";

export class DashboardWidget extends ReactWidget {
  constructor() {
    super()
  }

  render(): JSX.Element {
    return (
      <DashboardComponent />
    )
  }
}