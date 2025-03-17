import React from 'react';
import { Paper, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Summary } from '../common/types';

interface SummaryComponentProps {
  summary: Summary[]
}

const SummaryComponent: React.FC<SummaryComponentProps> = (props): JSX.Element => {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'username', headerName: 'User', width: 130 },
    { field: 'nbTime', headerName: 'Notebook time', width: 130 },
    { field: 'cost', headerName: 'ToDate Cost ($)', type: 'number', width: 130 },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Monthly costs and usages to date
      </Typography>
      <Paper sx={{ p: 2, boxShadow: 3, borderRadius: 2, mb: 2 }}>
        <DataGrid
          autoHeight
          rows={props.summary}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>
    </React.Fragment>
  );
};

export default SummaryComponent;
